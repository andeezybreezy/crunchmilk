(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var p=f('principal');var r=f('rate')/100/12;var n=f('years')*12;var pmt=p*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);var _r = {monthlyPmt:$(pmt),totalPaid:$(pmt*n),totalInt:$(pmt*n-p)};

    document.getElementById('monthlyPmt').textContent = _r.monthlyPmt;
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

  ['principal', 'rate', 'years'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
