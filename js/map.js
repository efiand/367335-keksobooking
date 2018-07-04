'use strict';
/* Карта, карточки и метки на ней */

(function () {
  var map = document.querySelector('.map');
  var templateContent = document.querySelector('template').content;
  var mapCardTemplate = templateContent.querySelector('.map__card');
  var resetBtn = window.form.container.querySelector('[type="reset"]');
  var successMsg = document.querySelector('.success');
  var mapCard;
  var mapCardClose;
  var mapPinsList;
  var mainPin = document.querySelector('.map__pin--main');
  var initLeft = mainPin.style.left;
  var initTop = mainPin.style.top;
  var isActive = false;
  var isLoadData = false;

  /* Скрытие объявления */
  var closePopupClickHandler = function () {
    mapCard.classList.add('hidden');
  };
  var closePopupKeydownkHandler = function (evt) {
    if (window.utils.isPressEsc(evt)) {
      closePopupClickHandler();
    }
  };

  /* Скрытие окна успешной отправки */
  var successMsgClickHandler = function () {
    successMsg.classList.add('hidden');
  };
  var successMsgKeydownHandler = function (evt) {
    if (window.utils.isPressEsc(evt)) {
      successMsgClickHandler();
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

  /* Координаты центра (в активном состоянии - середины нижнего края) круглой метки */
  var addPinCoords = function () {
    window.form.address.value = window.utils.getCoords(mainPin, (isActive ? 'bottom' : 'center'));
  };

  /* Перемещение метки */
  var pinMoveHandler = function (evt) {
    window.utils.dragDropHandler(evt, mainPin, map, addPinCoords);
  };

  /* Активное состояние */
  var setActiveState = function () {
    isActive = true;
    mapCard.classList.remove('hidden');
    map.classList.remove('map--faded');
    window.form.container.classList.remove('ad-form--disabled');
    window.utils.removeAttributeAll(window.form.adGroups, 'disabled');
    window.utils.removeClassAll(mapPinsList, 'hidden');
    window.form.houseTypeChangeHandler();
    window.form.roomNumberChangeHandler();
    mapCardClose.addEventListener('click', closePopupClickHandler);
    document.addEventListener('keydown', closePopupKeydownkHandler);
    document.removeEventListener('click', successMsgClickHandler);
    document.removeEventListener('keydown', successMsgKeydownHandler);
  };

  /* Неактивное состояние */
  var setInactiveState = function () {
    isActive = false;
    for (var i = 0; i < window.form.checkList.length; i++) {
      window.form.checkList[i].style.boxShadow = 'none';
    }
    window.form.container.reset();
    map.classList.add('map--faded');
    window.form.container.classList.add('ad-form--disabled');
    closePopupClickHandler();
    window.utils.addClassAll(mapPinsList, 'hidden');
    window.utils.setAttributeAll(window.form.adGroups, 'disabled');
    mainPin.style.left = initLeft;
    mainPin.style.top = initTop;
    addPinCoords();
    mapCardClose.removeEventListener('click', closePopupClickHandler);
    document.removeEventListener('keydown', closePopupKeydownkHandler);
  };

  /* Обработка данных: генерация разметки и подписка на события */
  var loadHandler = function (data) {

    /* Генерация разметки меток */
    document.querySelector('.map__pins').appendChild(window.pin.add(data, templateContent.querySelector('.map__pin')));
    mapPinsList = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    /* Начальное скрытие меток */
    window.utils.addClassAll(mapPinsList, 'hidden');

    /* Добавление объявления на карту */
    map.insertBefore(window.card.renderAnnouncement(data[0], mapCardTemplate), map.querySelector('.map__filters-container'));
    mapCard = map.querySelector('.map__card');
    mapCardClose = mapCard.querySelector('.popup__close');

    /* Начальное скрытие объявления */
    closePopupClickHandler();

    /* Подписка на показ объявлений по клику на метки */
    for (var i = 0; i < mapPinsList.length; i++) {
      addPinListener(mapPinsList[i], data[i]);
    }

    isLoadData = true;
    setActiveState();
    addPinCoords();
  };


  /* Стартовые координаты метки */
  addPinCoords();

  /* Подписка на перемещение главной метки */
  mainPin.addEventListener('mousedown', pinMoveHandler);

  /* Активация карты (по отпусканию мыши на кругой метке) */
  mainPin.addEventListener('mouseup', function () {
    if (!isLoadData) {
      /* Получение данных и их обработка */
      window.backend.load(loadHandler, window.utils.errorHandler);
    } else if (!isActive) {
      setActiveState();
    }
  });

  /* Обработка сабмита */
  window.form.submitBtn.addEventListener('click', function (evt) {
    evt.preventDefault();
    if (window.form.container.checkValidity()) {
      window.backend.save(new FormData(window.form.container), function () {
        setInactiveState();
        successMsg.classList.remove('hidden');
      }, window.utils.errorHandler);
      document.addEventListener('click', successMsgClickHandler);
      document.addEventListener('keydown', successMsgKeydownHandler);
    }
  });

  /* Деактивация (по кнопке Reset) */
  resetBtn.addEventListener('click', function (evt) {
    evt.preventDefault();
    setInactiveState();
  });
})();
