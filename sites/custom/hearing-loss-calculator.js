(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var noiseLevel = parseFloat(document.getElementById('noiseLevel').value) || 0;
    var hoursPerDay = parseFloat(document.getElementById('hoursPerDay').value) || 0;
    var daysPerWeek = parseFloat(document.getElementById('daysPerWeek').value) || 0;
    var yearsExposure = parseFloat(document.getElementById('yearsExposure').value) || 0;
    var hearingProtection = document.getElementById('hearingProtection').value;

    // Calculation logic
    var nrr = parseInt(hearingProtection);
    var effective = noiseLevel - (nrr > 0 ? (nrr - 7) * 0.5 : 0);
    var allowable = 8 / Math.pow(2, (effective - 85) / 3);
    var dose = (hoursPerDay / allowable) * 100;
    var lifetimeDose = dose * daysPerWeek * 52 * yearsExposure / 100;
    var risk;
    if (dose <= 50) risk = 'Low risk — within safe limits';
    else if (dose <= 100) risk = 'Moderate risk — near the limit';
    else if (dose <= 200) risk = 'High risk — exceeds safe limits, hearing damage likely over time';
    else risk = 'Very high risk — immediate hearing damage possible';
    document.getElementById('effectiveNoise').textContent = fmt(effective, 0) + ' dB (after protection)';
    document.getElementById('allowableTime').textContent = allowable >= 24 ? 'No time limit (safe)' : fmt(allowable, 1) + ' hours/day max';
    document.getElementById('dosePercent').textContent = fmt(dose, 0) + '% of daily limit';
    document.getElementById('riskLevel').textContent = risk;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['noiseLevel', 'hoursPerDay', 'daysPerWeek', 'yearsExposure', 'hearingProtection'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
