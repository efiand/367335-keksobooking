'use strict';

/* Исходные данные */
var ANNOUNCEMENTS_COUNT = 8;
var ANNOUNCEMENTS_DATA = {
  avatar: {
    pathMask: 'img/avatars/user',
    ext: 'png'
  },
  offerTitles: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  houseTypes: {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  },
  limX: {
    min: 300,
    max: 900
  },
  limY: {
    min: 130,
    max: 630
  },
  price: {
    min: 1000,
    max: 1000000
  },
  rooms: {
    min: 1,
    max: 5
  },
  guests: {
    min: 1,
    max: 10
  },
  checkTime: [
    '12:00',
    '13:00',
    '14:00'
  ],
  features: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ],
  photos: []
};
var PHOTOS_COUNT = 3;
for (var i = 0; i < PHOTOS_COUNT; i++) {
  ANNOUNCEMENTS_DATA['photos'][i] = 'http://o0.github.io/assets/images/tokyo/hotel' + (i + 1) + '.jpg';
}

/* Функция генерации случайного числа */
var getRandNum = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

/* Функция выбора случайного элемента массива */
var getRandElem = function (arr) {
  return arr[getRandNum(0, arr.length - 1)];
};

/* Функция перетасовки массива */
var shuffleArr = function (arr) {
  for (i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

/* Функция генерации массива объявлений */
var indexes = shuffleArr([1, 2, 3, 4, 5, 6, 7, 8]);
var getAnnouncementsList = function (data, count) {
  var announcements = [];
  for (var j = 0; j < count; j++) {
    var locX = getRandNum(data.limX.min, data.limX.max);
    var locY = getRandNum(data.limY.min, data.limY.max);
    var photos = data.photos.slice();
    var id = indexes[j];
    announcements[j] = {
      author: {
        avatar: data.avatar.pathMask + (j < 9 ? '0' : '') + (j + 1) + '.' + data.avatar.ext
      },
      offer: {
        title: data.offerTitles[id - 1],
        address: locX + ', ' + locY,
        price: getRandNum(data.price.min, data.price.max),
        type: getRandElem(Object.keys(data.houseTypes)),
        rooms: getRandNum(data.rooms.min, data.rooms.max),
        guests: getRandNum(data.guests.min, data.guests.max),
        checkin: getRandElem(data.checkTime),
        checkout: getRandElem(data.checkTime),
        features: data.features.slice(0, getRandNum(0, data.features.length - 1)),
        description: '',
        photos: shuffleArr(photos)
      },
      location: {
        x: locX,
        y: locY
      }
    };
  }
  return announcements;
};

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
  for (i = 0; i < data.length; i++) {
    pins.appendChild(renderPin(data[i], template));
  }
  return pins;
};

/* Функция генерации объявления */
var renderAnnouncement = function (data, template) {
  var announcement = template.cloneNode(true);

  announcement.querySelector('.popup__title').textContent = data.offer.title;
  announcement.querySelector('.popup__text--address').textContent = data.offer.address;
  announcement.querySelector('.popup__type').textContent = ANNOUNCEMENTS_DATA['houseTypes'][data.offer.type];
  announcement.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей.';
  announcement.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout + '.';
  announcement.querySelector('.popup__description').textContent = data.offer.description;

  var priceBlock = announcement.querySelector('.popup__text--price');
  priceBlock.textContent = data.offer.price + '\u20BD';
  var priceSpan = document.createElement('span');
  priceSpan.textContent = '/ночь';
  priceBlock.appendChild(priceSpan);

  var features = document.createDocumentFragment();
  for (i = 0; i < data.offer.features.length; i++) {
    var feature = document.createElement('li');
    feature.classList.add('popup__feature');
    feature.classList.add('popup__feature--' + data.offer.features[i]);
    features.appendChild(feature);
  }
  var featuresBlock = announcement.querySelector('.popup__features');
  featuresBlock.innerHTML = '';
  featuresBlock.appendChild(features);

  var photos = announcement.querySelector('.popup__photos');
  var photo = announcement.querySelector('.popup__photo');
  photo.src = data.offer.photos[0];
  for (i = 1; i < data.offer.photos.length; i++) {
    var anotherPhoto = photo.cloneNode(true);
    anotherPhoto.src = data.offer.photos[i];
    photos.appendChild(anotherPhoto);
  }

  announcement.querySelector('.popup__avatar').src = data.author.avatar;
  return announcement;
};

/* Добавление атрибута элементам коллекции */
var setAttributeAll = function (collect, attribute, value) {
  for (i = 0; i < collect.length; i++) {
    collect[i].setAttribute(attribute, value || '');
  }
};

/* Удаление атрибута  у элементов коллекции */
var removeAttributeAll = function (collect, attribute) {
  for (i = 0; i < collect.length; i++) {
    collect[i].removeAttribute(attribute);
  }
};

/* Добавление класса элементам коллекции */
var addClassAll = function (collect, className) {
  for (i = 0; i < collect.length; i++) {
    collect[i].classList.add(className);
  }
};

/* Удаление атрибута  у элементов коллекции */
var removeClassAll = function (collect, className) {
  for (i = 0; i < collect.length; i++) {
    collect[i].classList.remove(className);
  }
};


/* Генерация массива объявлений */
var announcements = getAnnouncementsList(ANNOUNCEMENTS_DATA, ANNOUNCEMENTS_COUNT);


/* Карта */
var map = document.querySelector('.map');


/* Добавление объявления на карту */
var templateContent = document.querySelector('template').content;
var mapCardTemplate = templateContent.querySelector('.map__card');
map.insertBefore(renderAnnouncement(announcements[0], mapCardTemplate), map.querySelector('.map__filters-container'));

/* Начальное скрытие объявления */
var mapCard = map.querySelector('.map__card');
mapCard.classList.add('hidden');

/* Скрытие объявления по крестику */
var closePopupClickHandler = function () {
  mapCard.classList.add('hidden');
};
mapCard.querySelector('.popup__close').addEventListener('click', closePopupClickHandler);


/* Генерация разметки меток */
var templatePin = templateContent.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var mainPin = document.querySelector('.map__pin--main');
mapPins.appendChild(addPins(announcements, templatePin));
var mapPinsList = document.querySelectorAll('.map__pin:not(.map__pin--main)');

/* Начальное скрытие меток */
addClassAll(mapPinsList, 'hidden');


/* Форма отправки объявлений */
var adForm = document.querySelector('.ad-form');

/* Начальное скрытие полей объявлений */
var adFormGroups = adForm.querySelectorAll('fieldset');
setAttributeAll(adFormGroups, 'disabled');

/* Соответствие типа и цены */
var minPrices = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};
var houseType = adForm.querySelector('#type');
var priceField = adForm.querySelector('#price');
var houseTypeChangeHandler = function () {
  priceField.min = minPrices[houseType.value];
  priceField.placeholder = priceField.min;
};
houseType.addEventListener('change', houseTypeChangeHandler);

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

