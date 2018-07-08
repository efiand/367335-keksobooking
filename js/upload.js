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
    node.setAttribute('draggable', 'true');
    node.appendChild(img);
  };

  var resetPhotos = function () {
    var pics = document.querySelectorAll('.ad-form__photo');
    for (var i = 0; i < pics.length; i++) {
      if (i) {
        pics[i].remove();
      } else {
        pics[i].innerHTML = '';
      }
    }
    isFirstUpload = true;
  };

  /* Получение изображений */
  var showPics = function (field, previewNodeClass, parentNodeClass) {
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
              isFirstUpload = false;
            } else {
              var block = document.createElement('div');
              block.classList.add(previewNodeClass);
              prepareImg(block, previewImg);
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
        img.style.top = 0;
        img.style.left = '50%';
        img.style.transform = 'translateX(-50%)';
        img.style.pointerEvents = 'none';
        getData(field.files[i], img, true);
      }
    }
  };
  var photosChangeHandler = function () {
    showPics(photosField, 'ad-form__photo', 'ad-form__photo-container');
  };

  /* Сортировка картинок перетаскиванием */
  var sortPics = function (picsContainer) {
    var pic;

    var dragOverHandler = function (evt) {
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'move';
      var target = evt.target;
      if (target && target !== pic && target.nodeName === 'DIV') {
        picsContainer.insertBefore(pic, target.nextSibling || target);
      }
    };

    var dragEndHandler = function (evt) {
      evt.preventDefault();
      picsContainer.removeEventListener('dragover', dragOverHandler);
      picsContainer.removeEventListener('dragend', dragEndHandler);
      photosField.addEventListener('change', photosChangeHandler);
    };

    var dragStartHandler = function (evt) {
      pic = evt.target;
      evt.dataTransfer.effectAllowed = 'move';
      evt.dataTransfer.setData('text/html', pic.innerHTML);

      photosField.removeEventListener('change', photosChangeHandler);
      pic.addEventListener('dragover', dragOverHandler);
      pic.addEventListener('dragend', dragEndHandler);
    };

    document.querySelector('.map__pin--main').addEventListener('click', function () {
      picsContainer.addEventListener('dragstart', dragStartHandler);
    });
    resetBtn.addEventListener('click', function () {
      picsContainer.removeEventListener('dragstart', dragStartHandler);
    });
  };


  avatarField.addEventListener('change', function () {
    showPics(avatarField, 'ad-form-header__preview', 'ad-form-header__preview');
  });

  photosField.setAttribute('multiple', 'true');
  photosField.addEventListener('change', photosChangeHandler);

  resetBtn.addEventListener('click', function () {
    document.querySelector('.ad-form-header__preview img').src = window.data.defaultAvatar;
    resetPhotos();
  });

  sortPics(document.querySelector('.ad-form__photo-container'));


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
