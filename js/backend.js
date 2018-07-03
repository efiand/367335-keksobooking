'use strict';
/* Получение данных с сервера */

(function () {
  /* Запрос к серверу */
  var xhrListener = function (loadHandler, errorHandler, URL, method, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case 200:
          loadHandler(xhr.response);
          break;
        case 400:
          error = 'Неверный запрос';
          break;
        case 403:
          error = 'Доступ запрещён!';
          break;
        case 404:
          error = 'Ничего не найдено';
          break;
        case 500:
          error = 'Ошибка сервера';
          break;
        default:
          error = 'Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }
      if (error) {
        errorHandler(error);
      }
    });
    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open(method, URL);
    xhr.send(data);
  };


  window.backend = {
    /* Получение данных */
    load: function (loadHandler, errorHandler) {
      xhrListener(loadHandler, errorHandler, window.data.url.load, 'GET', null);
    },

    /* Отправка данных */
    save: function (data, loadHandler, errorHandler) {
      xhrListener(loadHandler, errorHandler, window.data.url.save, 'POST', data);
    }
  };
})();
