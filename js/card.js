'use strict';
/* Создание карточки объявления */

(function () {
  /* Соответствие контента селектору */
  var getSelectorToContent = function (data) {
    return {
      'popup__title': data.offer.title,
      'popup__text--address': data.offer.address,
      'popup__type': window.data.HouseNames[data.offer.type.toUpperCase()],
      'popup__text--capacity': data.offer.rooms && data.offer.guests
        ? window.utils.numDecline(data.offer.rooms, 'комната', 'комнаты', 'комнат') + ' для '
        + window.utils.numDecline(data.offer.guests, 'гостя', 'гостей', 'гостей') + '.'
        : '',
      'popup__text--time': data.offer.checkin !== '0:00' && data.offer.checkout !== '0:00'
        ? 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout + '.'
        : '',
      'popup__description': data.offer.description,
      'popup__text--price': data.offer.price ? data.offer.price + '\u20BD' : '',
      'popup__features': data.offer.features.length ? '.' : '',
      'popup__photos': data.offer.photos.length ? '.' : ''
    };
  };

  /* Рендеринг различных узлов */
  var renderPriceNode = function (node) {
    var priceSpan = document.createElement('span');
    priceSpan.textContent = '/ночь';
    node.appendChild(priceSpan);
  };
  var renderFeaturesNode = function (node, data) {
    var features = document.createDocumentFragment();
    data.offer.features.forEach(function (featuresElem) {
      var feature = document.createElement('li');
      feature.classList.add('popup__feature');
      feature.classList.add('popup__feature--' + featuresElem);
      features.appendChild(feature);
    });
    node.innerHTML = '';
    node.appendChild(features);
  };
  var renderPhotosNode = function (node, data, template) {
    var photos = document.createDocumentFragment();
    data.offer.photos.forEach(function (photosElem) {
      var imgTemplate = template.cloneNode(true);
      imgTemplate.src = photosElem;
      photos.appendChild(imgTemplate);
    });
    node.innerHTML = '';
    node.appendChild(photos);
  };

  /* Функция генерации объявления */
  window.renderAnnouncement = function (data, template) {
    var announcement = template.cloneNode(true);
    var photoTemplate = announcement.querySelector('.popup__photo').cloneNode(true);
    var selectorToContent = getSelectorToContent(data);

    Object.keys(selectorToContent).forEach(function (elem) {
      var node = announcement.querySelector('.' + elem);
      if (selectorToContent[elem]) {
        node.textContent = selectorToContent[elem];
        if (elem === 'popup__text--price') {
          renderPriceNode(node);
        } else if (elem === 'popup__features') {
          renderFeaturesNode(node, data);
        } else if (elem === 'popup__photos') {
          renderPhotosNode(node, data, photoTemplate);
        }
      } else {
        node.classList.add('visually-hidden');
      }
    });

    announcement.querySelector('.popup__avatar').src = data.author.avatar
      || window.data.DEFAULT_AVATAR;

    return announcement;
  };
})();
