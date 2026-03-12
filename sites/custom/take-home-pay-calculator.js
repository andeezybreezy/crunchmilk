(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var g=f('gross');var fed=g*f('fedRate')/100;var st=g*f('stateRate')/100;var fica=g*0.0765;var ret=g*f('retirement')/100;var health=f('healthIns')*12;var net=g-fed-st-fica-ret-health;var rate=(g-net)/g*100;var _r = {annualNet:$(net),monthlyNet:$(net/12),effectiveRate:pct(rate,1)};

    document.getElementById('annualNet').textContent = _r.annualNet;
    document.getElementById('monthlyNet').textContent = _r.monthlyNet;
    document.getElementById('effectiveRate').textContent = _r.effectiveRate;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['gross', 'fedRate', 'stateRate', 'retirement', 'healthIns'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
