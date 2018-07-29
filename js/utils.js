'use strict';
/* Служебные функции */

(function () {
  var ESC_KEY = 27;
  var lastTimeout;

  /* Конструктор объекта с координатами */
  var Coords = function (x, y) {
    this.x = x;
    this.y = y;
  };

  /* Проверка нажатия Esc */
  var isPressEsc = function (evt) {
    return evt.keyCode === ESC_KEY;
  };

  /* Добавление обработчиков на закрытие модального блока */
  var setModalHandlers = function (node) {
    node.addEventListener('click', function () {
      node.classList.add('hidden');
    });
    document.addEventListener('keydown', function (evt) {
      if (isPressEsc(evt)) {
        node.classList.add('hidden');
      }
    });
  };

  window.utils = {
    isPressEsc: isPressEsc,
    setModalHandlers: setModalHandlers,

    /* Добавление атрибута элементам коллекции */
    setAttributeAll: function (elements, attribute, value) {
      elements.forEach(function (elem) {
        elem.setAttribute(attribute, value || '');
      });
    },

    /* Удаление атрибута  у элементов коллекции */
    removeAttributeAll: function (elements, attribute) {
      elements.forEach(function (elem) {
        elem.removeAttribute(attribute);
      });
    },

    /* Добавление класса элементам коллекции */
    addClassAll: function (elements, className) {
      elements.forEach(function (elem) {
        elem.classList.add(className);
      });
    },

    /* Удаление класса у элементов коллекции */
    removeClassAll: function (elements, className) {
      elements.forEach(function (elem) {
        elem.classList.remove(className);
      });
    },

    /* Вывод ошибок запроса */
    errorHandler: function (error) {
      var node = document.querySelector('.error');
      if (node) {
        node.classList.remove('hidden');
      } else {
        node = document.createElement('div');
        node.classList.add('error');
        node.style = window.data.ERROR_STYLE;
        var message = document.createElement('p');
        message.style = window.data.ERROR_MESSAGE_STYLE;
        message.textContent = error;
        node.appendChild(message);
        document.body.insertAdjacentElement('afterbegin', node);
        setModalHandlers(node);
      }
    },

    /* Перемещение элемента */
    dragDropHandler: function (evt, control, area, callback) {
      var offsetControl = Math.floor(control.clientWidth / 2);
      var coordLimits = {
        x: {
          min: 0 - offsetControl,
          max: area.clientWidth - offsetControl
        },
        y: {
          min: window.data.LimitY.MIN - control.clientHeight,
          max: window.data.LimitY.MAX - control.clientHeight
        }
      };
      var startCoords = new Coords(evt.clientX, evt.clientY);

      var mouseMoveHandler = function (dropEvt) {
        var diffCoords = new Coords(startCoords.x - dropEvt.clientX, startCoords.y - dropEvt.clientY);
        startCoords.x = dropEvt.clientX;
        startCoords.y = dropEvt.clientY;

        var setProperty = function (axis, propertyJS) {
          var value = control[propertyJS] - diffCoords[axis];
          if (value > coordLimits[axis].max) {
            value = coordLimits[axis].max;
          } else if (value < coordLimits[axis].min) {
            value = coordLimits[axis].min;
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
      lastTimeout = window.setTimeout(fun, window.data.TIMEOUT);
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
