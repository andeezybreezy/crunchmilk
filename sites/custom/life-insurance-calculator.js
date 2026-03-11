(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var inc=f('income')*f('years');var debts=f('debts');var col=f('college');var sav=f('savings');var total=inc+debts+col-sav;if(total<0)total=0;var premium=total/1000*0.5;var _r = {incomeNeed:$(inc),totalNeed:$(total),estPremium:$(premium)};

    document.getElementById('incomeNeed').textContent = _r.incomeNeed;
    document.getElementById('totalNeed').textContent = _r.totalNeed;
    document.getElementById('estPremium').textContent = _r.estPremium;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['income', 'years', 'debts', 'college', 'savings'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
