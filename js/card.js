'use strict';
/* Создание карточки объявления */

(function () {
  window.card = {
    /* Функция генерации объявления */
    renderAnnouncement: function (data, template) {
      var announcement = template.cloneNode(true);
      var photoTemplate = announcement.querySelector('.popup__photo').cloneNode(true);
      if (data) {
        var selectorToContent = {
          'popup__title': data.offer.title,
          'popup__text--address': data.offer.address,
          'popup__type': window.data.house[data.offer.type],
          'popup__text--capacity': data.offer.rooms && data.offer.guests ? window.utils.numDecline(data.offer.rooms, 'комната', 'комнаты', 'комнат') + ' для ' + window.utils.numDecline(data.offer.guests, 'гостя', 'гостей', 'гостей') + '.' : '',
          'popup__text--time': data.offer.checkin !== '0:00' && data.offer.checkout !== '0:00' ? 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout + '.' : '',
          'popup__description': data.offer.description,
          'popup__text--price': data.offer.price ? data.offer.price + '\u20BD' : '',
          'popup__features': data.offer.features.length ? '.' : '',
          'popup__photos': data.offer.photos.length ? '.' : ''
        };
        var selectors = Object.keys(selectorToContent);
        var j;
        for (var i = 0; i < selectors.length; i++) {
          var node = announcement.querySelector('.' + selectors[i]);
          if (selectorToContent[selectors[i]]) {
            node.textContent = selectorToContent[selectors[i]];
            if (selectors[i] === 'popup__text--price') {
              var priceSpan = document.createElement('span');
              priceSpan.textContent = '/ночь';
              node.appendChild(priceSpan);
            } else if (selectors[i] === 'popup__features') {
              var features = document.createDocumentFragment();
              for (j = 0; j < data.offer.features.length; j++) {
                var feature = document.createElement('li');
                feature.classList.add('popup__feature');
                feature.classList.add('popup__feature--' + data.offer.features[j]);
                features.appendChild(feature);
              }
              node.innerHTML = '';
              node.appendChild(features);
            } else if (selectors[i] === 'popup__photos') {
              var photos = document.createDocumentFragment();
              for (j = 0; j < data.offer.photos.length; j++) {
                var imgTemplate = photoTemplate.cloneNode(true);
                imgTemplate.src = data.offer.photos[j];
                photos.appendChild(imgTemplate);
              }
              node.innerHTML = '';
              node.appendChild(photos);
            }
          } else {
            node.classList.add('visually-hidden');
          }
        }
        announcement.querySelector('.popup__avatar').src = data.author.avatar || window.data.defaultAvatar;
      }
      return announcement;
    }
  };
})();
