(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var age=f('age');var daily=f('dailyCost');var yrs=f('years');var inf=f('inflation')/100;var yearsUntil=80-age;var futureDaily=daily*Math.pow(1+inf,yearsUntil);var total=futureDaily*365*yrs;var premium=total/((80-age)*12)*0.15;var _r = {futureDaily:$(futureDaily),totalCost:$(total),estPremium:$(premium)};

    document.getElementById('futureDaily').textContent = _r.futureDaily;
    document.getElementById('totalCost').textContent = _r.totalCost;
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

  ['age', 'dailyCost', 'years', 'inflation'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
