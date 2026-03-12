(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var ideal=f('idealSleep');var actual=f('actualSleep');var days=f('days');var daily=ideal-actual;var total=daily*days;var recovery=Math.ceil(total/1.5);var _r = {dailyDebt:fmt(daily,1)+' hours',totalDebt:fmt(total,0)+' hours',recoveryTime:fmt(recovery,0)+' days (adding 1.5 hrs/night)'};

    document.getElementById('dailyDebt').textContent = _r.dailyDebt;
    document.getElementById('totalDebt').textContent = _r.totalDebt;
    document.getElementById('recoveryTime').textContent = _r.recoveryTime;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['idealSleep', 'actualSleep', 'days'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
