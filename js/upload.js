'use strict';
/* Показать аватарку и фотографии объявления в форме */
(function () {
  var FILE_TYPES = ['png', 'jpg', 'jpeg', 'gif'];
  var avatarField = document.querySelector('#avatar');
  var photosField = document.querySelector('#images');
  var resetBtn = window.form.container.querySelector('[type="reset"]');
  var isFirstUpload = true;

  /* Установка свойств блока с картинкой */
  var prepareImg = function (node, img) {
    node.style.overflow = 'hidden';
    node.style.position = 'relative';
    node.style.border = '4px solid #e4e4de';
    node.setAttribute('draggable', 'true');
    node.appendChild(img);
  };

  var resetPhotos = function () {
    document.querySelectorAll('.ad-form__photo').forEach(function (elem, i) {
      if (i) {
        elem.remove();
      } else {
        elem.innerHTML = '';
        elem.style.cursor = 'default';
      }
    });
    isFirstUpload = true;
  };

  /* Получение изображений */
  var showPictures = function (field, previewNodeClass, parentNodeClass) {
    var isPicLoaded = false;
    var getData = function (file, previewImg, isMultiply) {
      isMultiply = isMultiply || false;
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });
      if (matches) {
        var reader = new FileReader();
        var picLoadHandler = function () {
          previewImg.src = reader.result;
          if (isMultiply) {
            if (isFirstUpload) {
              var node = parent.querySelector('.' + previewNodeClass);
              prepareImg(node, previewImg);
              if (field.files.length > 1) {
                node.style.cursor = 'move';
              }
              isFirstUpload = false;
            } else {
              var block = document.createElement('div');
              block.classList.add(previewNodeClass);
              prepareImg(block, previewImg);
              block.style.cursor = 'move';
              parent.appendChild(block);
            }
          }
          isPicLoaded = true;
        };
        reader.addEventListener('load', picLoadHandler);
        reader.readAsDataURL(file);
        if (isPicLoaded) {
          reader.removeEventListener('load', picLoadHandler);
        }
      }
    };

    if (previewNodeClass === parentNodeClass) {
      getData(field.files[0], document.querySelector('.' + previewNodeClass + ' img'));
    } else {
      resetPhotos();
      var parent = document.querySelector('.' + parentNodeClass);
      for (var i = 0; i < field.files.length; i++) {
        var img = document.createElement('img');
        img.style.height = '70px';
        img.style.position = 'absolute';
        img.style.top = '0';
        img.style.left = '50%';
        img.style.transform = 'translateX(-50%)';
        img.style.pointerEvents = 'none';
        getData(field.files[i], img, true);
      }
    }
  };
  var photosChangeHandler = function () {
    showPictures(photosField, 'ad-form__photo', 'ad-form__photo-container');
  };

  /* Сортировка картинок перетаскиванием */
  var sortPictures = function (picturesContainer) {
    var dragSrc;

    var dragStartHandler = function (evt) {
      if (evt.target.className === 'ad-form__photo') {
        dragSrc = evt.target;
        dragSrc.style.opacity = '0.5';
        evt.dataTransfer.effectAllowed = 'move';
        evt.dataTransfer.setData('text/html', dragSrc.innerHTML);
      }

      photosField.removeEventListener('change', photosChangeHandler);
    };

    var dragOverHandler = function (evt) {
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'move';
    };

    var dragLeaveHandler = function (evt) {
      if (evt.target.className === 'ad-form__photo') {
        evt.target.style.borderColor = '#e4e4de';
      }
    };

    var dragEnterHandler = function (evt) {
      if (evt.target.className === 'ad-form__photo') {
        evt.target.style.borderColor = '#ffaa99';
      }
    };

    var dropHandler = function (evt) {
      evt.stopPropagation();
      if (dragSrc !== evt.target && evt.target.className === 'ad-form__photo') {
        evt.target.style.borderColor = '#e4e4de';
        dragSrc.innerHTML = evt.target.innerHTML;
        evt.target.innerHTML = evt.dataTransfer.getData('text/html');
      }
    };

    var dragEndHandler = function (evt) {
      evt.preventDefault();
      evt.target.style.opacity = '1';
      photosField.addEventListener('change', photosChangeHandler);
    };

    document.querySelector('.map__pin--main').addEventListener('click', function () {
      picturesContainer.addEventListener('dragstart', dragStartHandler);
      picturesContainer.addEventListener('dragover', dragOverHandler);
      picturesContainer.addEventListener('dragenter', dragEnterHandler);
      picturesContainer.addEventListener('dragleave', dragLeaveHandler);
      picturesContainer.addEventListener('drop', dropHandler);
      picturesContainer.addEventListener('dragend', dragEndHandler);
    });
    resetBtn.addEventListener('click', function () {
      picturesContainer.removeEventListener('dragstart', dragStartHandler);
      picturesContainer.removeEventListener('dragover', dragOverHandler);
      picturesContainer.removeEventListener('dragenter', dragEnterHandler);
      picturesContainer.removeEventListener('dragleave', dragLeaveHandler);
      picturesContainer.removeEventListener('drop', dropHandler);
      picturesContainer.removeEventListener('dragend', dragEndHandler);
    });
  };


  avatarField.addEventListener('change', function () {
    showPictures(avatarField, 'ad-form-header__preview', 'ad-form-header__preview');
  });

  photosField.setAttribute('multiple', 'true');
  photosField.addEventListener('change', photosChangeHandler);

  resetBtn.addEventListener('click', function () {
    document.querySelector('.ad-form-header__preview img').src = window.data.defaultAvatar;
    resetPhotos();
  });

  sortPictures(document.querySelector('.ad-form__photo-container'));


  window.upload = {
    /* Drag and drop в поле загрузки файлов */
    dropZoneHandler: function (evt, dropZone, callback) {
      evt.preventDefault();

      var dragOverHandler = function (evtOver) {
        evtOver.preventDefault();
      };
      var dropHandler = function (evtDrop) {
        evtDrop.preventDefault();
        callback(evtDrop);
        dropZone.removeEventListener('dragover', dragOverHandler);
        dropZone.removeEventListener('drop', dropHandler);
      };

      dropZone.addEventListener('dragover', dragOverHandler);
      dropZone.addEventListener('drop', dropHandler);
    },

    /* Callback при перетаскивании файлов в дропзону */
    doList: function (evtDrop) {
      photosField.files = evtDrop.dataTransfer.files;
    }
  };
})();
