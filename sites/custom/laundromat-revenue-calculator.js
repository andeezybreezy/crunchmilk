(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var washers = parseFloat(document.getElementById('washers').value) || 0;
    var dryers = parseFloat(document.getElementById('dryers').value) || 0;
    var turnsPerDay = parseFloat(document.getElementById('turnsPerDay').value) || 0;
    var washPrice = parseFloat(document.getElementById('washPrice').value) || 0;
    var dryPrice = parseFloat(document.getElementById('dryPrice').value) || 0;

    // Calculation logic
    var dailyWash = washers * turnsPerDay * washPrice; var dailyDry = dryers * turnsPerDay * dryPrice; var monthlyRevenue = (dailyWash + dailyDry) * 30; var netIncome = monthlyRevenue * 0.35; var annualRevenue = monthlyRevenue * 12;     document.getElementById('monthlyRevenue').textContent = dollar(monthlyRevenue);
    document.getElementById('netIncome').textContent = dollar(netIncome);
    document.getElementById('annualRevenue').textContent = dollar(annualRevenue);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['washers', 'dryers', 'turnsPerDay', 'washPrice', 'dryPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
