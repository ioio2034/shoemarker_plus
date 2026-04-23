let UI = {
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

      const target = $(this).data('target');
      const $modal = $(target);

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

    $datepicker.each(function () {
      const $input = $(this);

      if ($input.data('init')) return;
      $input.data('init', true);

      const isStart = $input.attr('id') === 'startDate';
      const isEnd = $input.attr('id') === 'endDate';

      const picker = flatpickr(this, {
        dateFormat: 'Y.m.d',
        allowInput: false,
        disableMobile: true,
        defaultDate: null,
        locale: 'ko',
      });

      // 아이콘 클릭 시 열기
      const $icon = $input.closest('.form__control').find('.form__icon');

      $icon.on('click', function () {
        picker.open();
      });
    });
  },
  // accordion
  accordion: function () {
    $(".accordion .accordion__item").each(function() {
      var $item = $(this);
      var $header = $item.find(".accordion__header");
      var $content = $item.find(".accordion__collapse");

      $content.css("transition", "none");

      if ($item.hasClass("is-active")) {
        $content.css("max-height", $content[0].scrollHeight + "px");
      } else {
        $content.css("max-height", 0);
      }

      setTimeout(function() {
        $content.css("transition", "");
      }, 0);

      $header.on("click", function(e) {
        if ($(e.target).closest(".checkbox").length) return;

        var isOpen = $item.hasClass("is-active");

        $(".accordion__item.is-active").not($item).removeClass("is-active")
          .find(".accordion__collapse").css("max-height", 0);

        if (!isOpen) {
          $item.addClass("is-active");
          $content.css("max-height", $content[0].scrollHeight + "px");
        } else {
          $item.removeClass("is-active");
          $content.css("max-height", 0);
        }
      });
    });
  },
  // lnb
  lnbAccordion: function () {
    $(document)
    .off('click.lnb', '.lnb__link')
    .on('click.lnb', '.lnb__link', function (e) {
      var $this = $(this);
      var $lnb = $this.closest('.lnb');

      if (!$lnb.length) return;

      var $item = $this.closest('.lnb__item');
      var $sub = $item.children('.lnb__sub');
      var $items = $lnb.find('.lnb__item');
      var isExpanded = $this.attr('aria-expanded') === 'true';

      if (!$sub.length) return;

      e.preventDefault();

      $items.not($item).each(function () {
        var $otherItem = $(this);
        var $otherBtn = $otherItem.children('.lnb__link');
        var $otherSub = $otherItem.children('.lnb__sub');

        $otherItem.removeClass('is-open');
        $otherBtn.attr('aria-expanded', 'false');
        $otherSub.css('height', 0);
      });

      if (isExpanded) {
        $item.removeClass('is-open');
        $this.attr('aria-expanded', 'false');
        $sub.css('height', 0);
      } else {
        $item.addClass('is-open');
        $this.attr('aria-expanded', 'true');
        $sub.css('height', $sub[0].scrollHeight + 'px');
      }
    });
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
  // tab bar
  tabBar: function () {
    const $win = $(window);
    const $tabbar = $('.tabbar');
    let lastScrollTop = 0;
    const threshold = 5;
    const bottomOffset = 10;

    if (!$tabbar.length) return;

    $win.on('scroll', function () {
      const rawScrollTop = $win.scrollTop();
      const windowHeight = $win.height();
      const documentHeight = $(document).height();
      const maxScrollTop = documentHeight - windowHeight;
      const scrollTop = Math.max(0, Math.min(rawScrollTop, maxScrollTop));

      if (scrollTop <= 0) {
        $tabbar.removeClass('is-hidden');
        lastScrollTop = 0;
        return;
      }

      if (scrollTop >= maxScrollTop - bottomOffset) {
        $tabbar.addClass('is-hidden');
        lastScrollTop = scrollTop;
        return;
      }

      if (Math.abs(scrollTop - lastScrollTop) <= threshold) {
        return;
      }

      if (scrollTop > lastScrollTop) {
        $tabbar.addClass('is-hidden');
      } else {
        $tabbar.removeClass('is-hidden');
      }

      lastScrollTop = scrollTop;
    });
  },
  // order detail accordion
  orderBlock: function () {
    const isMobile = window.innerWidth <= 1024;

    $('.order-block').each(function () {
      const $block = $(this);
      const $header = $block.children('.order-block__header');
      const $content = $block.children('.order-block__content');
      const $inner = $content.children('.order-block__inner');

      $header.off('click.orderBlock');

      if (isMobile) {
        $block.addClass('is-open');
        $content.css('height', 'auto');
        return;
      }
      
      if ($block.hasClass('is-open')) {
        $content.css('height', $inner.outerHeight());
      }

      $header.on('click.orderBlock', function () {        
        if ($block.hasClass('is-open')) {
          $block.removeClass('is-open');
          $content.css('height', 0);
        } else {
          $block.addClass('is-open');
          $content.css('height', $inner.outerHeight());
        }
      });
    });
  },
  // textarea count
  textCount: function () {
     $('.textarea').each(function () {
      const $wrap = $(this);
      const $textarea = $wrap.find('.textarea__field');
      const $current = $wrap.find('.textarea__count-current');
      const $countWrap = $wrap.find('.textarea__count');

      function updateCount() {
        let value = $textarea.val();

        if (value.length > 200) {
          value = value.substring(0, 200);
          $textarea.val(value);
        }

        const length = value.length;
        $current.text(length);
      }

      $textarea.on('input', updateCount);

      updateCount();
    });
  }
};

$(function () {
  UI.alert();
  UI.modal();
  UI.bottomSheet();
  UI.datePicker();
  UI.accordion();
  UI.lnbAccordion();
  UI.tabs();
  UI.tabBar();
  UI.orderBlock();
  UI.textCount();
});

// resize 대응
let orderBlockResizeTimer;
$(window).on('resize.orderBlock', function () {
  clearTimeout(orderBlockResizeTimer);
  orderBlockResizeTimer = setTimeout(function () {
    UI.orderBlock();
  }, );
});