'use strict';
/* Карта, карточки и метки на ней */

(function () {
  var successMsg = document.querySelector('.success');
  var dropZone = window.form.container.querySelector('.ad-form__drop-zone');
  var dropZoneAvatar = window.form.container.querySelector('.ad-form-header__drop-zone');
  var resetBtn = window.form.container.querySelector('[type="reset"]');
  var map = window.pin.map;
  var mainPin = map.querySelector('.map__pin--main');
  var initLeft = mainPin.style.left;
  var initTop = mainPin.style.top;
  var filterNode = map.querySelector('.map__filters-container');
  var filterForm = map.querySelector('.map__filters');
  var filterFields = filterForm.querySelectorAll('select, input');
  var filterHouse = filterForm.querySelector('#housing-type');
  var filterPrice = filterForm.querySelector('#housing-price');
  var filterRooms = filterForm.querySelector('#housing-rooms');
  var filterGuests = filterForm.querySelector('#housing-guests');
  var filterFeatures = filterForm.querySelectorAll('input');
  var isActive = false;
  var isLoadData = false;

  /* Данные для фильтрации */
  var houses = Object.keys(window.data.house);
  var filterOptions = {
    price: {}
  };
  var doFilter = function (data, options) {
    var doFilterFeature = function (feature, featureData) {
      return options.features.indexOf(feature) > -1 ? featureData.offer.features.indexOf(feature) > -1 : featureData;
    };
    return data.filter(function (elem) {
      return options.type.indexOf(elem.offer.type) > -1
        && elem.offer.price >= options.price.min
        && elem.offer.price < options.price.max
        && (options.rooms < 0 ? (elem.offer.rooms >= 0) : (elem.offer.rooms === options.rooms))
        && (options.guests < 0 ? (elem.offer.guests >= 0) : (elem.offer.guests === options.guests))
        && doFilterFeature('wifi', elem)
        && doFilterFeature('dishwasher', elem)
        && doFilterFeature('parking', elem)
        && doFilterFeature('washer', elem)
        && doFilterFeature('elevator', elem)
        && doFilterFeature('conditioner', elem);
    }).slice(0, window.data.pinsLimit);
  };

  /* Координаты центра (в активном состоянии - середины нижнего края) круглой метки */
  var addPinCoords = function () {
    window.form.address.value = window.utils.getCoords(mainPin, (isActive ? 'bottom' : 'center'));
  };

  /* Перемещение главной метки */
  var pinMoveHandler = function (evt) {
    window.utils.dragDropHandler(evt, mainPin, map, addPinCoords);
  };

  /* Drag and drop фото в браузер */
  var picsDropHandler = function (evt) {
    window.upload.dropZoneHandler(evt, dropZone, window.upload.photosField);
  };
  var avatarDropHandler = function (evt) {
    window.upload.dropZoneHandler(evt, dropZoneAvatar, window.upload.avatarField);
  };

  /* Активное состояние */
  var setActiveState = function () {
    isActive = true;
    map.classList.remove('map--faded');
    window.form.container.classList.remove('ad-form--disabled');
    window.utils.removeAttributeAll(window.form.adGroups, 'disabled');
    filterNode.classList.remove('hidden');
    window.form.houseTypeChangeHandler();
    window.form.roomNumberChangeHandler();
    window.pin.activate();
    dropZone.addEventListener('dragenter', picsDropHandler);
    dropZoneAvatar.addEventListener('dragenter', avatarDropHandler);
  };

  /* Неактивное состояние */
  var setInactiveState = function () {
    isActive = false;
    window.form.checkList.forEach(function (elem) {
      elem.style.boxShadow = 'none';
    });
    window.form.container.reset();
    window.form.container.querySelector('.ad-form-header__preview img').src = window.data.defaultAvatar;
    window.upload.resetPhotos();
    map.classList.add('map--faded');
    window.form.container.classList.add('ad-form--disabled');
    window.pin.deactivate();
    window.utils.setAttributeAll(window.form.adGroups, 'disabled');
    filterNode.classList.add('hidden');
    filterForm.querySelectorAll('select').forEach(function (elem) {
      elem.value = 'any';
    });
    filterFeatures.forEach(function (elem) {
      elem.checked = false;
    });
    dropZone.removeEventListener('dragenter', picsDropHandler);
    dropZoneAvatar.removeEventListener('dragenter', avatarDropHandler);
    mainPin.style.left = initLeft;
    mainPin.style.top = initTop;
    addPinCoords();
  };

  /* Смена фильтра */
  var renderFilteredPens = function (data, options) {
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

    window.pin.render(doFilter(data, options));
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
      var thisPin = evt.target.parentNode;
      if (evt.target.className === 'map__pin') {
        title = evt.target.querySelector('img').alt;
        thisPin = evt.target;
      }
      if (title) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].offer.title === title) {
            window.pin.addPinListener(data[i], thisPin);
            break;
          }
        }
      }
    });

    /* Фильтрация меток */
    filterFields.forEach(function (elem) {
      fieldsHandler(elem, data, filterOptions);
    });
  };


  /* Стартовые координаты метки */
  addPinCoords();

  /* Дефолтное состояние фильтров */
  filterNode.classList.add('hidden');

  /* Скрытие окна успешной отправки */
  window.utils.setModalHandlers(successMsg);

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
    if (window.form.container.checkValidity()) {
      evt.preventDefault();
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
