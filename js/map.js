'use strict';
/* Карта, карточки и метки на ней */

(function () {
  var map = document.querySelector('.map');
  var resetBtn = window.form.container.querySelector('[type="reset"]');
  var mainPin = document.querySelector('.map__pin--main');
  var initLeft = mainPin.style.left;
  var initTop = mainPin.style.top;
  var isActive = false;
  var isLoadData = false;

  /* Скрытие окна успешной отправки */
  var successMsg = document.querySelector('.success');
  var successMsgClickHandler = function () {
    successMsg.classList.add('hidden');
  };
  var successMsgKeydownHandler = function (evt) {
    if (window.utils.isPressEsc(evt)) {
      successMsgClickHandler();
    }
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
    map.classList.remove('map--faded');
    window.form.container.classList.remove('ad-form--disabled');
    window.utils.removeAttributeAll(window.form.adGroups, 'disabled');
    window.form.houseTypeChangeHandler();
    window.form.roomNumberChangeHandler();
    window.pin.activate();
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
    window.pin.deactivate();
    window.utils.setAttributeAll(window.form.adGroups, 'disabled');
    mainPin.style.left = initLeft;
    mainPin.style.top = initTop;
    addPinCoords();
  };

  /* Обработка данных: генерация разметки и подписка на события */
  var loadHandler = function (data) {

    /* Генерация разметки меток и объявлений */
    window.pin.add(data);

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
