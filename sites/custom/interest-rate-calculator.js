(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var p=f('principal');var pmt=f('payment');var n=f('months');var total=pmt*n;var ti=total-p;var r=0.005;for(var i=0;i<100;i++){var calc=p*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);if(Math.abs(calc-pmt)<0.01)break;if(calc<pmt)r+=0.0001;else r-=0.00005;}var _r = {rate:pct(r*12*100,2),totalPaid:$(total),totalInt:$(ti)};

    document.getElementById('rate').textContent = _r.rate;
    document.getElementById('totalPaid').textContent = _r.totalPaid;
    document.getElementById('totalInt').textContent = _r.totalInt;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['principal', 'payment', 'months'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