roomNumber.addEventListener('change', roomNumberChangeHandler);
capacity.addEventListener('change', capacityChangeHandler);

/* Ссответствие времени въезда и выезда */
var timeIn = adForm.querySelector('#timein');
var timeOut = adForm.querySelector('#timeout');
var syncValues = function (field1, field2) {
  field1.value = field2.value;
};
timeIn.addEventListener('change', function () {
  syncValues(timeOut, timeIn);
});
timeOut.addEventListener('change', function () {
  syncValues(timeIn, timeOut);
});

/* Проверка на валидность */
var adFormSubmit = adForm.querySelector('.ad-form__submit');
var checkList = adForm.querySelectorAll('.ad-form input, .ad-form select');
adFormSubmit.addEventListener('click', function () {
  adForm.checkValidity();
});
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

for (i = 0; i < checkList.length; i++) {
  addInvalidListener(checkList[i]);
}


/* Активация карты */
var isActive = false;
var setActiveState = function () {
  mapCard.classList.remove('hidden');
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  removeAttributeAll(adFormGroups, 'disabled');
  removeClassAll(mapPinsList, 'hidden');
  houseTypeChangeHandler();
  roomNumberChangeHandler();
  isActive = true;
};


/* Координаты центра (в активном состоянии - середины нижнего края) круглой метки */
var initCoords;
var initLeft = mainPin.style.left;
var initTop = mainPin.style.top;
var address = adForm.querySelector('#address');
var addPinCoords = function () {
  var coordX = Math.floor(parseInt(mainPin.style.left, 10) + mainPin.clientWidth / 2);
  var y = mainPin.clientHeight;
  var coordY = Math.floor(parseInt(mainPin.style.top, 10) + (isActive ? y : y / 2));
  initCoords = coordX + ', ' + coordY;
  address.value = initCoords;
};
addPinCoords();

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
mainPin.addEventListener('mousedown', pinMoveHandler);

/* Показ объявлений по клику на метки */
var addPinListener = function (btn) {
  btn.addEventListener('click', function () {
    var currentIndex = btn.querySelector('img').src.slice(-5, -4) - 1;
    mapCard.innerHTML = renderAnnouncement(announcements[currentIndex], mapCardTemplate).innerHTML;
    mapCard.classList.remove('hidden');
    mapCard.querySelector('.popup__close').addEventListener('click', closePopupClickHandler);
  });
};
for (i = 0; i < mapPinsList.length; i++) {
  addPinListener(mapPinsList[i]);
}


/* Активация (по отпусканию мыши на кругой метке) */
mainPin.addEventListener('mouseup', function () {
  if (!isActive) {
    setActiveState();
  }
});


/* Деактивация (по кнопке Reset) */
var reset = adForm.querySelector('[type="reset"]');
reset.addEventListener('click', function (evt) {
  evt.preventDefault();
  for (i = 0; i < checkList.length; i++) {
    checkList[i].style.boxShadow = 'none';
  }
  isActive = false;
  adForm.reset();
  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
  closePopupClickHandler();
  addClassAll(mapPinsList, 'hidden');
  setAttributeAll(adFormGroups, 'disabled');
  mainPin.style.left = initLeft;
  mainPin.style.top = initTop;
  addPinCoords();
});
