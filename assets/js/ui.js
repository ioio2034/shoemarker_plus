let UI = {
  // modal
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
  // tabs
  tabs: function () {
    var $tab = $('.js-tabs');

    $tab.each(function () {
      const $root = $(this);

      if ($root.data('init')) return;
      $root.data('init', true);

      const $tabBtns = $root.find('.js-tab-btn');
      const $tabPanels = $root.find('.js-tab-panel');

      if (!$tabBtns.filter('.is-active').length) {
        $tabBtns.first().addClass('is-active').attr('aria-selected', 'true');
        $tabPanels.attr('hidden', true).first().addClass('is-active');
      }

      $tabBtns.on('click.default', function (e) {
        const $btn = $(this);
        const idx = $tabBtns.index($btn);
        const $targetPanel = $tabPanels.eq(idx);

        if ($btn.is('a')) e.preventDefault();

        $tabBtns.removeClass('is-active').attr('aria-selected', 'false');
        $btn.addClass('is-active').attr('aria-selected', 'true');

        $tabPanels.removeClass('is-active').attr('hidden', true);
        $targetPanel.addClass('is-active');
      });
    });
  },
  // bottom sheet
  bottomSheet: function () {
    let $trigger = null;
    function openSheet($sheet, $origin) {
      if (!$sheet.length) return;
      $('.bottom-sheet.is-open').removeClass('is-open');
      $trigger = $origin || null;
      $sheet.addClass('is-open');
      $('body').addClass('sheet-open');
    }

    function closeSheet($sheet) {
      if (!$sheet.length) return;
      $sheet.removeClass('is-open');
      if (!$('.bottom-sheet.is-open').length) {
        $('body').removeClass('sheet-open');
      }
      if ($trigger && $trigger.length) {
        $trigger.focus();
      }
    }

    // 열기
    $(document).on('click', '.js-bottom-sheet-open', function (e) {
      e.preventDefault();
      const target = $(this).data('target');
      const $sheet = $(target);
      openSheet($sheet, $(this));
    });

    // 닫기 버튼
    $(document).on('click', '.bottom-sheet__close', function () {
      closeSheet($(this).closest('.bottom-sheet'));
    });

    // dim 클릭 닫기
    $(document).on('click', '.bottom-sheet__dim', function () {
      closeSheet($(this).closest('.bottom-sheet'));
    });

    // ESC 닫기
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') {
        closeSheet($('.bottom-sheet.is-open').last());
      }
    });

    window.openSheet = function (selector, origin) {
      openSheet($(selector), origin ? $(origin) : null);
    };

    window.closeSheet = function (selector) {
      closeSheet($(selector));
    };
  },
  // date picker
  datePicker: function () {
    const $datepicker = $('.js-datepicker');

    if (!$datepicker.length) return;

    const today = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

    $datepicker.each(function () {
      const $input = $(this);

      if ($input.data('init')) return;
      $input.data('init', true);

      const isStart = $input.attr('id') === 'startDate';
      const isEnd = $input.attr('id') === 'endDate';

      const picker = flatpickr(this, {
        dateFormat: 'Y.m.d',
        allowInput: true,
        disableMobile: true,
        defaultDate: null,
        locale: 'ko',
        defaultDate: isStart ? today : isEnd ? threeMonthsLater : null,
      });

      // 아이콘 클릭 시 열기
      const $icon = $input.closest('.form__control').find('.form__icon');

      $icon.on('click', function () {
        picker.open();
      });
    });
  },
  // alert
  alert: function () {
    let $trigger = null;

    // 열기
    $(document).on('click', '.js-alert-open', function () {
      const target = $(this).data('target');

      $trigger = $(this);

      $(target).addClass('is-open');
      $('body').addClass('alert-open');
    });

    // 닫기
    $(document).on(
      'click',
      '.alert__dim, .js-alert-cancel, .js-alert-confirm',
      function () {
        const $alert = $(this).closest('.alert');
        $alert.removeClass('is-open');
        $('body').removeClass('alert-open');
      }
    );
  },
  // tab bar
  tabBar: function () {
    const $win = $(window);
    const $tabbar = $('.tabbar');
    let lastScrollTop = 0;
    const threshold = 5;

    if (!$tabbar.length) return;

    $win.on('scroll', function () {
      const scrollTop = $win.scrollTop();
      const windowHeight = $win.height();
      const documentHeight = $(document).height();

      // 최상단에서는 항상 노출
      if (scrollTop <= 0) {
        $tabbar.removeClass('is-hidden');
        lastScrollTop = 0;
        return;
      }

      // 너무 미세한 스크롤은 무시
      if (Math.abs(scrollTop - lastScrollTop) <= threshold) {
        return;
      }

      // 아래로 스크롤
      if (scrollTop > lastScrollTop) {
        $tabbar.addClass('is-hidden');
      }
      // 위로 스크롤
      else {
        $tabbar.removeClass('is-hidden');
      }

      lastScrollTop = scrollTop;
    });
  }
};

$(function () {
  UI.modal();
  UI.tabs();
  UI.bottomSheet();
  UI.datePicker();
  UI.alert();
  UI.tabBar();
});