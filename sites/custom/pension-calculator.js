(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var sal=f('salary');var yrs=f('years');var mult=f('multiplier')/100;var annual=sal*yrs*mult;var monthly=annual/12;var lump=annual*15;var _r = {annualPension:$(annual),monthlyPension:$(monthly),lumpSum:$(lump)};

    document.getElementById('annualPension').textContent = _r.annualPension;
    document.getElementById('monthlyPension').textContent = _r.monthlyPension;
    document.getElementById('lumpSum').textContent = _r.lumpSum;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['salary', 'years', 'multiplier', 'retireAge'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
