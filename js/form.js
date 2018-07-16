'use strict';
/* Форма объявления */

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFormGroups = adForm.querySelectorAll('fieldset');
  var houseType = adForm.querySelector('#type');
  var priceField = adForm.querySelector('#price');

  /* Соответствие типа и цены */
  var minPrices = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var houseTypeChangeHandler = function () {
    priceField.min = minPrices[houseType.value];
    priceField.placeholder = priceField.min;
  };

  /* Соответствие комнат и мест */
  var roomLimits = {
    1: ['1'],
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: ['0']
  };
  var roomOptions;
  var roomNumber = adForm.querySelector('#room_number');
  var capacity = adForm.querySelector('#capacity');
  var capacityOptions = adForm.querySelectorAll('#capacity option');

  var roomNumberChangeHandler = function () {
    roomOptions = roomLimits[roomNumber.value];
    for (i = 0; i < capacityOptions.length; i++) {
      if (roomOptions.indexOf(capacityOptions[i].value) === -1) {
        capacityOptions[i].setAttribute('hidden', '');
      } else {
        capacityOptions[i].removeAttribute('hidden');
      }
    }
    capacityChangeHandler();
  };

  var capacityChangeHandler = function () {
    roomOptions = roomLimits[roomNumber.value];
    if (roomOptions.indexOf(capacity.value) === -1) {
      capacity.setCustomValidity('Число гостей не соответствует ограничениям для данного числа комнат!');
    } else {
      capacity.setCustomValidity('');
    }
  };

  /* Ссответствие времени въезда и выезда */
  var timeIn = adForm.querySelector('#timein');
  var timeOut = adForm.querySelector('#timeout');
  var syncValues = function (field1, field2) {
    field1.value = field2.value;
  };

  /* Проверка на валидность */
  var submitBtn = adForm.querySelector('.ad-form__submit');
  var checkList = adForm.querySelectorAll('.ad-form input, .ad-form select');
  var invalidBorder = '0 0 2px 2px #ff6547';
  var addInvalidListener = function (elem) {
    var elemChangeHandler = function () {
      elem.style.boxShadow = elem.validity.valid ? 'none' : invalidBorder;
    };
    elem.addEventListener('invalid', elemChangeHandler);
    elem.addEventListener('input', elemChangeHandler);
    if (elem.tagName === 'SELECT') {
      elem.addEventListener('change', elemChangeHandler);
    }
  };


  /* Начальное скрытие полей объявлений */
  window.utils.setAttributeAll(adFormGroups, 'disabled');

  houseType.addEventListener('change', houseTypeChangeHandler);
  roomNumber.addEventListener('change', roomNumberChangeHandler);
  capacity.addEventListener('change', capacityChangeHandler);
  timeIn.addEventListener('change', function () {
    syncValues(timeOut, timeIn);
  });
  timeOut.addEventListener('change', function () {
    syncValues(timeIn, timeOut);
  });

  /* Валидация */
  for (var i = 0; i < checkList.length; i++) {
    addInvalidListener(checkList[i]);
  }


  window.form = {
    container: adForm,
    address: adForm.querySelector('#address'),
    adGroups: adFormGroups,
    houseTypeChangeHandler: houseTypeChangeHandler,
    roomNumberChangeHandler: roomNumberChangeHandler,
    checkList: checkList,
    submitBtn: submitBtn
  };
})();
