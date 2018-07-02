'use strict';
/* Карта, карточки и метки на ней */

(function () {
  var map = document.querySelector('.map');
  var mapCardTemplate = window.data.templateContent.querySelector('.map__card');
  var mapCard;
  var mapPinsList = document.querySelectorAll('.map__pin:not(.map__pin--main)');
  var mainPin = document.querySelector('.map__pin--main');
  var initCoords;
  var initLeft = mainPin.style.left;
  var initTop = mainPin.style.top;
  var isActive = false;

  /* Скрытие объявления по крестику */
  var closePopupClickHandler = function () {
    mapCard.classList.add('hidden');
  };

  /* Показ объявлений по клику на метки */
  var addPinListener = function (btn) {
    btn.addEventListener('click', function () {
      var currentIndex = btn.querySelector('img').src.slice(-5, -4) - 1;
      mapCard.innerHTML = window.card.renderAnnouncement(window.data.announcements[currentIndex], mapCardTemplate).innerHTML;
      mapCard.classList.remove('hidden');
      mapCard.querySelector('.popup__close').addEventListener('click', closePopupClickHandler);
    });
  };

  /* Координаты центра (в активном состоянии - середины нижнего края) круглой метки */
  var addPinCoords = function () {
    var coordX = Math.floor(parseInt(mainPin.style.left, 10) + mainPin.clientWidth / 2);
    var y = mainPin.clientHeight;
    var coordY = Math.floor(parseInt(mainPin.style.top, 10) + (isActive ? y : y / 2));
    initCoords = coordX + ', ' + coordY;
    window.form.address.value = initCoords;
  };

  /* Перемещение метки */
  var pinMoveHandler = function (evt) {
    var horizonY = 130;
    var controlsY = 630;
    var coordLimits = {
      x: {
        min: 0,
        max: map.clientWidth - mainPin.clientWidth
      },
      y: {
        min: horizonY - mainPin.clientHeight,
        max: controlsY - mainPin.clientHeight
      }
    };
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (dropEvt) {
      var diffCoords = {
        x: startCoords.x - dropEvt.clientX,
        y: startCoords.y - dropEvt.clientY
      };
      startCoords = {
        x: dropEvt.clientX,
        y: dropEvt.clientY
      };

      var left = mainPin.offsetLeft - diffCoords.x;
      if (left > coordLimits.x.max) {
        left = coordLimits.x.max;
      } else if (left < coordLimits.x.min) {
        left = coordLimits.x.min;
      }

      var top = mainPin.offsetTop - diffCoords.y;
      if (top > coordLimits.y.max) {
        top = coordLimits.y.max;
      } else if (top < coordLimits.y.min) {
        top = coordLimits.y.min;
      }

      mainPin.style.left = left + 'px';
      mainPin.style.top = top + 'px';
    };

    var mouseUpHandler = function () {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      addPinCoords();
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };


  /* Добавление объявления на карту */
  map.insertBefore(window.card.renderAnnouncement(window.data.announcements[0], mapCardTemplate), map.querySelector('.map__filters-container'));
  mapCard = map.querySelector('.map__card');

  /* Начальное скрытие объявления */
  mapCard.classList.add('hidden');

  /* Начальное скрытие меток */
  window.utils.addClassAll(mapPinsList, 'hidden');

  mainPin.addEventListener('mousedown', pinMoveHandler);
  mapCard.querySelector('.popup__close').addEventListener('click', closePopupClickHandler);
  for (var i = 0; i < mapPinsList.length; i++) {
    addPinListener(mapPinsList[i]);
  }

  /* Определение координат */
  addPinCoords();

  /* Активация карты (по отпусканию мыши на кругой метке) */
  mainPin.addEventListener('mouseup', function () {
    if (!isActive) {
      mapCard.classList.remove('hidden');
      map.classList.remove('map--faded');
      window.form.container.classList.remove('ad-form--disabled');
      window.utils.removeAttributeAll(window.form.adGroups, 'disabled');
      window.utils.removeClassAll(mapPinsList, 'hidden');
      window.form.houseTypeChangeHandler();
      window.form.roomNumberChangeHandler();
      isActive = true;
    }
  });

  /* Деактивация (по кнопке Reset) */
  var reset = window.form.container.querySelector('[type="reset"]');
  reset.addEventListener('click', function (evt) {
    evt.preventDefault();
    for (i = 0; i < window.form.checkList.length; i++) {
      window.form.checkList[i].style.boxShadow = 'none';
    }
    isActive = false;
    window.form.container.reset();
    map.classList.add('map--faded');
    window.form.container.classList.add('ad-form--disabled');
    closePopupClickHandler();
    window.utils.addClassAll(mapPinsList, 'hidden');
    window.utils.setAttributeAll(window.form.adGroups, 'disabled');
    mainPin.style.left = initLeft;
    mainPin.style.top = initTop;
    addPinCoords();
  });
})();
