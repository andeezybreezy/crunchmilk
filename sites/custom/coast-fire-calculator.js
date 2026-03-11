(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var bal=f('balance');var target=f('target');var r=f('returnRate')/100;var years=f('retireAge')-f('currentAge');var fv=bal*Math.pow(1+r,years);var needed=target/Math.pow(1+r,years);var status=bal>=needed?'You have reached Coast FIRE!':'Not yet — keep saving';var _r = {futureVal:$(fv),coastReady:status,neededNow:$(needed)};

    document.getElementById('futureVal').textContent = _r.futureVal;
    document.getElementById('coastReady').textContent = _r.coastReady;
    document.getElementById('neededNow').textContent = _r.neededNow;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['balance', 'target', 'returnRate', 'retireAge', 'currentAge'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
