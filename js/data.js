'use strict';
/* Все исходные данные здесь, никаких магических значений! */

(function () {
  window.data = {
    pinsLimit: 5,
    Price: {
      MIDDLE: 10000,
      HIGH: 50000,
      MAX: 10000000
    },
    errorStyle: 'position: fixed; top: 0; left: 0; z-index: 100; width: 100%; padding: 30px; text-align: center; color: #ffffff; background-color: rgba(0, 0, 0, 0.6)',
    house: {
      palace: 'Дворец',
      flat: 'Квартира',
      house: 'Дом',
      bungalo: 'Бунгало'
    },
    features: [
      'wifi',
      'dishwasher',
      'parking',
      'washer',
      'elevator',
      'conditioner'
    ],
    limitY: {
      min: 130,
      max: 630
    },
    url: {
      load: 'https://js.dump.academy/keksobooking/data',
      save: 'https://js.dump.academy/keksobooking'
    },
    timeout: 500,
    defaultAvatar: 'img/muffin-grey.svg'
  };
})();
