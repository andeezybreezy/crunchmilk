(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var prem=f('premium')*12;var ded=f('deductible');var max=f('annualMax');var costs=f('expectedCosts');var covered=Math.min(Math.max(costs-ded,0)*0.8,max);var oop=costs-covered+prem;var savings=costs-oop;var _r = {annualPremium:$(prem),outOfPocket:$(oop),savings:$(savings)};

    document.getElementById('annualPremium').textContent = _r.annualPremium;
    document.getElementById('outOfPocket').textContent = _r.outOfPocket;
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

  ['premium', 'deductible', 'annualMax', 'expectedCosts'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
