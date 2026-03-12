(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var bal=f('balance');var ann=f('annual');var r=f('returnRate')/100;var y=f('years');var fv=bal*Math.pow(1+r,y)+ann*((Math.pow(1+r,y)-1)/r);var contrib=bal+ann*y;var _r = {finalBal:$(fv),contributions:$(ann*y),growth:$(fv-contrib)};

    document.getElementById('finalBal').textContent = _r.finalBal;
    document.getElementById('contributions').textContent = _r.contributions;
    document.getElementById('growth').textContent = _r.growth;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['balance', 'annual', 'returnRate', 'years'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
