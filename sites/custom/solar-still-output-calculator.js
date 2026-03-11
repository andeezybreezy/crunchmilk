(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var diameter = parseFloat(document.getElementById('diameter').value) || 0;
    var sunHours = parseFloat(document.getElementById('sunHours').value) || 0;
    var soilMoisture = document.getElementById('soilMoisture').value;
    var numStills = parseFloat(document.getElementById('numStills').value) || 0;

    // Calculation logic
    var radius = diameter / 2; var areaSqIn = Math.PI * radius * radius; var areaSqFt = areaSqIn / 144; var factors = {dry: 0.04, medium: 0.08, moist: 0.14, vegetation: 0.18}; var factor = factors[soilMoisture] || 0.08; var perStillOz = areaSqFt * sunHours * factor * 8; var totalOz = perStillOz * numStills; var quarts = totalOz / 32; var people = totalOz / 64; document.getElementById('areaFt').textContent = fmt(areaSqFt, 2) + ' sq ft'; document.getElementById('perStill').textContent = fmt(perStillOz, 1) + ' oz/day'; document.getElementById('totalOutput').textContent = fmt(totalOz, 1) + ' oz (' + fmt(quarts, 1) + ' qt)'; document.getElementById('peopleSupported').textContent = fmt(people, 1) + ' people (supplemental)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['diameter', 'sunHours', 'soilMoisture', 'numStills'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
