(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var nw=f('netWorth');var auto=f('autoLimit');var home=f('homeLimit');var risk=f('riskFactors');var coverage=Math.max(nw,1000000);coverage=Math.ceil(coverage/1000000)*1000000;var gap=Math.max(0,nw-Math.min(auto,home));var premium=150+(coverage/1000000-1)*75+risk*25;var _r = {recommended:$(coverage),estAnnual:$(premium),gap:$(gap)};

    document.getElementById('recommended').textContent = _r.recommended;
    document.getElementById('estAnnual').textContent = _r.estAnnual;
    document.getElementById('gap').textContent = _r.gap;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['netWorth', 'autoLimit', 'homeLimit', 'riskFactors'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
