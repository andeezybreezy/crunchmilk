(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var bel=f('belongings');var lia=f('liability');var ded=f('deductible');var base=bel*0.01+lia*0.002;var dedDiscount=ded>=1000?0.85:ded>=500?0.9:1;var annual=base*dedDiscount;var _r = {estMonthly:$(annual/12),estAnnual:$(annual),coverage:$(bel)};

    document.getElementById('estMonthly').textContent = _r.estMonthly;
    document.getElementById('estAnnual').textContent = _r.estAnnual;
    document.getElementById('coverage').textContent = _r.coverage;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['belongings', 'liability', 'deductible'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
