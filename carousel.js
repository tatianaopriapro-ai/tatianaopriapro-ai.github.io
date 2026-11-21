(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-carousel]').forEach(function(root){
    var track = root.querySelector('.rtrack'), slides = track.children;
    var prev = root.querySelector('.car-b.prev'), next = root.querySelector('.car-b.next'), dots = root.querySelector('.dots');
    var pages = 1, hold = false, seen = false;
    function gap(){ return parseFloat(getComputedStyle(track).columnGap) || 0; }
    function step(){ return slides[0].getBoundingClientRect().width + gap(); }
    function cur(){ return Math.round(track.scrollLeft / step()); }
    function go(i){ track.scrollTo({left: i * step(), behavior: reduce ? 'auto' : 'smooth'}); }
    function mark(){
      var c = Math.min(cur(), pages - 1);
      [].forEach.call(dots.children, function(d, i){ d.setAttribute('aria-current', i === c); });
      prev.disabled = c <= 0; next.disabled = c >= pages - 1;
    }
    function build(){
      var per = Math.max(1, Math.round((track.clientWidth + gap()) / step()));
      pages = Math.max(1, slides.length - per + 1);
      dots.innerHTML = '';
      for (var i = 0; i < pages; i++) (function(i){
        var d = document.createElement('button'); d.type = 'button';
        d.setAttribute('aria-label', 'Відгук ' + (i + 1));
        d.addEventListener('click', function(){ go(i); }); dots.appendChild(d);
      })(i);
      mark();
    }
    prev.addEventListener('click', function(){ go(cur() - 1); });
    next.addEventListener('click', function(){ go(cur() + 1); });
    track.addEventListener('scroll', mark, {passive:true});
    track.addEventListener('keydown', function(e){
      if (e.key === 'ArrowRight'){ e.preventDefault(); go(cur() + 1); }
      if (e.key === 'ArrowLeft'){ e.preventDefault(); go(cur() - 1); }
    });
    if (!reduce) {
      var auto = true;
      setInterval(function(){ if (auto && !hold && seen && pages > 1) go(cur() >= pages - 1 ? 0 : cur() + 1); }, 6000);
      ['pointerdown','touchstart','keydown','wheel'].forEach(function(e){ root.addEventListener(e, function(){ auto = false; }, {passive:true}); });
      ['pointerenter','focusin','touchstart'].forEach(function(e){ root.addEventListener(e, function(){ hold = true; }, {passive:true}); });
      ['pointerleave','focusout'].forEach(function(e){ root.addEventListener(e, function(){ hold = false; }); });
      root.addEventListener('touchend', function(){ setTimeout(function(){ hold = false; }, 7000); }, {passive:true});
      if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ seen = es[0].isIntersecting; }, {threshold:.3}).observe(root);
      else seen = true;
    }
    var w = track.clientWidth;
    addEventListener('resize', function(){ if (track.clientWidth !== w){ w = track.clientWidth; build(); } });
    build();

    /* каскад: відгуки «пишуться» по черзі — картка за карткою, рядок за рядком */
    if (!reduce && 'IntersectionObserver' in window) {
      track.classList.add('cas');
      var inner = null;
      function watch(){
        if (inner) return;
        inner = new IntersectionObserver(function(es){
          var coming = es.filter(function(e){ return e.isIntersecting && !e.target.classList.contains('on'); })
                         .sort(function(a, b){ return a.target.offsetLeft - b.target.offsetLeft; });
          coming.forEach(function(e, k){ e.target.style.setProperty('--d', (k * 650) + 'ms'); e.target.classList.add('on'); });
          es.forEach(function(e){ if (!e.isIntersecting) e.target.classList.remove('on'); });
        }, {root: track, threshold: .55});
        [].forEach.call(slides, function(sl){ inner.observe(sl); });
      }
      new IntersectionObserver(function(es){ if (es[0].isIntersecting) watch(); }, {threshold:.25}).observe(root);
    }
  });
})();
