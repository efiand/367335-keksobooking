'use strict';
/* Создание меток */

(function () {

  var map = document.querySelector('.map');
  var templateContent = document.querySelector('template').content;
  var mapCard;
  var mapCardClose;
  var mapCardTemplate = templateContent.querySelector('.map__card');
  var pinsBlock = document.querySelector('.map__pins');
  var pinsSelector = '.map__pin:not(.map__pin--main)';
  var pins = pinsBlock.querySelectorAll(pinsSelector);

  /* Генерация разметки метки */
  var renderPin = function (data, template) {
    var pin = template.cloneNode(true);
    var img = pin.querySelector('img');
    pin.style.left = data.location.x + 'px';
    pin.style.top = data.location.y + 'px';
    img.src = data.author.avatar;
    img.alt = data.offer.title;
    return pin;
  };

  /* Скрытие объявления */
  var closePopupClickHandler = function () {
    mapCard.classList.add('hidden');
  };
  var closePopupKeydownHandler = function (evt) {
    if (window.utils.isPressEsc(evt)) {
      closePopupClickHandler();
    }
  };

  /* Показ объявлений по клику на метки */
  var addPinListener = function (btn, data) {
    btn.addEventListener('click', function () {
      mapCard.innerHTML = window.card.renderAnnouncement(data, mapCardTemplate).innerHTML;
      mapCard.classList.remove('hidden');
      mapCard.querySelector('.popup__close').addEventListener('click', closePopupClickHandler);
    });
  };

  window.pin = {

    /* Функция генерации меток */
    add: function (data) {
      var workData = window.filter.do(data);

      /* Удаление существующих меток */
      for (var i = 0; i < pins.length; i++) {
        pinsBlock.removeChild(pins[i]);
      }

      /* Генерация новых */
      var pinsFragment = document.createDocumentFragment();
      for (i = 0; i < workData.length; i++) {
        pinsFragment.appendChild(renderPin(workData[i], templateContent.querySelector('.map__pin')));
      }
      pinsBlock.appendChild(pinsFragment);
      pins = pinsBlock.querySelectorAll(pinsSelector);

      /* Начальное скрытие меток */
      window.utils.addClassAll(pins, 'hidden');

      /* Добавление объявления на карту */
      map.insertBefore(window.card.renderAnnouncement(workData[0], mapCardTemplate), map.querySelector('.map__filters-container'));
      mapCard = map.querySelector('.map__card');
      mapCardClose = mapCard.querySelector('.popup__close');

      /* Начальное скрытие объявления */
      closePopupClickHandler();

      /* Подписка на показ объявлений по клику на метки */
      for (i = 0; i < pins.length; i++) {
        addPinListener(pins[i], workData[i]);
      }
    },

    /* При активации карты */
    activate: function () {
      mapCard.classList.remove('hidden');
      mapCardClose.addEventListener('click', closePopupClickHandler);
      document.addEventListener('keydown', closePopupKeydownHandler);
      window.utils.removeClassAll(pins, 'hidden');
    },

    deactivate: function () {
      closePopupClickHandler();
      mapCardClose.removeEventListener('click', closePopupClickHandler);
      document.removeEventListener('keydown', closePopupKeydownHandler);
      window.utils.addClassAll(pins, 'hidden');
    }
  };
})();
