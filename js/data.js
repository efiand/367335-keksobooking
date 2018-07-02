'use strict';
/* Создание данных */

(function () {
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

  /* Функция генерации массива объявлений */
  var indexes = window.utils.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8]);
  var getAnnouncementsList = function (data, count) {
    var announcements = [];
    for (var j = 0; j < count; j++) {
      var locX = window.utils.getRandomNumber(data.limX.min, data.limX.max);
      var locY = window.utils.getRandomNumber(data.limY.min, data.limY.max);
      var photos = data.photos.slice();
      var id = indexes[j];
      announcements[j] = {
        author: {
          avatar: data.avatar.pathMask + (j < 9 ? '0' : '') + (j + 1) + '.' + data.avatar.ext
        },
        offer: {
          title: data.offerTitles[id - 1],
          address: locX + ', ' + locY,
          price: window.utils.getRandomNumber(data.price.min, data.price.max),
          type: window.utils.getRandomElement(Object.keys(data.houseTypes)),
          rooms: window.utils.getRandomNumber(data.rooms.min, data.rooms.max),
          guests: window.utils.getRandomNumber(data.guests.min, data.guests.max),
          checkin: window.utils.getRandomElement(data.checkTime),
          checkout: window.utils.getRandomElement(data.checkTime),
          features: data.features.slice(0, window.utils.getRandomNumber(0, data.features.length - 1)),
          description: '',
          photos: window.utils.shuffleArray(photos)
        },
        location: {
          x: locX,
          y: locY
        }
      };
    }
    return announcements;
  };


  window.data = {
    src: ANNOUNCEMENTS_DATA,
    templateContent: document.querySelector('template').content,

    /* Генерация массива объявлений */
    announcements: getAnnouncementsList(ANNOUNCEMENTS_DATA, ANNOUNCEMENTS_COUNT)
  };
})();
