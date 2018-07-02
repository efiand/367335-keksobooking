'use strict';
/* Создание меток */

(function () {
  var templatePin = window.data.templateContent.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');

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

  /* Функция генерации разметки меток */
  var addPins = function (data, template) {
    var pins = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      pins.appendChild(renderPin(data[i], template));
    }
    return pins;
  };

  /* Генерация разметки меток */
  mapPins.appendChild(addPins(window.data.announcements, templatePin));
})();
