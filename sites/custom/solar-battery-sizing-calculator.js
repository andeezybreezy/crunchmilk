(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var dailyUsage = parseFloat(document.getElementById('dailyUsage').value) || 0;
    var backupDays = parseFloat(document.getElementById('backupDays').value) || 0;
    var depthOfDischarge = parseFloat(document.getElementById('depthOfDischarge').value) || 0;
    var batteryVoltage = document.getElementById('batteryVoltage').value;
    var batteryType = document.getElementById('batteryType').value;

    // Calculation logic
    var usableKwh = dailyUsage * backupDays; var totalKwh = usableKwh / (depthOfDischarge / 100); var voltMap = {'12V': 12, '24V': 24, '48V': 48}; var volts = voltMap[batteryVoltage] || 48; var ampHours = (totalKwh * 1000) / volts; var costPerKwh = {'Lithium (LFP)': 400, 'Lead-Acid (AGM)': 250, 'Lead-Acid (Flooded)': 150}; var estimatedCost = totalKwh * (costPerKwh[batteryType] || 400); return {totalKwh: fmt(totalKwh, 1), usableKwh: fmt(usableKwh, 1), ampHours: fmt(ampHours, 0), estimatedCost: dollar(estimatedCost)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['dailyUsage', 'backupDays', 'depthOfDischarge', 'batteryVoltage', 'batteryType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
