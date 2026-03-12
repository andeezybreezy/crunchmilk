(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var d=f('totalDebt');var r1=f('avgRate')/100/12;var r2=f('newRate')/100/12;var n=f('newTerm')*12;var mp1=d*(r1*Math.pow(1+r1,n))/(Math.pow(1+r1,n)-1);var mp2=d*(r2*Math.pow(1+r2,n))/(Math.pow(1+r2,n)-1);var _r = {curMonthly:$(mp1),newMonthly:$(mp2),savings:$((mp1-mp2)*n)};

    document.getElementById('curMonthly').textContent = _r.curMonthly;
    document.getElementById('newMonthly').textContent = _r.newMonthly;
    document.getElementById('savings').textContent = _r.savings;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['totalDebt', 'avgRate', 'newRate', 'newTerm'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
