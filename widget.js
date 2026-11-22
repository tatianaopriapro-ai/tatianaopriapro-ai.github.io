(function(){
  var TG = 'https://t.me/tatianaopria_pro', MAIL = 'tatiana.myway@gmail.com', PAY = 'https://www.tatianaopria.com/prod/602967';
  var box = document.createElement('div');
  box.className = 'fw';
  box.innerHTML =
    '<button class="fw-btn" type="button" aria-expanded="false" aria-controls="fw-panel" aria-label="Записатися на консультацію"><span class="fw-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/></svg></span><span class="fw-l">Записатися</span><span class="fw-more">на консультацію →</span></button>' +
    '<div class="fw-panel" id="fw-panel" role="dialog" aria-label="Замовити консультацію" hidden>' +
      '<button class="fw-x" type="button" aria-label="Закрити">×</button>' +
      '<p class="fw-cap">Первинна консультація</p>' +
      '<h3>З чого почати?</h3>' +
      '<p class="fw-t">60 хвилин · 60 €. Розповідаєте, що турбує, — разом формуємо запит і формат роботи.</p>' +
      '<form>' +
        '<label>Ім\'я<input name="n" required maxlength="60" autocomplete="given-name"></label>' +
        '<label>Телефон або Telegram<input name="c" required maxlength="80" autocomplete="tel"></label>' +
        '<label>Ваш запит<textarea name="t" rows="3" maxlength="800" placeholder="Кілька слів про ситуацію"></textarea></label>' +
        '<button class="btn" type="submit" value="tg">Надіслати в Telegram</button>' +
        '<button class="btn ghost" type="submit" value="mail">Надіслати поштою</button>' +
      '</form>' +
      '<a class="fw-pay" href="' + PAY + '" target="_blank" rel="noopener">Одразу оплатити консультацію →</a>' +
      '<p class="fw-n">Повідомлення відкриється у вашому Telegram або пошті. <a href="polityka.html">Політика конфіденційності</a></p>' +
    '</div>';
  document.body.appendChild(box);
  var btn = box.querySelector('.fw-btn'), panel = box.querySelector('.fw-panel'), form = box.querySelector('form'), topic = 'Первинна консультація';
  function open(t){
    if (t){ topic = t; box.querySelector('.fw-cap').textContent = t; form.elements.t.value = 'Хочу замовити: ' + t; }
    panel.hidden = false; btn.setAttribute('aria-expanded', true); box.classList.add('open');
    form.elements.n.focus();
  }
  function close(){ panel.hidden = true; btn.setAttribute('aria-expanded', false); box.classList.remove('open'); }
  btn.addEventListener('click', function(){ panel.hidden ? open() : close(); });
  box.querySelector('.fw-x').addEventListener('click', close);
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !panel.hidden) close(); });
  document.addEventListener('click', function(e){
    var o = e.target.closest('[data-order]');
    if (o){ e.preventDefault(); open(o.getAttribute('data-order')); }
  });
  /* кнопка згортається в кружечок, коли під нею опиняється інша кнопка чи поле, і розгортається, коли місце вільне */
  var IMPORTANT = '.btn, button, input, textarea, select, summary, .tlink, .links a, footer a, .pay, .price, .opt-p, .pprice';
  var ticking = false;
  function blocked(){
    var W = window.innerWidth, H = window.innerHeight, small = W <= 640;
    var right = W - (small ? 14 : 22), bottom = H - (small ? 14 : 22), w = small ? 176 : 196, h = small ? 54 : 60;
    for (var ix = 0; ix < 5; ix++) for (var iy = 0; iy < 3; iy++){
      var x = right - w + (w - 2) * ix / 4 + 1, y = bottom - h + (h - 2) * iy / 2 + 1;
      var stack = document.elementsFromPoint(x, y);
      for (var k = 0; k < stack.length; k++){
        var el = stack[k];
        if (box.contains(el)) continue;
        if (el.closest && el.closest(IMPORTANT)) return true;
        if (el === document.body || el === document.documentElement) break;
      }
    }
    return false;
  }
  function check(){ ticking = false; if (!panel.hidden) return; box.classList.toggle('mini', blocked()); }
  function ask(){ if (!ticking){ ticking = true; requestAnimationFrame(check); } }
  window.addEventListener('scroll', ask, {passive:true});
  window.addEventListener('resize', ask);
  document.addEventListener('scroll', ask, {passive:true, capture:true});
  setTimeout(check, 600);

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var f = form.elements, via = (e.submitter && e.submitter.value) || 'tg';
    var msg = 'Заявка з сайту: ' + topic + '\n\nІм\'я: ' + f.n.value.trim() + '\nКонтакт: ' + f.c.value.trim() + (f.t.value.trim() ? '\n\n' + f.t.value.trim() : '');
    if (via === 'mail') location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Заявка з сайту: ' + topic) + '&body=' + encodeURIComponent(msg);
    else window.open(TG + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });
})();
