(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var p=f('initial');var m=f('monthly');var r=f('returnRate')/100/12;var n=f('years')*12;var fv=p*Math.pow(1+r,n)+m*((Math.pow(1+r,n)-1)/r);var contrib=p+m*n;var _r = {contributions:$(contrib),growth:$(fv-contrib),finalBal:$(fv)};

    document.getElementById('contributions').textContent = _r.contributions;
    document.getElementById('growth').textContent = _r.growth;
    document.getElementById('finalBal').textContent = _r.finalBal;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['initial', 'monthly', 'returnRate', 'years'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
