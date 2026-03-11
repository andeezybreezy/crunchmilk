(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var cov=f('coverage');var age=f('age');var term=f('term');var smoke=f('smoker');var base=cov/100000*3;var ageFactor=Math.pow(1.05,age-25);var termFactor=term/20;var smokeFactor=smoke?2.5:1;var monthly=base*ageFactor*termFactor*smokeFactor;var _r = {estMonthly:$(monthly),estAnnual:$(monthly*12),totalPremiums:$(monthly*12*term)};

    document.getElementById('estMonthly').textContent = _r.estMonthly;
    document.getElementById('estAnnual').textContent = _r.estAnnual;
    document.getElementById('totalPremiums').textContent = _r.totalPremiums;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['coverage', 'age', 'term', 'smoker'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
