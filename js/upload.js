'use strict';
/* Показать аватарку и фотографии объявления в форме */
(function () {
  var FILE_TYPES = ['png', 'jpg', 'jpeg', 'gif'];
  var avatarField = document.querySelector('#avatar');
  var photosField = document.querySelector('#images');
  var isFirstDownload = true;

  /* Установка стилей */
  var setStyles = function (node) {
    node.style.overflow = 'hidden';
    node.style.position = 'relative';
  };

  /* Получение изображений */
  var showPics = function (field, previewNodeClass, parentNodeClass) {
    var getData = function (file, previewImg) {
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });
      if (matches) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          previewImg.src = reader.result;
        });
        reader.readAsDataURL(file);
      }
    };

    if (previewNodeClass === parentNodeClass) {
      getData(field.files[0], document.querySelector('.' + previewNodeClass + ' img'));
    } else {
      var parent = document.querySelector('.' + parentNodeClass);
      for (var i = 0; i < field.files.length; i++) {
        var img = document.createElement('img');
        img.style.height = '70px';
        img.style.position = 'absolute';
        img.style.top = 0;
        img.style.left = '50%';
        img.style.transform = 'translateX(-50%)';
        if (isFirstDownload) {
          var node = parent.querySelector('.' + previewNodeClass);
          setStyles(node);
          node.appendChild(img);
          isFirstDownload = false;
        } else {
          var block = document.createElement('div');
          block.classList.add(previewNodeClass);
          setStyles(block);
          block.appendChild(img);
          parent.appendChild(block);
        }
        getData(field.files[i], img);
      }
    }
  };

  avatarField.addEventListener('change', function () {
    showPics(avatarField, 'ad-form-header__preview', 'ad-form-header__preview');
  });

  photosField.setAttribute('multiple', 'true');
  photosField.addEventListener('change', function () {
    showPics(photosField, 'ad-form__photo', 'ad-form__photo-container');
  });
})();
