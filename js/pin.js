'use strict';
/* Создание меток */

/* Функция генерации разметки метки */
var renderPin = function (data, template) {
  var pin = template.cloneNode(true);
  var img = pin.querySelector('img');
  pin.style.left = data.location.x + 'px';
  pin.style.top = data.location.y + 'px';
  img.src = data.author.avatar;
  img.alt = data.offer.title;
  return pin;
};

(function () {
  window.pin = {
    render: renderPin,

    /* Функция генерации разметки меток */
    add: function (data, template) {
      var pins = document.createDocumentFragment();
      for (var i = 0; i < data.length; i++) {
        pins.appendChild(renderPin(data[i], template));
      }
      return pins;
    }
  };
})();
