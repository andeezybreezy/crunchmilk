(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var scenario = document.getElementById('scenario').value;
    var savings = parseFloat(document.getElementById('savings').value) || 0;
    var investInForeign = parseFloat(document.getElementById('investInForeign').value) || 0;

    // Calculation logic
    var scenarios={minimal:{deval:5,inflation:1,rates:0.5},partial:{deval:15,inflation:3,rates:1.5},full:{deval:30,inflation:6,rates:3}}; var s=scenarios[scenario]; var savingsLoss=savings*(s.deval/100); var foreignGain=savings*(investInForeign/100)*(s.deval/100)*0.8; var diversifiedValue=savings-savingsLoss+foreignGain+savings*(investInForeign/100);     document.getElementById('dollarImpact').textContent = '-'+s.deval+'% against major currencies';
    document.getElementById('inflationBoost').textContent = '+'+s.inflation+'% additional inflation';
    document.getElementById('interestRateImpact').textContent = '+'+s.rates+'% higher rates likely';
    document.getElementById('savingsImpact').textContent = '-'+dollar(savingsLoss)+' in purchasing power';
    document.getElementById('diversifiedValue').textContent = dollar(diversifiedValue)+' (diversified portfolio)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['scenario', 'savings', 'investInForeign'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
