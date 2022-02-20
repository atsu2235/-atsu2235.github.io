$(function() {

  //画像のプリロード
  $('<img src="img/pc/nav_icon_company_on.png">');
  $('<img src="img/pc/nav_icon_faq_on.png">');
  $('<img src="img/pc/nav_icon_outline_on.png">');
  $('<img src="img/pc/nav_icon_point_on.png">');
  $('<img src="img/pc/nav_icon_benefit_on.png">');

  //要素が表示領域にあるか判定
  var isInview = function($target) {
    var scrollTop = $(window).scrollTop();
    var targetTop = $target.offset().top;
    var pos = targetTop - $(window).height();
    if (scrollTop > pos && scrollTop < targetTop + $target.outerHeight()) {
      return true;
    } else {
      return false;
    }
  };

  //スムーズスクロール
  $('a[href^="#"]').click(function() {
    var speed = 500;
    var href = $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top;
    var headerHeight = $('header').innerHeight();
    var offset = 0;
    var vw = $(window).width();
    if (vw < 768) offset = 70 / 750 * vw;
    $("html, body").animate({
      scrollTop: position - headerHeight - offset
    }, speed, "swing");
    return false;
  });

  //トップに戻るボタンのクリック時
  $('.link__top a').on('click', function(e) {
    $('body,html').stop().animate({
      scrollTop: 0
    }, 500);
    return false;
  });

  //出展企業トグル
  var toggleCompany = function() {
    var $company = $('#company');
    var $table = $company.find('table');
    $company.toggleClass('expanded');
    if ($company.hasClass('expanded')) {
      $table.fadeIn();
    } else {
      var scrollTop = document.documentElement.scrollTop;
      var tableHeight = $table.outerHeight() + parseInt($table.css('marginBottom').replace('px', ''));
      $table.fadeOut(400, function() {
        document.documentElement.scrollTop = scrollTop - tableHeight;
      });
    }
  };

  //すべての出展企業を見るボタンクリック時
  $('.showMore').click(function() {
    toggleCompany();
    return false;
  });

  //ポジション更新
  var updatePosition = function() {
    var scrollTop = $(window).scrollTop();
    var $linkTop = $('.link__top');
    var $entry = $('#entry');
    var $nav = $('nav');
    var navTop = $('header').height();

    if (scrollTop > navTop) {
      $nav.addClass('fixed');
    } else {
      $nav.removeClass('fixed');
    }

    if (isInview($('#mv'))) {
      if ($linkTop.is(':visible') && $linkTop.css('opacity') == 1) {
        $entry.stop().fadeOut();
        $linkTop.stop().fadeOut();
      }
    } else {
      $linkTop.fadeIn();
      $entry.fadeIn();
    }

    var entryTop = $entry.offset().top + $entry.outerHeight();
    var wh = window.innerHeight;

    if (scrollTop + wh < entryTop) {
      $entry.addClass('fixed');
      $linkTop.removeClass('upper');
    } else {
      $entry.removeClass('fixed');
      $linkTop.addClass('upper');
    }

  };

  //スクロール時
  $(window).scroll(function() {
    updatePosition();
  });

}); //onload
