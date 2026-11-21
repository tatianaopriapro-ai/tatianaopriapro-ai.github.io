(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var burger = document.querySelector('.burger'), menu = document.getElementById('menu');
  function setMenu(open){ menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); }
  burger.addEventListener('click', function(){ setMenu(!menu.classList.contains('open')); });
  menu.addEventListener('click', function(e){ if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') setMenu(false); });

  var rv = document.querySelectorAll('.rv');
  if (reduce || !('IntersectionObserver' in window)) rv.forEach(function(el){ el.classList.add('in'); });
  else {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {rootMargin:'0px 0px -8% 0px'});
    rv.forEach(function(el){ io.observe(el); });
  }

  document.querySelectorAll('.yt').forEach(function(b){
    b.addEventListener('click', function(){
      if (b.querySelector('iframe')) return;
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + b.dataset.id + '?autoplay=1&rel=0';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true; f.title = b.getAttribute('aria-label');
      b.querySelector('.th').appendChild(f);
    });
  });
})();
