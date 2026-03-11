(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var washers = parseFloat(document.getElementById('washers').value) || 0;
    var dryers = parseFloat(document.getElementById('dryers').value) || 0;
    var turnsPerDay = parseFloat(document.getElementById('turnsPerDay').value) || 0;
    var washPrice = parseFloat(document.getElementById('washPrice').value) || 0;
    var dryPrice = parseFloat(document.getElementById('dryPrice').value) || 0;

    // Calculation logic
    var dailyWash = washers * turnsPerDay * washPrice; var dailyDry = dryers * turnsPerDay * dryPrice; var monthlyRevenue = (dailyWash + dailyDry) * 30; var netIncome = monthlyRevenue * 0.35; var annualRevenue = monthlyRevenue * 12; return {monthlyRevenue: dollar(monthlyRevenue), netIncome: dollar(netIncome), annualRevenue: dollar(annualRevenue)};

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
