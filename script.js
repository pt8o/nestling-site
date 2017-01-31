$(document).ready(function() {
  checkWindowRatio();
  animateDef();
});

$(window).resize(function() {
  checkWindowRatio();
});

function checkWindowRatio(div) {
  var windowRatio = $(window).width() / $(window).height();
  var imageRatio = 4/3;

  if (windowRatio < imageRatio) {
    $('.fullscreen').addClass('tall');
  } else {
    $('.fullscreen').removeClass('tall');
  }
}

function animateDef() {
  var delayTime = 3000;
  var fadeTime = 1000;

  $('#verb').delay(delayTime).fadeOut(fadeTime);
  $('#noun').delay(delayTime).fadeIn(fadeTime);
  $('#noun').delay(delayTime).fadeOut(fadeTime);
  $('#verb').delay(delayTime).fadeIn(fadeTime, animateDef);
}
