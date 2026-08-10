document.addEventListener('DOMContentLoaded', function () {
  var rotator = document.getElementById('research-rotator');
  if (!rotator) return;

  var slides = Array.prototype.slice.call(rotator.querySelectorAll('.rotator-slide'));
  var dots = Array.prototype.slice.call(rotator.querySelectorAll('.rotator-dot'));
  var prevBtn = rotator.querySelector('.rotator-prev');
  var nextBtn = rotator.querySelector('.rotator-next');
  if (!slides.length) return;

  var current = 0;
  var intervalId = null;
  var AUTO_ADVANCE_MS = 6000;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  function next() {
    show(current + 1);
  }

  function prev() {
    show(current - 1);
  }

  function startAuto() {
    if (reduceMotion || intervalId) return;
    intervalId = setInterval(next, AUTO_ADVANCE_MS);
  }

  function stopAuto() {
    clearInterval(intervalId);
    intervalId = null;
  }

  nextBtn.addEventListener('click', function () {
    next();
    stopAuto();
    startAuto();
  });
  prevBtn.addEventListener('click', function () {
    prev();
    stopAuto();
    startAuto();
  });
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      show(i);
      stopAuto();
      startAuto();
    });
  });

  rotator.addEventListener('mouseenter', stopAuto);
  rotator.addEventListener('mouseleave', startAuto);

  show(0);
  startAuto();
});
