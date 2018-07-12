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
  var filterForm = document.querySelector('.map__filters');
  var filterFields = filterForm.querySelectorAll('select, input');
  var filterHouse = filterForm.elements['housing-type'];
  var filterPrice = filterForm.elements['housing-price'];
  var filterRooms = filterForm.elements['housing-rooms'];
  var filterGuests = filterForm.elements['housing-guests'];
  var filterFeatures = filterForm.querySelectorAll('input');
  var dropZone = document.querySelector('.ad-form__drop-zone');
  var successMsg = document.querySelector('.success');

  /* Данные для фильтрации */
  var houses = Object.keys(window.data.house);
  var filterOptions = {
    price: {}
  };
  var doFilter = function (data, options, isActivate) {
    return data.filter(function (elem) {
      return options.type.indexOf(elem.offer.type) > -1
        && elem.offer.price >= options.price.min
        && elem.offer.price < options.price.max
        && (options.rooms < 0 ? (elem.offer.rooms >= 0) : (elem.offer.rooms === options.rooms))
        && (options.guests < 0 ? (elem.offer.guests >= 0) : (elem.offer.guests === options.guests))
        && (!isActivate ? (elem.offer.features.sort().join() === options.features.sort().join()) : elem.offer.features.length);
    }).slice(0, window.data.pinsLimit);
  };

  /* Скрытие окна успешной отправки */
  window.utils.setModalHandlers(successMsg);

  /* Координаты центра (в активном состоянии - середины нижнего края) круглой метки */
  var addPinCoords = function () {
    window.form.address.value = window.utils.getCoords(mainPin, (isActive ? 'bottom' : 'center'));
  };

  /* Перемещение метки */
  var pinMoveHandler = function (evt) {
    window.utils.dragDropHandler(evt, mainPin, map, addPinCoords);
  };

  /* Drag and drop фото в браузер */
  var picsDropHandler = function (evt) {
    window.upload.dropZoneHandler(evt, dropZone, window.upload.doList);
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
    dropZone.addEventListener('dragenter', picsDropHandler);
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
    dropZone.removeEventListener('dragenter', picsDropHandler);
    mainPin.style.left = initLeft;
    mainPin.style.top = initTop;
    addPinCoords();
  };

  /* Смена фильтра */
  var renderFilteredPens = function (data, options, isActivate) {
    options.type = (filterHouse.value === 'any') ? houses : [filterHouse.value];

    options.price.min = 0;
    if (filterPrice.value === 'middle') {
      options.price.min = window.data.Price.MIDDLE;
    } else if (filterPrice.value === 'high') {
      options.price.min = window.data.Price.HIGH;
    }
    options.price.max = window.data.Price.MAX;
    if (filterPrice.value === 'middle') {
      options.price.max = window.data.Price.HIGH;
    } else if (filterPrice.value === 'low') {
      options.price.max = window.data.Price.MIDDLE;
    }

    options.rooms = -1;
    if (filterRooms.value !== 'any') {
      options.rooms = parseInt(filterRooms.value, 10);
    }

    options.guests = -1;
    if (filterGuests.value !== 'any') {
      options.guests = parseInt(filterGuests.value, 10);
    }

    options.features = [];
    filterFeatures.forEach(function (elem) {
      if (elem.checked) {
        options.features.push(elem.value);
      }
    });

    window.pin.render(doFilter(data, options, isActivate));
  };
  var fieldsHandler = function (elem, data, options) {
    elem.addEventListener('change', function () {
      window.utils.debounce(function () {
        renderFilteredPens(data, options);
      });
    });
  };

  /* Обработка данных: генерация разметки и подписка на события */
  var loadHandler = function (data) {

    /* Генерация разметки меток и объявлений */
    renderFilteredPens(data, filterOptions, true);

    isLoadData = true;
    setActiveState();
    addPinCoords();

    map.addEventListener('click', function (evt) {
      var title = evt.target.alt || '';
      if (evt.target.className === 'map__pin') {
        title = evt.target.querySelector('img').alt;
      }
      if (title) {
        for (i = 0; i < data.length; i++) {
          if (data[i].offer.title === title) {
            window.pin.addPinListener(data[i]);
            break;
          }
        }
      }
    });

    /* Фильтрация меток */
    for (var i = 0; i < filterFields.length; i++) {
      fieldsHandler(filterFields[i], data, filterOptions);
    }
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
    }
  });

  /* Деактивация (по кнопке Reset) */
  resetBtn.addEventListener('click', function (evt) {
    evt.preventDefault();
    setInactiveState();
  });
})();
