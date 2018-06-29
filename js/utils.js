'use strict';
/* Служебные функции */

(function () {
  var i;

  /* Функция генерации случайного числа */
  var getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };


  window.utils = {
    getRandomNumber: getRandomNumber,

    /* Выбор случайного элемента массива */
    getRandomElement: function (arr) {
      return arr[getRandomNumber(0, arr.length - 1)];
    },

    /* Перетасовка массива */
    shuffleArray: function (arr) {
      for (i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
      return arr;
    },

    /* Добавление атрибута элементам коллекции */
    setAttributeAll: function (collect, attribute, value) {
      for (i = 0; i < collect.length; i++) {
        collect[i].setAttribute(attribute, value || '');
      }
    },

    /* Удаление атрибута  у элементов коллекции */
    removeAttributeAll: function (collect, attribute) {
      for (i = 0; i < collect.length; i++) {
        collect[i].removeAttribute(attribute);
      }
    },

    /* Добавление класса элементам коллекции */
    addClassAll: function (collect, className) {
      for (i = 0; i < collect.length; i++) {
        collect[i].classList.add(className);
      }
    },

    /* Удаление класса у элементов коллекции */
    removeClassAll: function (collect, className) {
      for (i = 0; i < collect.length; i++) {
        collect[i].classList.remove(className);
      }
    }
  };
})();
