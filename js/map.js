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
var getAnnouncementsList = function (data, count) {
  var announcements = [];
  var indexes = shuffleArr([1, 2, 3, 4, 5, 6, 7, 8]);
  for (var j = 0; j < count; j++) {
    var locX = getRandNum(data.limX.min, data.limX.max);
    var locY = getRandNum(data.limY.min, data.limY.max);
    var photos = data.photos.slice();
    var id = indexes[i];
    announcements[i] = {
      author: {
        avatar: data.avatar.pathMask + (id < 10 ? '0' : '') + id + '.' + data.avatar.ext
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

/* Генерация разметки меток */
var pins = document.createDocumentFragment();
for (i = 0; i < announcements.length; i++) {
  pins.appendChild(renderPin(announcements[i], templatePin));
}
document.querySelector('.map__pins').appendChild(pins);

/* Получение шаблона разметки объявления */
var templateAnnouncement = templateContent.querySelector('.map__card');

/* Функция генерации объявления */
var renderAnnouncement = function (data, template) {
  var announcement = template.cloneNode(true);
  var elems = Object.keys(data.elements);
  for (i = 0; i < elems.length; i++) {
    announcement.querySelector('.' + data.block + '__' + elems[i]).innerHTML = data.elements[elems[i]];
  }
  var features = document.createDocumentFragment();
  for (i = 0; i < data.features.length; i++) {
    var feature = document.createElement('li');
    var featureClass = data.block + '__feature';
    feature.classList.add(featureClass);
    feature.classList.add(featureClass + '--' + data.features[i]);
    features.appendChild(feature);
  }
  var featuresBlock = announcement.querySelector('.' + data.block + '__features');
  featuresBlock.innerHTML = '';
  featuresBlock.appendChild(features);
  var photos = announcement.querySelector('.' + data.block + '__photos');
  var photo = announcement.querySelector('.' + data.block + '__photo');
  photo.src = data.photos[0];
  for (i = 1; i < data.photos.length; i++) {
    var anotherPhoto = photo.cloneNode(true);
    anotherPhoto.src = data.photos[i];
    photos.appendChild(anotherPhoto);
  }
  announcement.querySelector('.' + data.block + '__avatar').src = data.avatar;
  return announcement;
};

/* Добавление объявления на карту */
var map = document.querySelector('.map');
var announcement = announcements[0];
map.insertBefore(renderAnnouncement({
  block: 'popup',
  elements: {
    'title': announcement.offer.title,
    'text--address': announcement.offer.address,
    'text--price': announcement.offer.price + '&#x20bd;<span>/ночь</span>',
    'type': ANNOUNCEMENTS_DATA['houseTypes'][announcement.offer.type],
    'text--capacity': announcement.offer.rooms + ' комнаты для ' + announcement.offer.guests + ' гостей.',
    'text--time': 'Заезд после ' + announcement.offer.checkin + ', выезд до ' + announcement.offer.checkout + '.',
    'description': announcement.offer.description
  },
  features: announcement.offer.features,
  photos: announcement.offer.photos,
  avatar: announcement.author.avatar
}, templateAnnouncement), map.querySelector('.map__filters-container')
);

/* Активизация карты */
map.classList.toggle('map--faded');
