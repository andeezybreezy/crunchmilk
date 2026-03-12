(function() {
  'use strict';

  function f(id) { return parseFloat(document.getElementById(id).value) || 0; }
  function $(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function pct(n, d) { d = d || 1; return n.toFixed(d) + '%'; }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function calculate() {
    var lp=f('lowPremium')*12;var ld=f('lowDeductible');var hp=f('highPremium')*12;var hd=f('highDeductible');var claims=f('expectedClaims');var lowOOP=Math.min(claims,ld);var highOOP=Math.min(claims,hd);var lowTotal=lp+lowOOP;var highTotal=hp+highOOP;var winner=lowTotal<highTotal?'Low deductible plan saves '+$(lowTotal-highTotal).replace('-',''):'High deductible plan saves '+$(highTotal-lowTotal).replace('-','');var _r = {lowTotal:$(lowTotal),highTotal:$(highTotal),winner:winner};

    document.getElementById('lowTotal').textContent = _r.lowTotal;
    document.getElementById('highTotal').textContent = _r.highTotal;
    document.getElementById('winner').textContent = _r.winner;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  ['lowPremium', 'lowDeductible', 'highPremium', 'highDeductible', 'expectedClaims'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
