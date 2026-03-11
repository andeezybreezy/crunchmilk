(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var sz=f('breed');var age=f('age');var cov=f('coverage');var ded=f('deductible');var base=cov===1?15:cov===2?40:65;var ageFactor=1+age*0.08;var szFactor=sz===1?0.85:sz===2?1:1.3;var monthly=base*ageFactor*szFactor;var annual=monthly*12;var be=(annual+ded)/0.8;var _r = {monthly:$(monthly),annual:$(annual),breakEven:$(be)};

    document.getElementById('monthly').textContent = _r.monthly;
    document.getElementById('annual').textContent = _r.annual;
    document.getElementById('breakEven').textContent = _r.breakEven;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['breed', 'age', 'coverage', 'deductible'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
