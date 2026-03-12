(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var p=f('loanAmt');var fees=f('fees');var r=f('rate')/100/12;var n=f('term');var effectiveP=p-fees;var mp=p*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);var aprR=r;for(var i=0;i<100;i++){var calc=effectiveP*(aprR*Math.pow(1+aprR,n))/(Math.pow(1+aprR,n)-1);if(Math.abs(calc-mp)<0.01)break;if(calc<mp)aprR+=0.00005;else aprR-=0.00002;}var _r = {apr:pct(aprR*12*100,2),monthlyPmt:$(mp),totalCost:$(mp*n)};

    document.getElementById('apr').textContent = _r.apr;
    document.getElementById('monthlyPmt').textContent = _r.monthlyPmt;
    document.getElementById('totalCost').textContent = _r.totalCost;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['loanAmt', 'fees', 'rate', 'term'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
