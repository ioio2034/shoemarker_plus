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
    let $triggerStack = [];

    function openModal($modal, $origin) {
      if (!$modal.length) return;
      if ($origin) $triggerStack.push($origin);
      $modal.addClass('is-open');
      $('body').addClass('modal-open');

      const openCount = $('.modal.is-open').length;
      $modal.css('z-index', 1000 + openCount);
    }

    function closeModal($modal) {
      if (!$modal.length) return;
      $modal.removeClass('is-open').css('z-index', '');

      if (!$('.modal.is-open').length) {
        $('body').removeClass('modal-open');
      }
      const $trigger = $triggerStack.pop();
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

    // 닫기
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
      $sheet.addClass('is-closing');
      $sheet.one('transitionend', function () {
        $sheet.removeClass('is-open is-closing');
        if (!$('.bottom-sheet.is-open').length) {
          $('body').removeClass('sheet-open');
        }
        if ($trigger && $trigger.length) {
          $trigger.focus();
        }
      });
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
        $content.css({ 'height': 'auto', 'overflow': 'visible' });
        return;
      }

      if ($block.hasClass('order-block--static')) {
        $block.addClass('is-open');
        $content.css({ 'height': 'auto', 'overflow': 'visible' });
        return;
      }

      if ($block.hasClass('is-open')) {
        $content.css({ 'height': $inner.outerHeight(), 'overflow': 'visible' });
      } else {
        $content.css({ 'height': 0, 'overflow': 'hidden' });
      }

      $header.on('click.orderBlock', function () {
        if ($block.hasClass('is-open')) {
          $block.removeClass('is-open');
          $content.css({ 'height': 0, 'overflow': 'hidden' });
        } else {
          $block.addClass('is-open');
          $content.css('height', $inner.outerHeight());

          $content.one('transitionend', function () {
            $content.css('overflow', 'visible');
          });
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
  },
  // 상품 상세 스크롤 탭
  prodTabs: function () {
    const $prodTabs = $('.prod-tabs');
    const $tabBtns = $prodTabs.find('.prod-tabs__btn');

    if (!$prodTabs.length) return;

    // 탭 클릭 → 해당 섹션으로 스크롤 이동
    $tabBtns.on('click', function () {
      const $btn = $(this);
      const targetId = $btn.data('target');
      const $target = $('#' + targetId);

      if (!$target.length) return;

      $tabBtns.removeClass('is-active').attr('aria-selected', 'false');
      $btn.addClass('is-active').attr('aria-selected', 'true');

      const tabsHeight = $prodTabs.outerHeight();
      const headerHeight = $('.section__header').outerHeight() || 0;
      const targetTop = $target.offset().top - tabsHeight - headerHeight;

      $('html, body').scrollTop(targetTop);
    });

    // 스크롤 위치에 따라 탭 active 자동 전환
    const sectionIds = $tabBtns.map(function () {
      return $(this).data('target');
    }).get();

    $(window).on('scroll.prodTabs', function () {
      const tabsHeight = $prodTabs.outerHeight();
      const headerHeight = $('.section__header').outerHeight() || 0;
      const scrollTop = $(window).scrollTop();
      let currentId = sectionIds[0];

      sectionIds.forEach(function (id) {
        const $section = $('#' + id);
        if (!$section.length) return;
        if ($section.offset().top - tabsHeight - headerHeight <= scrollTop) {
          currentId = id;
        }
      });

      $tabBtns.each(function () {
        const $btn = $(this);
        const isActive = $btn.data('target') === currentId;
        $btn.toggleClass('is-active', isActive).attr('aria-selected', isActive ? 'true' : 'false');
      });
    });
  },
  // 상품 상세 더보기 / 닫기
  prodInfoMore: function () {
    const $moreBtn = $('#prod-info-more-btn');
    const $infoBody = $('#prod-info-body');
    const $infoFold = $('#prod-info-fold');
    const $moreText = $moreBtn.find('.prod-info__more-text');
    const $moreIcon = $moreBtn.find('.prod-info__more-icon');

    if (!$moreBtn.length) return;

    $moreBtn.on('click', function () {
      const isExpanded = $moreBtn.attr('aria-expanded') === 'true';

      if (isExpanded) {
        // 접기
        $infoBody.removeClass('is-expanded');
        $moreBtn.attr('aria-expanded', 'false');
        $moreText.text('상세정보 더보기');
        $moreIcon.removeClass('is-open');
        $infoFold.removeClass('is-expanded');
      } else {
        // 펼치기
        $infoBody.addClass('is-expanded');
        $moreBtn.attr('aria-expanded', 'true');
        $moreText.text('상세정보 닫기');
        $moreIcon.addClass('is-open');
        $infoFold.addClass('is-expanded');
      }
    });
  },
  // 상품 최대 혜택가 레이어
  prodBenefit: function () {
    const $toggle = $('.benefit__toggle');

    $toggle.on('click', function () {
      const $btn = $(this);
      const isExpanded = $btn.attr('aria-expanded') === 'true';
      const $layer = $('#' + $btn.attr('aria-controls'));

      $btn.attr('aria-expanded', !isExpanded);
      $layer.toggleClass('is-open', !isExpanded);
    });

    // 레이어 외부 클릭 시 닫기
    $(document).on('click', function (e) {
      if (!$(e.target).closest('.benefit').length) {
        $('.benefit__toggle').attr('aria-expanded', 'false');
        $('.benefit__layer').removeClass('is-open');
      }
    });
  },
  // 정렬 레이어
  reviewSort: function () {
    const $sortBtn = $('.sort__btn');

    $sortBtn.on('click', function () {
      const $btn = $(this);
      const isExpanded = $btn.attr('aria-expanded') === 'true';
      const $layer = $btn.siblings('.sort__layer');

      $btn.attr('aria-expanded', !isExpanded);
      $layer.toggleClass('is-open', !isExpanded);
    });

    $(document).on('click', '.sort__option', function () {
      const $option = $(this);
      const $layer = $option.closest('.sort__layer');
      const $btn = $layer.siblings('.sort__btn');

      $layer.find('.sort__option').removeClass('is-active');
      $option.addClass('is-active');

      $btn.find('.sort__text').text($option.text());

      $btn.attr('aria-expanded', 'false');
      $layer.removeClass('is-open');
    });

    $(document).on('click', function (e) {
      if (!$(e.target).closest('.sort').length) {
        $sortBtn.attr('aria-expanded', 'false');
        $('.sort__layer').removeClass('is-open');
      }
    });
  },
  // 결제수단 아코디언
  paymentMethod: function () {
    const $items = $('.payment-method__item');

    if (!$items.length) return;

    $('.payment-method__trigger').on('click', function () {
      const $btn = $(this);
      const $item = $btn.closest('.payment-method__item');
      const $content = $('#' + $btn.attr('aria-controls'));
      const isActive = $item.hasClass('is-active');

      // 전체 닫기
      $items.removeClass('is-active');
      $('.payment-method__trigger').attr('aria-expanded', 'false');
      $('.payment-method__content').attr('hidden', true);

      // 선택한 항목 열기 (토글)
      if (!isActive) {
        $item.addClass('is-active');
        $btn.attr('aria-expanded', 'true');
        if ($content.length) $content.removeAttr('hidden');
      }
    });

    // 간편결제 개별 선택
    $(document).on('click', '.payment-method__quick-btn', function () {
      $('.payment-method__quick-btn').removeClass('is-active');
      $(this).addClass('is-active');
    });
  },
  // 주문서 가격 툴팁
  priceTooltip: function () {
    $(document).on('click', '.price-tooltip__btn', function (e) {
      e.stopPropagation();
      const $btn = $(this);
      const isExpanded = $btn.attr('aria-expanded') === 'true';
      const $layer = $btn.siblings('.price-tooltip__layer'); // ← 형제 요소로 탐색

      // 다른 툴팁 전부 닫기
      $('.price-tooltip__btn').not($btn).attr('aria-expanded', 'false');
      $('.price-tooltip__layer').not($layer).attr('hidden', true);

      // 현재 토글
      $btn.attr('aria-expanded', !isExpanded);
      if (isExpanded) {
        $layer.attr('hidden', true);
      } else {
        $layer.removeAttr('hidden');
      }
    });

    // 외부 클릭 시 닫기
    $(document).on('click', function (e) {
      if (!$(e.target).closest('.price-tooltip').length) {
        $('.price-tooltip__btn').attr('aria-expanded', 'false');
        $('.price-tooltip__layer').attr('hidden', true);
      }
    });
  },
  // 장바구니 결제금액 요약 토글
  cartSummary: function () {
    const $toggle = $('.cart-summary__toggle');

    if (!$toggle.length) return;

    $toggle.on('click', function () {
      const $btn = $(this);
      const isExpanded = $btn.attr('aria-expanded') === 'true';
      const $detail = $('#' + $btn.attr('aria-controls'));

      $btn.attr('aria-expanded', !isExpanded);

      if (isExpanded) {
        $detail.removeClass('is-open');
      } else {
        $detail.addClass('is-open');
      }
    });
  },
  // toggle
  toggle: function () {
    $(document).on('click', '.js-toggle', function () {
      const $btn = $(this);
      const isExpanded = $btn.attr('aria-expanded') === 'true';
      const target = $btn.data('target');
      const $target = $(target);

      if (!$target.length) return;

      $btn.attr('aria-expanded', !isExpanded);
      $target.toggleClass('is-open', !isExpanded);
    });
  },
  // heder scroll
  headerScroll: function () {
    const $win = $(window);
    let lastScrollTop = 0;
    const threshold = 5;

    $win.on('scroll', function () {
      const $header = $('#header');

      if (!$header.length) return;

      const rawScrollTop   = $win.scrollTop();
      const windowHeight   = $win.height();
      const documentHeight = $(document).height();
      const maxScrollTop   = documentHeight - windowHeight;
      const scrollTop      = Math.max(0, Math.min(rawScrollTop, maxScrollTop));

      if (scrollTop <= 0) {
        $header.removeClass('scrolled is-hidden');
        lastScrollTop = 0;
        return;
      }

      $header.addClass('scrolled');

      if (Math.abs(scrollTop - lastScrollTop) <= threshold) return;

      if (scrollTop > lastScrollTop) {
        $header.addClass('is-hidden');
      } else {
        $header.removeClass('is-hidden');
      }

      lastScrollTop = scrollTop;
    });
  },
  // 브랜드 필터
  brandFilter: function () {
    $('.brand-filter--pc .brand-filter__item').each(function () {
      const $item = $(this);
      const $btn = $item.find('.brand-filter__btn');
      const $sub = $item.find('.brand-filter__sub');

      $sub.css('transition', 'none');

      // 초기 상태 — is-open 있으면 펼침
      if ($item.hasClass('is-open')) {
        $sub.css('max-height', $sub[0].scrollHeight + 'px');
      } else {
        $sub.css('max-height', 0);
      }

      setTimeout(function () {
        $sub.css('transition', '');
      }, 0);

      $btn.on('click', function (e) {
        if ($(e.target).closest('.checkbox').length) return;

        const isOpen = $item.hasClass('is-open');

        if (isOpen) {
          $item.removeClass('is-open');
          $sub.css('max-height', 0);
        } else {
          $item.addClass('is-open');
          $sub.css('max-height', $sub[0].scrollHeight + 'px');
        }
      });
    });
  },
  // header brand layer
  brandDropdown: function () {
    let resizeTimer;

    $(window).on('resize', function () {
      $('#brandDropdownLayer').addClass('no-transition');
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        $('#brandDropdownLayer').removeClass('no-transition');
      }, 200);
    });
    $(document)
      .on('click', '.brand-dropdown__toggle', function (e) {
        e.stopPropagation();
        const $toggle = $(this);
        const $layer  = $('#brandDropdownLayer');
        const isOpen  = $toggle.attr('aria-expanded') === 'true';
        $toggle.attr('aria-expanded', String(!isOpen));
        $layer.toggleClass('is-active', !isOpen);
      })
      .on('click', '.brand-dropdown__close', function () {
        $('.brand-dropdown__toggle').attr('aria-expanded', 'false');
        $('#brandDropdownLayer').removeClass('is-active');
      })
      .on('click', function (e) {
        if (!$(e.target).closest('.brand-dropdown').length) {
          $('.brand-dropdown__toggle').attr('aria-expanded', 'false');
          $('#brandDropdownLayer').removeClass('is-active');
        }
      });
  },
  // ai chat layer
  aiChatLayer: function () {
    function openLayer() {
      const $layer = $('#aiChatLayer');
      $layer.addClass('is-active').attr('aria-hidden', 'false');
      $('body').addClass('modal-open');
    }

    function closeLayer() {
      const $layer = $('#aiChatLayer');
      $layer.removeClass('is-active').attr('aria-hidden', 'true');
      $('body').removeClass('modal-open');
    }

    $(document)
      .on('click', '.ai-chat__trigger', function (e) {
        e.preventDefault();
        openLayer();
      })
      .on('click', '.ai-chat-layer__close', function () {
        closeLayer();
      })
      .on('click', '.ai-chat-layer__dim', function () {
        closeLayer();
      });
  },
  // membership progress
  membershipProgress: function () {
    function setMsgPosition() {
      const $track = $('.grade-progress__bar-track');
      const $fill  = $('.grade-progress__bar-fill');
      const $msg   = $('.grade-progress__msg');
      const $arrow = $('.grade-progress__msg-arrow');

      const trackWidth = $track.outerWidth();
      const msgWidth   = $msg.outerWidth();
      const fillPct    = parseFloat($fill[0].style.width);
      const fillWidth  = trackWidth * (fillPct / 100);
      const half       = msgWidth / 2;

      const clamped = Math.min(Math.max(fillWidth, half), trackWidth - half);
      $msg.css('left', clamped + 'px');

      const arrowPadding = 16;
      const arrowRaw     = half + (fillWidth - clamped);
      const arrowClamped = Math.min(Math.max(arrowRaw, arrowPadding), msgWidth - arrowPadding);
      $arrow.css('left', arrowClamped + 'px');
    }

    $(document).on('click', '.js-modal-open', function () {
      setTimeout(setMsgPosition, 0);
    });

    $(window).on('resize', function () {
      if ($('.grade-progress__bar-track').is(':visible')) {
        setMsgPosition();
      }
    });
  },
  gnbMenu: function () {
    // if (window.matchMedia('(max-width: 1024px)').matches) return;

    let closeTimer;
    let wasDark = false;
    const $header = $('.header');
    const pcOnly = () => !window.matchMedia('(max-width: 1024px)').matches;

    function getContentHeight($item) {
      const $content = $item.children('.nav__content');
      if (!$content.length) return 0;

      return $content.outerHeight(true);
    }

    function openNav() {
      if (!pcOnly()) return;
      wasDark = $header.hasClass('header--dark');
      $header.removeClass('scrolled header--dark');
    }

    function closeNav() {
      if (!pcOnly()) return;
      if ($(window).scrollTop() > 0) {
        $header.addClass('scrolled');
      }
      if (wasDark) {
        $header.addClass('header--dark');
        wasDark = false;
      }
    }

    function isNavOpen() {
      return $('.nav__item.is-open').length > 0;
    }

    function activateDepth2($li) {
      const $navContent = $li.closest('.nav__content');
      const index = $li.index();

      $li.siblings().children('a').removeClass('is-active');
      $li.children('a').addClass('is-active');

      const $allDepth3 = $navContent.find('.nav__depth3');
      $allDepth3.removeClass('is-active');
      $allDepth3.eq(index).addClass('is-active');
    }

    function activateFirstDepth2($navItem) {
      const $firstDepth2Li = $navItem.find('.nav__depth2 > li').first();
      if ($firstDepth2Li.length) {
        activateDepth2($firstDepth2Li);
      }
    }

    $(window).on('scroll', function () {
      if (!pcOnly()) return;
      if (isNavOpen()) {
        $header.removeClass('scrolled header--dark');
      }
    });

    $(document).on('mouseenter', '.nav__item', function () {
      if (!pcOnly()) return;
      clearTimeout(closeTimer);
      const $content = $(this).children('.nav__content');

      if (!$content.length) {
        $('.nav__item').removeClass('is-open');
        $('.nav__bg').removeClass('is-open').css('height', 0);
        closeNav();
        return;
      }

      if (!isNavOpen()) {
        openNav();
      } else {
        $header.removeClass('scrolled header--dark');
      }

      $('.nav__item').removeClass('is-open');
      $(this).addClass('is-open');

      activateFirstDepth2($(this));

      const currentHeight = getContentHeight($(this));
      $('.nav__bg').addClass('is-open').css('height', currentHeight);
    });

    // 2뎁스 항목 hover 시 3·4뎁스 교체
    $(document).on('mouseenter', '.nav__depth2 > li', function () {
      if (!pcOnly()) return;
      activateDepth2($(this));
    });

    $(document).on('mouseleave', '.nav', function () {
      closeTimer = setTimeout(function () {
        $('.nav__item').removeClass('is-open');
        $('.nav__bg').removeClass('is-open').css('height', 0);
        // 모든 depth3 비활성화
        $('.nav__depth3').removeClass('is-active');
        closeNav();
      }, 100);
    });
  },
  mobileMenu: function () {

    // 열기 — tabbar 버튼 클릭
    function openGnb(tab) {
      // 탭 전환
      $('.mobile-gnb__tab').removeClass('is-active');
      $(`.mobile-gnb__tab[data-tab="${tab}"]`).addClass('is-active');
      $('.mobile-gnb__tab-content').removeClass('is-active');
      $(`.mobile-gnb__tab-content[data-content="${tab}"]`).addClass('is-active');

      $('.mobile-gnb').addClass('is-open').attr('aria-hidden', 'false').css({ transform: '', visibility: '' });
      $('body').addClass('is-locked');
    }

    // 카테고리 탭으로 열기
    $(document).on('click', '.tabbar__btn--menu', function () {
      openGnb('category');
    });

    // 브랜드 탭으로 열기
    $(document).on('click', '.tabbar__btn--brand', function () {
      openGnb('brand');
    });

    // 닫기
    $(document).on('click', '.mobile-gnb__close', function () {
      $('.mobile-gnb').removeClass('is-open').attr('aria-hidden', 'true');
      $('body').removeClass('is-locked');
    });

    // 탭 전환 (카테고리 / 브랜드)
    $(document).on('click', '.mobile-gnb__tab', function () {
      const tab = $(this).data('tab');
      $('.mobile-gnb__tab').removeClass('is-active');
      $(this).addClass('is-active');
      $('.mobile-gnb__tab-content').removeClass('is-active');
      $(`.mobile-gnb__tab-content[data-content="${tab}"]`).addClass('is-active');
    });

    // 1depth 카테고리 전환
    $(document).on('click', '.mobile-gnb__depth1-item a', function () {
      const $item = $(this).closest('.mobile-gnb__depth1-item');
      const category = $item.data('category');
      $('.mobile-gnb__depth1-item').removeClass('is-active');
      $item.addClass('is-active');
      $('.mobile-gnb__panel').removeClass('is-active');
      $(`.mobile-gnb__panel[data-panel="${category}"]`).addClass('is-active');
    });
  },
  goTop: function () {
    const $btn    = $('#goTop');
    const $aiChat = $('.ai-chat');

    if (!$btn.length) return;

    function showTopBtn() {
      if ($btn.hasClass('is-visible')) return;
      $btn.addClass('is-active');
      void $btn[0].offsetHeight;
      $btn.addClass('is-visible');
    }

    function hideTopBtn() {
      if (!$btn.hasClass('is-visible')) return;
      $btn.removeClass('is-visible');
      $btn.one('transitionend', function () {
        if (!$btn.hasClass('is-visible')) {
          $btn.removeClass('is-active');
        }
      });
    }

    function handleScroll() {
      const scrollTop = $(window).scrollTop();

      scrollTop > 200 ? showTopBtn() : hideTopBtn();
      scrollTop <= 100 ? $aiChat.addClass('is-top') : $aiChat.removeClass('is-top');
    }

    handleScroll();
    $(window).on('scroll', handleScroll);

    $btn.on('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },
  headerSearch: function () {
    function closeSearchLayer() {
      const $searchLayer = $('.search-layer');

      if (!$searchLayer.hasClass('is-active')) return;

      if ($searchLayer.data('was-dark')) {
        $('.header').addClass('header--dark');
      }

      $searchLayer.removeClass('is-active');
    }

    $(document).on('click', '.util__item--search', function (e) {
      e.preventDefault();

      const $header = $('.header');
      const $searchLayer = $('.search-layer');
      const isDark = $header.hasClass('header--dark');

      if (!$searchLayer.hasClass('is-active')) {
        $searchLayer.data('was-dark', isDark);
        if (isDark) $header.removeClass('header--dark');
      }

      $searchLayer.css('visibility', '').toggleClass('is-active');
    });

    $(document).on('click', function (e) {
      if (!$(e.target).closest('.util__item--search, .search-layer').length) {
        closeSearchLayer();
      }
    });

    $(window).on('scroll', closeSearchLayer);
  },
  // 카테고리 선택 레이어
  categorySelect: function () {
    const $categoryBtn = $('.category__btn');
    const $categoryLayer = $('.category__layer');
    const $scrollArea = $('.category__list');

    function closeAll() {
      $categoryBtn.attr('aria-expanded', 'false');
      $categoryLayer
        .removeClass('is-open')
        .removeAttr('style');
    }

    $categoryBtn.on('click', function () {
      const $btn = $(this);
      const $item = $btn.closest('.category__item');
      const $layer = $item.find('.category__layer');
      const isExpanded = $btn.attr('aria-expanded') === 'true';

      closeAll();

      if (!isExpanded) {
        $btn.attr('aria-expanded', 'true');
        $layer.addClass('is-open');

        if (window.matchMedia('(max-width: 1024px)').matches) {
          const rect = $btn[0].getBoundingClientRect();

          let left = rect.left;
          const viewportWidth = window.innerWidth;
          $layer.css({
            position: 'fixed',
            left: left,
            top: rect.bottom + 4,
            zIndex: 1000
          });
        }
      }
    });

    $(document).on('click', function (e) {
      if (!$(e.target).closest('.category').length) {
        closeAll();
      }
    });

    $(window).on('scroll', closeAll);
    $scrollArea.on('scroll', closeAll);
  },
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
  UI.prodTabs();
  UI.prodInfoMore();
  UI.prodBenefit();
  UI.reviewSort();
  UI.paymentMethod();
  UI.priceTooltip();
  UI.cartSummary();
  UI.toggle();
  UI.headerScroll();
  UI.brandFilter();
  UI.brandDropdown();
  UI.aiChatLayer();
  UI.membershipProgress();
  UI.gnbMenu();
  UI.mobileMenu();
  UI.goTop();
  UI.headerSearch();
  UI.categorySelect();
});

// resize 대응
let orderBlockResizeTimer;
$(window).on('resize.orderBlock', function () {
  clearTimeout(orderBlockResizeTimer);
  orderBlockResizeTimer = setTimeout(function () {
    UI.orderBlock();
  }, );
});