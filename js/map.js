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

/* Генерация массива объявлений */
var announcements = getAnnouncementsList(ANNOUNCEMENTS_DATA, ANNOUNCEMENTS_COUNT);

/* Получение шаблона разметки метки */
var templateContent = document.querySelector('template').content;
var templatePin = templateContent.querySelector('.map__pin');

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

/* Генерация разметки меток */
var mapPins = document.querySelector('.map__pins');
mapPins.appendChild(addPins(announcements, templatePin));

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

/* Добавление объявления на карту */
var map = document.querySelector('.map');
var mapCardTemplate = templateContent.querySelector('.map__card');
map.insertBefore(renderAnnouncement(announcements[0], mapCardTemplate), map.querySelector('.map__filters-container'));
var mapCard = map.querySelector('.map__card');
mapCard.classList.add('hidden');

/* Показ объявлений по клмку на метки */
var mapPinsClickHandler = function (evt) {
  var targetBtn;
  if (evt.path[1].classList.value === 'map__pin') {
    targetBtn = evt.path[1];
  } else if (evt.path[0].classList.value === 'map__pin') {
    targetBtn = evt.path[0];
  }
  if (targetBtn) {
    var currentIndex = targetBtn.querySelector('img').src.slice(-5, -4) - 1;
    mapCard.innerHTML = renderAnnouncement(announcements[currentIndex], mapCardTemplate).innerHTML;
  }
};

/* Активизация карты */
var mainPin = document.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var adFormGroups = adForm.querySelectorAll('fieldset');
var setActiveState = function () {
  if (map.classList.contains('map--faded')) {
    map.classList.remove('map--faded');
  }
  if (adForm.classList.contains('ad-form--disabled')) {
    adForm.classList.remove('ad-form--disabled');
  }
  for (i = 0; i < adFormGroups.length; i++) {
    if (adFormGroups[i].hasAttribute('disabled')) {
      adFormGroups[i].removeAttribute('disabled');
    }
  }
  mapCard.classList.remove('hidden');
};

/* Координаты середины нижнего края круглой метки */
var addInitCoords = function (evt) {
  var coordX = evt.pageX + evt.srcElement.clientWidth / 2;
  var coordY = evt.pageY + evt.srcElement.clientHeight;
  document.getElementById('address').value = coordX + ', ' + coordY;
};

mainPin.addEventListener('mouseup', function (evt) {
  setActiveState();
  addInitCoords(evt);
  mapPins.addEventListener('click', mapPinsClickHandler);
});
