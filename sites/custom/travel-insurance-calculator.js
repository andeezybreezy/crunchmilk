(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var tripCost = parseFloat(document.getElementById('tripCost').value) || 0;
    var duration = parseFloat(document.getElementById('duration').value) || 0;
    var age = parseFloat(document.getElementById('age').value) || 0;
    var coverage = document.getElementById('coverage').value;

    // Calculation logic
    var baseRate = coverage === 'basic' ? 0.04 : (coverage === 'comprehensive' ? 0.07 : 0.12);
    var ageMultiplier = age < 35 ? 0.85 : (age < 50 ? 1.0 : (age < 65 ? 1.4 : 2.0));
    var durationMultiplier = duration > 30 ? 1.3 : (duration > 14 ? 1.1 : 1.0);
    var premium = tripCost * baseRate * ageMultiplier * durationMultiplier;
    premium = Math.max(premium, 25);
    var costPct = (premium / tripCost) * 100;
    var medical = coverage === 'basic' ? 'Not included' : (coverage === 'comprehensive' ? dollar(50000) + ' - ' + dollar(100000) : dollar(100000) + ' - ' + dollar(250000));
    document.getElementById('premium').textContent = dollar(premium);
    document.getElementById('costPct').textContent = fmt(costPct, 1) + '% of trip cost';
    document.getElementById('medicalCoverage').textContent = medical;
    document.getElementById('cancellationCoverage').textContent = coverage === 'premium' ? '75% of trip cost (any reason)' : '100% of trip cost (covered reasons)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['tripCost', 'duration', 'age', 'coverage'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
