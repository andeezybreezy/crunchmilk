(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var weight = parseFloat(document.getElementById('weight').value) || 0;
    var doseRate = parseFloat(document.getElementById('doseRate').value) || 0;
    var frequency = parseFloat(document.getElementById('frequency').value) || 0;
    var tabletMg = parseFloat(document.getElementById('tabletMg').value) || 0;

    // Calculation logic
    var dosePerAdmin = weight * doseRate; var tabletsPerDose = dosePerAdmin / tabletMg; var dailyDose = dosePerAdmin * frequency; return {dosePerAdmin: fmt(dosePerAdmin,1), tabletsPerDose: fmt(tabletsPerDose,1), dailyDose: fmt(dailyDose,1)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['weight', 'doseRate', 'frequency', 'tabletMg'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
