let UI = {
  modal: function () {
    let $trigger = null;
    function openModal($modal, $origin) {
      if (!$modal.length) return;
      $('.modal.is-open').removeClass('is-open');
      $trigger = $origin || null;
      $modal.addClass('is-open');
      $('body').addClass('modal-open');
    }

    function closeModal($modal) {
      if (!$modal.length) return;
      $modal.removeClass('is-open');
      if (!$('.modal.is-open').length) {
        $('body').removeClass('modal-open');
      }
      if ($trigger && $trigger.length) {
        $trigger.focus();
      }
    }
    // 열기
    $(document).on('click', '.js-modal-open', function (e) {
      e.preventDefault();
      const $modal = $('.modal').first();
      openModal($modal, $(this));
    });

    // 닫기 버튼
    $(document).on('click', '.modal__close', function () {
      closeModal($(this).closest('.modal'));
    });

    // dim 클릭 닫기
    $(document).on('click', '.modal__dim', function () {
      closeModal($(this).closest('.modal'));
    });

    window.openModal = function (selector, origin) {
      openModal($(selector), origin ? $(origin) : null);
    };

    window.closeModal = function (selector) {
      closeModal($(selector));
    };
  },
};

$(function () {
  UI.modal();
});