(function(){
  var root   = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io     = null;

  document.getElementById('yr').textContent = new Date().getFullYear();

  /* --- hero cascade --- */
  requestAnimationFrame(function(){ root.classList.add('ready'); });

  /* --- the one orchestrated moment: access opens --- */
  var record = document.getElementById('record');
  if (record) {
    if (reduce) record.classList.add('is-open');
    else setTimeout(function(){ record.classList.add('is-open'); }, 1400);
  }

  /* --- count a number up once it is on screen --- */
  function countUp(el){
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;
    var t0 = null, dur = 1100;
    function step(t){
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('id-ID') + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* --- reveal system --- */
  var groups = document.querySelectorAll('.rise, .stagger');
  var counters = document.querySelectorAll('[data-count]');

  function settle(el){
    /* drop the marker once the entrance is done so :hover transitions stay crisp */
    if (!el.classList.contains('stagger')) return;
    setTimeout(function(){ el.classList.remove('stagger', 'is-in'); }, 1400);
  }

  if (reduce || !('IntersectionObserver' in window)) {
    groups.forEach(function(el){ el.classList.add('is-in'); });
    counters.forEach(function(el){
      var n = parseInt(el.getAttribute('data-count'), 10);
      el.textContent = n.toLocaleString('id-ID') + (el.getAttribute('data-suffix') || '');
    });
  } else {
    io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        if (e.target.hasAttribute('data-count')) countUp(e.target);
        settle(e.target);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    groups.forEach(function(el){ io.observe(el); });
    counters.forEach(function(el){ io.observe(el); });
  }

  /* --- nav lifts off the page once you scroll --- */
  var nav   = document.querySelector('.nav');
  var dock  = document.getElementById('dock');
  var paket = document.getElementById('paket');
  var hero  = document.getElementById('top');

  function sync(){
    var y = window.scrollY;
    if (nav) nav.classList.toggle('is-stuck', y > 8);

    var pastHero = y > (hero ? hero.offsetHeight * 0.7 : 500);
    var atPaket  = false;
    if (paket) {
      var r = paket.getBoundingClientRect();
      atPaket = r.top < window.innerHeight && r.bottom > 0;
    }
    dock.classList.toggle('is-in', pastHero && !atPaket);
  }

  var ticking = false;
  window.addEventListener('scroll', function(){
    if (!ticking) { ticking = true; requestAnimationFrame(function(){ sync(); ticking = false; }); }
  }, { passive: true });
  sync();
})();
