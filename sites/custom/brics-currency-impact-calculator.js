(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var scenario = document.getElementById('scenario').value;
    var savings = parseFloat(document.getElementById('savings').value) || 0;
    var investInForeign = parseFloat(document.getElementById('investInForeign').value) || 0;

    // Calculation logic
    var scenarios={minimal:{deval:5,inflation:1,rates:0.5},partial:{deval:15,inflation:3,rates:1.5},full:{deval:30,inflation:6,rates:3}}; var s=scenarios[scenario]; var savingsLoss=savings*(s.deval/100); var foreignGain=savings*(investInForeign/100)*(s.deval/100)*0.8; var diversifiedValue=savings-savingsLoss+foreignGain+savings*(investInForeign/100); return {dollarImpact:'-'+s.deval+'% against major currencies', inflationBoost:'+'+s.inflation+'% additional inflation', interestRateImpact:'+'+s.rates+'% higher rates likely', savingsImpact:'-'+dollar(savingsLoss)+' in purchasing power', diversifiedValue:dollar(diversifiedValue)+' (diversified portfolio)'};

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
