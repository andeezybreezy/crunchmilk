(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var bedrooms = parseFloat(document.getElementById('bedrooms').value) || 0;
    var occupants = parseFloat(document.getElementById('occupants').value) || 0;
    var waterUse = document.getElementById('waterUse').value;

    // Calculation logic
    var base = Math.max(bedrooms, 3) * 250 + 500; var usageMult = {'Low (conservation fixtures)': 0.85, 'Average': 1, 'High (large tubs, many loads)': 1.2}; var tankGallons = Math.ceil(base * (usageMult[waterUse] || 1) / 250) * 250; var dailyFlow = occupants * 75; var drainField = dailyFlow * 3; var pumpFrequency = occupants <= 2 ? 5 : occupants <= 4 ? 3 : 2;     document.getElementById('tankGallons').textContent = fmt(tankGallons,0);
    document.getElementById('drainField').textContent = fmt(drainField,0);
    document.getElementById('pumpFrequency').textContent = fmt(pumpFrequency,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['bedrooms', 'occupants', 'waterUse'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
