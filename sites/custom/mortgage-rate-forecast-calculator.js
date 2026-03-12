(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var currentRate = parseFloat(document.getElementById('currentRate').value) || 0;
    var fedDirection = document.getElementById('fedDirection').value;
    var inflationTrend = document.getElementById('inflationTrend').value;
    var loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
    var loanTerm = parseFloat(document.getElementById('loanTerm').value) || 0;
    var forecastMonths = parseFloat(document.getElementById('forecastMonths').value) || 0;

    // Calculation logic
    var fedImpact = {cut3: -0.75, cut1: -0.25, hold: 0, hike1: 0.25, hike3: 0.75}; var inflImpact = {falling: -0.5, target: -0.15, elevated: 0.2, high: 0.6}; var rateShift = fedImpact[fedDirection] + inflImpact[inflationTrend]; var spreadAdjust = (forecastMonths / 12) * 0.1 * (rateShift > 0 ? 1 : -1); var projRate = Math.max(2.5, currentRate + rateShift + spreadAdjust); var monthlyRate1 = currentRate / 100 / 12; var monthlyRate2 = projRate / 100 / 12; var n = loanTerm * 12; var pmt1 = loanAmount * (monthlyRate1 * Math.pow(1 + monthlyRate1, n)) / (Math.pow(1 + monthlyRate1, n) - 1); var pmt2 = loanAmount * (monthlyRate2 * Math.pow(1 + monthlyRate2, n)) / (Math.pow(1 + monthlyRate2, n) - 1); var totalDiff = (pmt2 - pmt1) * n; var rec = rateShift < -0.3 ? 'Wait — rates likely falling' : rateShift > 0.3 ? 'Lock now — rates likely rising' : 'Neutral — rate timing uncertain'; document.getElementById('projectedRate').textContent = fmt(projRate, 3) + '%'; document.getElementById('currentPayment').textContent = dollar(pmt1); document.getElementById('projectedPayment').textContent = dollar(pmt2); document.getElementById('paymentDiff').textContent = (pmt2 >= pmt1 ? '+' : '') + dollar(pmt2 - pmt1) + '/mo'; document.getElementById('totalCostDiff').textContent = (totalDiff >= 0 ? '+' : '') + dollar(totalDiff) + ' over loan life'; document.getElementById('recommendation').textContent = rec;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['currentRate', 'fedDirection', 'inflationTrend', 'loanAmount', 'loanTerm', 'forecastMonths'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
