(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var amount = parseFloat(document.getElementById('amount').value) || 0;
    var method = document.getElementById('method').value;
    var midMarketRate = parseFloat(document.getElementById('midMarketRate').value) || 0;

    // Calculation logic
    var feeRates = {'Airport Kiosk': 0.10, 'Bank (pre-trip)': 0.03, 'ATM Abroad': 0.02, 'Credit Card (no foreign fee)': 0.005, 'Credit Card (3% fee)': 0.035, 'Hotel Exchange': 0.12}; var feeRate = feeRates[method] || 0.05; var atmFee = method === 'ATM Abroad' ? 5 : 0; var totalFees = (amount * feeRate) + atmFee; var netAmount = amount - totalFees; var effectiveRate = midMarketRate * (1 - feeRate); var youReceive = netAmount * midMarketRate; var costPer100 = (totalFees / amount) * 100; return {effectiveRate: fmt(effectiveRate, 4), youReceive: fmt(youReceive, 2), totalFees: dollar(totalFees), costPer100: dollar(costPer100)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['amount', 'method', 'midMarketRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
