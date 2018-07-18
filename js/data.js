'use strict';
/* Все исходные данные здесь, никаких магических значений! */

(function () {
  var MAX_PRICE = '1 000 000';
  window.data = {
    Url: {
      LOAD: 'https://js.dump.academy/keksobooking/data',
      SAVE: 'https://js.dump.academy/keksobooking'
    },
    LimitY: {
      MIN: 130,
      MAX: 630
    },
    Price: {
      MIDDLE: 10000,
      HIGH: 50000,
      MAX: parseInt(MAX_PRICE.replace(/ /g, ''), 10)
    },
    HouseNames: {
      BUNGALO: 'Бунгало',
      FLAT: 'Квартира',
      HOUSE: 'Дом',
      PALACE: 'Дворец'
    },
    HouseMinPrices: {
      BUNGALO: '0',
      FLAT: '1 000',
      HOUSE: '5 000',
      PALACE: '1 000 000'
    },
    PINS_LIMIT: 5,
    ERROR_STYLE: 'position: fixed; top: 0; left: 0; z-index: 2; box-sizing: border-box; width: 100%; height: 100%; overflow: auto; padding-top: 300px; text-align: center; vertical-align: middle; background-color: rgba(0, 0, 0, 0.8)',
    ERROR_MESSAGE_STYLE: 'font-weight: 700; font-size: 50px; color: #ffaa99',
    TIMEOUT: 500,
    DEFAULT_AVATAR: 'img/muffin-grey.svg'
  };
})();
