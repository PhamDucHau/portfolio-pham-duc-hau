(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Header background on scroll + active link */
  var header = $('#header');
  var sections = $$('main section[id]');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
    var y = window.scrollY + 120;
    sections.forEach(function (sec) {
      var link = $('.nav__link[href="#' + sec.id + '"]');
      if (!link) return;
      link.classList.toggle('active-link', y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var toggle = $('#nav-toggle'), navList = $('#nav-list');
  function setMenu(open) {
    navList.classList.toggle('show', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    $('i', toggle).className = open ? 'ri-close-line' : 'ri-menu-line';
  }
  toggle.addEventListener('click', function () { setMenu(!navList.classList.contains('show')); });
  $$('.nav__link', navList).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  /* Projects carousel buttons */
  var track = $('.projects__container');
  $$('.projects__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var card = $('.projects__card', track);
      track.scrollBy({ left: Number(b.dataset.dir) * (card.offsetWidth + 24), behavior: 'smooth' });
    });
  });

  /* Work tabs */
  $$('.work__button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.work__button, .work__content').forEach(function (e) { e.classList.remove('work__active'); });
      btn.classList.add('work__active');
      $(btn.dataset.target).classList.add('work__active');
    });
  });

  /* Services accordion */
  var cards = $$('.services__card');
  cards.forEach(function (card, i) {
    $('.services__header', card).addEventListener('click', function () {
      var open = card.classList.contains('open');
      cards.forEach(function (c) { c.classList.remove('open'); });
      if (!open) card.classList.add('open');
    });
    if (i === 0) card.classList.add('open');
  });

  /* Testimonials: duplicate cards for infinite scroll */
  var tt = $('.testimonials__track');
  if (tt) $$('.testimonials__card', tt).forEach(function (c) {
    var clone = c.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    tt.appendChild(clone);
  });

  /* Copy email */
  var copyBtn = $('#copy-email'), msg = $('#copy-msg');
  copyBtn.addEventListener('click', function () {
    var email = $('span', copyBtn).textContent.trim();
    var done = function () {
      msg.classList.add('show');
      setTimeout(function () { msg.classList.remove('show'); }, 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(done, done);
    } else { done(); }
  });

  /* Year */
  $('#year').textContent = new Date().getFullYear();

  /* Custom cursor */
  var cursor = $('.cursor');
  window.addEventListener('mousemove', function (e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  $$('a, button, .services__header').forEach(function (el) {
    el.addEventListener('mouseenter', function () { cursor.classList.add('hide'); });
    el.addEventListener('mouseleave', function () { cursor.classList.remove('hide'); });
  });

  /* Scroll reveal */
  var targets = $$('.section__title, .about__container > *, .projects__card, .work__card, .services__card, .contact__container > *');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.1 });
    targets.forEach(function (t) { t.classList.add('reveal'); io.observe(t); });
  }
})();
