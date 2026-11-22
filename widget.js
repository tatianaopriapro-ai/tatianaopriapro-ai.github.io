(function(){
  var TG = 'https://t.me/tatianaopria_pro', MAIL = 'tatiana.myway@gmail.com';
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
        '<input class="fw-hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
        '<button class="btn" type="submit">Надіслати заявку</button>' +
        '<button class="btn gold fw-pay" type="button">Оплатити онлайн</button>' +
        '<p class="fw-msg" role="status" hidden></p>' +
      '</form>' +
      '<p class="fw-n">Заявка одразу надходить Тетяні. Натискаючи кнопку, ви погоджуєтеся з <a href="polityka.html">політикою конфіденційності</a>.</p>' +
    '</div>';
  document.body.appendChild(box);
  var btn = box.querySelector('.fw-btn'), panel = box.querySelector('.fw-panel'), form = box.querySelector('form'), topic = 'Первинна консультація';
  var PAYABLE = {'Первинна консультація': '602967', 'Цикл сеансів атмахілінгу, персональний': '618782', 'Грошовий потік — атмахілінг, група': '695992'};
  var payBtn = box.querySelector('.fw-pay');
  var T0 = box.querySelector('.fw-t').textContent;
  function open(t){
    if (t){ topic = t; box.querySelector('.fw-cap').textContent = t; form.elements.t.value = 'Хочу замовити: ' + t; }
    payBtn.hidden = !PAYABLE[topic];
    var INFO = {'Цикл сеансів атмахілінгу, персональний': '306 €. Оплатіть онлайн або залиште заявку — узгодимо час і деталі.', 'Грошовий потік — атмахілінг, група': '161 €. Оплатіть онлайн або залиште заявку — надішлю розклад групи.'};
    if (t) box.querySelector('.fw-t').textContent = INFO[t] || (t === 'Первинна консультація' ? T0 : 'Залиште контакти — я напишу вам і відповім на запитання.');
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

  var API = 'https://opria-forms.tatianaopria-pro.workers.dev/';
  var msgEl = box.querySelector('.fw-msg'), sendBtn = form.querySelector('button[type=submit]');
  function say(text, ok){ msgEl.hidden = false; msgEl.textContent = text; msgEl.className = 'fw-msg ' + (ok ? 'ok' : 'err'); }
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var f = form.elements;
    var data = {kind: 'Заявка', topic: topic, name: f.n.value.trim(), contact: f.c.value.trim(), text: f.t.value.trim(), website: f.website.value};
    sendBtn.disabled = true; sendBtn.textContent = 'Надсилаю…'; msgEl.hidden = true;
    fetch(API, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)})
      .then(function(r){ if (!r.ok) throw new Error('bad'); return r.json(); })
      .then(function(){
        say('Дякую! Заявку отримано — я зв\'яжуся з вами найближчим часом.', true);
        form.reset(); sendBtn.textContent = 'Надіслано';
        setTimeout(function(){ sendBtn.disabled = false; sendBtn.textContent = 'Надіслати заявку'; }, 4000);
      })
      .catch(function(){
        sendBtn.disabled = false; sendBtn.textContent = 'Надіслати заявку';
        var txt = 'Заявка з сайту: ' + topic + '\n\nІм\'я: ' + data.name + '\nКонтакт: ' + data.contact + (data.text ? '\n\n' + data.text : '');
        msgEl.hidden = false; msgEl.className = 'fw-msg err';
        msgEl.innerHTML = 'Не вдалося надіслати. <a href="' + TG + '?text=' + encodeURIComponent(txt) + '" target="_blank" rel="noopener">Написати в Telegram</a>';
      });
  });
  payBtn.addEventListener('click', function(){
    if (!form.reportValidity()) return;
    var f = form.elements;
    var data = {kind: 'pay', id: PAYABLE[topic], topic: topic, name: f.n.value.trim(), contact: f.c.value.trim(), text: f.t.value.trim(), website: f.website.value};
    payBtn.disabled = true; payBtn.textContent = 'Відкриваю оплату…'; msgEl.hidden = true;
    fetch(API, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)})
      .then(function(r){ return r.json(); })
      .then(function(j){
        if (j && j.url && /^https:\/\/pay\.(mbnk\.biz|monobank\.ua)\//.test(j.url)){ location.href = j.url; return; }
        throw new Error('nopay');
      })
      .catch(function(){
        payBtn.disabled = false; payBtn.textContent = 'Оплатити онлайн';
        say('Онлайн-оплата зараз недоступна. Надішліть заявку — я зв\'яжуся з вами й надішлю посилання на оплату.', false);
      });
  });
})();
