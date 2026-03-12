(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var age = parseFloat(document.getElementById('age').value) || 0;
    var exposure = document.getElementById('exposure').value;
    var earbuds = parseFloat(document.getElementById('earbuds').value) || 0;

    // Calculation logic
    var baseMax = 20000 - (age * 150); var exposureLoss = {'Low (quiet environment)': 0, 'Moderate (some loud events)': 500, 'High (concerts, machinery)': 1500, 'Very High (military, factory)': 3000}; var earbudLoss = earbuds > 4 ? 1000 : earbuds > 2 ? 500 : 0; var maxFreq = Math.max(baseMax - (exposureLoss[exposure]||0) - earbudLoss, 2000); var lossRisk = maxFreq < 8000 ? 'High' : maxFreq < 12000 ? 'Moderate' : 'Low'; var recommendation = maxFreq < 8000 ? 'Consider professional hearing evaluation' : maxFreq < 12000 ? 'Use hearing protection in loud environments' : 'Continue protecting your hearing';     document.getElementById('maxFreq').textContent = fmt(maxFreq,0);
    document.getElementById('lossRisk').textContent = lossRisk;
    document.getElementById('recommendation').textContent = recommendation;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['age', 'exposure', 'earbuds'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
