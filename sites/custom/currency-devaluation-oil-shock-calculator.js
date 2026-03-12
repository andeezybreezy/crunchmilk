(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var country = document.getElementById('country').value;
    var oilSpike = parseFloat(document.getElementById('oilSpike').value) || 0;

    // Calculation logic
    var vuln = {eur: {sensitivity: 0.08, reserves: 'Strong', vuln: 'Low'}, gbp: {sensitivity: 0.10, reserves: 'Strong', vuln: 'Low-Moderate'}, jpy: {sensitivity: 0.12, reserves: 'Very Strong', vuln: 'Moderate'}, inr: {sensitivity: 0.20, reserves: 'Adequate', vuln: 'High'}, try: {sensitivity: 0.35, reserves: 'Weak', vuln: 'Very High'}, krw: {sensitivity: 0.15, reserves: 'Strong', vuln: 'Moderate'}, pkr: {sensitivity: 0.40, reserves: 'Critical', vuln: 'Extreme'}, egp: {sensitivity: 0.45, reserves: 'Critical', vuln: 'Extreme'}}; var d = vuln[country]; var deval = oilSpike * d.sensitivity / 100; var importCostInc = deval * 0.6 + oilSpike / 100 * 0.3; var inflation = deval * 0.4 + oilSpike / 100 * 0.15;     document.getElementById('devaluation').textContent = '-' + (deval * 100).toFixed(1) + '% vs USD';
    document.getElementById('importCost').textContent = '+' + (importCostInc * 100).toFixed(1) + '% overall';
    document.getElementById('inflationImpact').textContent = '+' + (inflation * 100).toFixed(1) + '% additional inflation';
    document.getElementById('vulnerability').textContent = d.vuln;
    document.getElementById('reserves').textContent = d.reserves + ' forex reserves';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['country', 'oilSpike'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
