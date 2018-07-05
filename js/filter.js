'use strict';
/* Фильтрация данных для показа меток */

(function () {
  window.filter = {
    do: function (obj) {
      return obj.filter(function (elem, index) {
        return index < window.data.pinsLimit;
      });
    }
  };
})();
