(function(){
  var TG = 'https://t.me/tatianaopria_pro', MAIL = 'tatiana.myway@gmail.com', PAY = 'https://www.tatianaopria.com/prod/602967';
  var box = document.createElement('div');
  box.className = 'fw';
  box.innerHTML =
    '<button class="fw-btn" type="button" aria-expanded="false" aria-controls="fw-panel"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg><span>Записатися</span></button>' +
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
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var f = form.elements, via = (e.submitter && e.submitter.value) || 'tg';
    var msg = 'Заявка з сайту: ' + topic + '\n\nІм\'я: ' + f.n.value.trim() + '\nКонтакт: ' + f.c.value.trim() + (f.t.value.trim() ? '\n\n' + f.t.value.trim() : '');
    if (via === 'mail') location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Заявка з сайту: ' + topic) + '&body=' + encodeURIComponent(msg);
    else window.open(TG + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });
})();
