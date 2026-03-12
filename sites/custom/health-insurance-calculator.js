(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var prem=f('premium')*12;var ded=f('deductible');var coins=f('coinsurance')/100;var max=f('oopm');var usage=f('usage');var afterDed=Math.max(usage-ded,0);var yourShare=Math.min(ded+afterDed*coins,max);var total=prem+yourShare;var _r = {annualPremium:$(prem),oop:$(yourShare),totalCost:$(total)};

    document.getElementById('annualPremium').textContent = _r.annualPremium;
    document.getElementById('oop').textContent = _r.oop;
    document.getElementById('totalCost').textContent = _r.totalCost;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['premium', 'deductible', 'coinsurance', 'oopm', 'usage'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
