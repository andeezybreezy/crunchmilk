(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var sav=f('savings');var wr=f('withdrawRate')/100;var ss=f('socialSecurity');var pen=f('pension');var other=f('otherIncome');var fromSav=sav*wr/12;var total=fromSav+ss+pen+other;var _r = {fromSavings:$(fromSav),totalMonthly:$(total),totalAnnual:$(total*12)};

    document.getElementById('fromSavings').textContent = _r.fromSavings;
    document.getElementById('totalMonthly').textContent = _r.totalMonthly;
    document.getElementById('totalAnnual').textContent = _r.totalAnnual;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['savings', 'withdrawRate', 'socialSecurity', 'pension', 'otherIncome'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
