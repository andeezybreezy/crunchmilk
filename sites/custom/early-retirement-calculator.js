(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var exp=f('expenses');var sav=f('savings');var m=f('monthlyAdd');var r=f('returnRate')/100/12;var wr=f('withdrawRate')/100;var target=exp/wr;var gap=target-sav;var years=0;var bal=sav;while(bal<target&&years<100){bal=bal*(1+r)+m;years+=1/12;}var _r = {fireNumber:$(target),gap:$(Math.max(0,gap)),yearsToFire:fmt(years,1)+' years'};

    document.getElementById('fireNumber').textContent = _r.fireNumber;
    document.getElementById('gap').textContent = _r.gap;
    document.getElementById('yearsToFire').textContent = _r.yearsToFire;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['expenses', 'savings', 'monthlyAdd', 'returnRate', 'withdrawRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
