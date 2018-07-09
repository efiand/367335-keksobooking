'use strict';
/* Служебные функции */

(function () {
  var ESC_KEY = 27;
  var i;
  var lastTimeout;

  /* Конструктор объекта с координатами */
  var Coords = function (x, y) {
    this.x = x;
    this.y = y;
  };

  window.utils = {

    /* Проверка нажатия Esc */
    isPressEsc: function (evt) {
      return evt.keyCode === ESC_KEY;
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
    },

    /* Вывод ошибок запроса */
    errorHandler: function (error) {
      var node = document.createElement('div');
      node.style = window.data.errorStyle;
      node.textContent = error;
      document.body.insertAdjacentElement('afterbegin', node);
    },

    /* Перемещение элемента */
    dragDropHandler: function (evt, control, area, callback) {
      var coordLimits = {
        x: {
          min: 0,
          max: area.clientWidth - control.clientWidth
        },
        y: {
          min: window.data.limitY.min - control.clientHeight,
          max: window.data.limitY.max - control.clientHeight
        }
      };
      var startCoords = new Coords(evt.clientX, evt.clientY);

      var mouseMoveHandler = function (dropEvt) {
        var diffCoords = new Coords(startCoords.x - dropEvt.clientX, startCoords.y - dropEvt.clientY);
        startCoords.x = dropEvt.clientX;
        startCoords.y = dropEvt.clientY;

        var setProperty = function (elem, propertyJS) {
          var value = control[propertyJS] - diffCoords[elem];
          if (value > coordLimits[elem].max) {
            value = coordLimits[elem].max;
          } else if (value < coordLimits[elem].min) {
            value = coordLimits[elem].min;
          }
          return value + 'px';
        };

        control.style.left = setProperty('x', 'offsetLeft');
        control.style.top = setProperty('y', 'offsetTop');
      };

      var mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        callback();
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    },

    /* Получение координат элемента */
    getCoords: function (element, posY) {
      var coordX = Math.floor(parseInt(element.style.left, 10) + element.clientWidth / 2);
      var y = element.clientHeight;
      var coordY = Math.floor(parseInt(element.style.top, 10) + (posY === 'bottom' ? y : y / 2));
      return coordX + ', ' + coordY;
    },

    /* Устранение «дребезга» */
    debounce: function (fun) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(fun, window.data.timeout);
    },

    /* Корректировка существительных после числительных */
    numDecline: function (num, nominative, genetiveSingular, genetivePlural) {
      var answer = genetivePlural;
      var numLast = parseInt(num.toString().slice(-1), 10);
      var numLastDecim = parseInt(num.toString().slice(-2, -1), 10);
      if (numLastDecim !== 1) {
        if (numLast === 1) {
          answer = nominative;
        } else if (numLast > 1 && numLast < 5) {
          answer = genetiveSingular;
        }
      }
      return num + ' ' + answer;
    }
  };
})();
