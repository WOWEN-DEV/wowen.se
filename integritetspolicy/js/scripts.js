window.onload = function() {

  var messagesEl = document.querySelector('.messages');
  var typingSpeed = 0;
  var loadingText = '<b>•</b><b>•</b><b>•</b>';
  var messageIndex = 0;

  var getCurrentTime = function() {
    var date = new Date();
    var hours =  date.getHours();
    var minutes =  date.getMinutes();
    var current = hours + (minutes * .01);
    if (current >= 5 && current < 19) return 'Ha en bra dag!';
    if (current >= 19 && current < 22) return 'Ha en trevlig kväll!';
    if (current >= 22 || current < 5) return 'Godnatt!';
  }

  var messages = [
    '🔒 Integritetspolicy – uppdaterad 2020-03-15',
    '<strong>Insamling av information:</strong> Den här webbsidan samlar in information från dig när du kontaktar WOWEN via ett kontaktformulär. Den insamlade informationen inkluderar din e-postadress. När du besöker webbplatsen tar vi dessutom automatiskt emot och sparar information från din dator och webbläsare, inklusive din IP-adress, uppgifter om programvara och hårdvara och den begärda sidan.',
    '<strong>Så använder WOWEN din information:</strong> <br>• För att kontakta dig via e-post <br>• Förbättringar av hemsida och användarupplevelsen <br> • Förbättra service och ditt behov av hjälp',
     '<strong>Utlämnande till tredje part:</strong> WOWEN säljer, handlar, eller på annat sätt överför inte personligt identifierbar information till utomstående parter. Detta inkluderar inte betrodd tredjepart som hjälper till att driva webbplatsen, med kravet att dessa parter godkänner att hålla informationen konfidentiell.',
     '<strong>Informationsskydd:</strong> Vi vidtar en rad olika säkerhetsåtgärder för att skydda dina personliga uppgifter. Vi använder oss av avancerade krypteringsmetoder för att skydda känsliga uppgifter som överförs över internet. Endast medarbetare som ska uträtta specifika tjänster får tillgång till personligt identifierbar information. De datorer/servrar som används för att lagra personligt identifierbar information lagras i en säker miljö.',
      '<strong>Radera personuppgifter:</strong> Du kan när som helst kontakta WOWEN på <a href="mailto:emma%40wowen.se">emma@wowen.se</a> för att få information om vilka personuppgifter som finns sparat om dig eller om du vill att vi raderar dina personuppgifter.',
       '<strong>Samtycke:</strong> Genom att använda denna webbplats och kontaktformulär godkänner du denna integritetspolicy.',
    'Tack för att du läste ända hit.',
        getCurrentTime()
  ]

  var getFontSize = function() {
    return parseInt(getComputedStyle(document.body).getPropertyValue('font-size'));
  }

  var pxToRem = function(px) {
    return px / getFontSize() + 'rem';
  }

  var createBubbleElements = function(message, position) {
    var bubbleEl = document.createElement('div');
    var messageEl = document.createElement('span');
    var loadingEl = document.createElement('span');
    bubbleEl.classList.add('bubble');
    bubbleEl.classList.add('is-loading');
    bubbleEl.classList.add('cornered');
    bubbleEl.classList.add(position === 'right' ? 'right' : 'left');
    messageEl.classList.add('message');
    loadingEl.classList.add('loading');
    messageEl.innerHTML = message;
    loadingEl.innerHTML = loadingText;
    bubbleEl.appendChild(loadingEl);
    bubbleEl.appendChild(messageEl);
    bubbleEl.style.opacity = 0;
    return {
      bubble: bubbleEl,
      message: messageEl,
      loading: loadingEl
    }
  }

  var getDimentions = function(elements) {
    return dimensions = {
      loading: {
        w: '4rem',
        h: '2.25rem'
      },
      bubble: {
        w: pxToRem(elements.bubble.offsetWidth + 4),
        h: pxToRem(elements.bubble.offsetHeight)
      },
      message: {
        w: pxToRem(elements.message.offsetWidth + 4),
        h: pxToRem(elements.message.offsetHeight)
      }
    }
  }

  var sendMessage = function(message, position) {
    var loadingDuration = (message.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed) + 500;
    var elements = createBubbleElements(message, position);
    messagesEl.appendChild(elements.bubble);
    messagesEl.appendChild(document.createElement('br'));
    var dimensions = getDimentions(elements);
    elements.bubble.style.width = '0rem';
    elements.bubble.style.height = dimensions.loading.h;
    elements.message.style.width = dimensions.message.w;
    elements.message.style.height = dimensions.message.h;
    elements.bubble.style.opacity = 1;
    var bubbleOffset = elements.bubble.offsetTop + elements.bubble.offsetHeight;
    if (bubbleOffset > messagesEl.offsetHeight) {
      var scrollMessages = anime({
        targets: messagesEl,
        scrollTop: bubbleOffset,
        duration: 750
      });
    }
    var bubbleSize = anime({
      targets: elements.bubble,
      width: ['0rem', dimensions.loading.w],
      marginTop: ['2.5rem', 0],
      marginLeft: ['-2.5rem', 0],
      duration: 800,
      easing: 'easeOutElastic'
    });
    var loadingLoop = anime({
      targets: elements.bubble,
      scale: [1.05, .95],
      duration: 1100,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutQuad'
    });
    var dotsStart = anime({
      targets: elements.loading,
      translateX: ['-2rem', '0rem'],
      scale: [.5, 1],
      duration: 400,
      delay: 25,
      easing: 'easeOutElastic',
    });
    var dotsPulse = anime({
      targets: elements.bubble.querySelectorAll('b'),
      scale: [1, 1.25],
      opacity: [.5, 1],
      duration: 300,
      loop: true,
      direction: 'alternate',
      delay: function(i) {return (i * 100) + 50}
    });
    setTimeout(function() {
      loadingLoop.pause();
      dotsPulse.restart({
        opacity: 0,
        scale: 0,
        loop: false,
        direction: 'forwards',
        update: function(a) {
          if (a.progress >= 65 && elements.bubble.classList.contains('is-loading')) {
            elements.bubble.classList.remove('is-loading');
            anime({
              targets: elements.message,
              opacity: [0, 1],
              duration: 300,
            });
          }
        }
      });
      bubbleSize.restart({
        scale: 1,
        width: [dimensions.loading.w, dimensions.bubble.w ],
        height: [dimensions.loading.h, dimensions.bubble.h ],
        marginTop: 0,
        marginLeft: 0,
        begin: function() {
          if (messageIndex < messages.length) elements.bubble.classList.remove('cornered');
        }
      })
    }, loadingDuration - 50);
  }

  var sendMessages = function() {
    var message = messages[messageIndex];
    if (!message) return;
    sendMessage(message);
    ++messageIndex;
    setTimeout(sendMessages, (message.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed) + anime.random(900, 1200));
  }

  sendMessages();

}
