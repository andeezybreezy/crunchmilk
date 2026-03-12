(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var age=f('petAge');var breed=f('breed');var vet=f('annualVet');var cov=f('coverage');var base=cov===1?25:cov===2?45:70;var ageFactor=1+age*0.08;var breedFactor=breed===1?0.85:breed===2?1:1.25;var monthly=base*ageFactor*breedFactor;var annual=monthly*12;var breakEven=annual/(1-0.2);var _r = {estMonthly:$(monthly),estAnnual:$(annual),breakEven:$(breakEven)};

    document.getElementById('estMonthly').textContent = _r.estMonthly;
    document.getElementById('estAnnual').textContent = _r.estAnnual;
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

  ['petAge', 'breed', 'annualVet', 'coverage'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
