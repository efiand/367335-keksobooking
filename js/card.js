'use strict';
/* Создание карточки объявления */

(function () {
  window.card = {
    /* Функция генерации объявления */
    renderAnnouncement: function (data, template) {
      var announcement = template.cloneNode(true);

      announcement.querySelector('.popup__title').textContent = data.offer.title;
      announcement.querySelector('.popup__text--address').textContent = data.offer.address;
      announcement.querySelector('.popup__type').textContent = window.data.src['houseTypes'][data.offer.type];
      announcement.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей.';
      announcement.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout + '.';
      announcement.querySelector('.popup__description').textContent = data.offer.description;

      var priceBlock = announcement.querySelector('.popup__text--price');
      priceBlock.textContent = data.offer.price + '\u20BD';
      var priceSpan = document.createElement('span');
      priceSpan.textContent = '/ночь';
      priceBlock.appendChild(priceSpan);

      var features = document.createDocumentFragment();
      for (var i = 0; i < data.offer.features.length; i++) {
        var feature = document.createElement('li');
        feature.classList.add('popup__feature');
        feature.classList.add('popup__feature--' + data.offer.features[i]);
        features.appendChild(feature);
      }
      var featuresBlock = announcement.querySelector('.popup__features');
      featuresBlock.innerHTML = '';
      featuresBlock.appendChild(features);

      var photos = announcement.querySelector('.popup__photos');
      var photo = announcement.querySelector('.popup__photo');
      photo.src = data.offer.photos[0];
      for (i = 1; i < data.offer.photos.length; i++) {
        var anotherPhoto = photo.cloneNode(true);
        anotherPhoto.src = data.offer.photos[i];
        photos.appendChild(anotherPhoto);
      }

      announcement.querySelector('.popup__avatar').src = data.author.avatar;
      return announcement;
    }
  };
})();
