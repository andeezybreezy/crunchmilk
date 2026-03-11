(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var gripKg = parseFloat(document.getElementById('gripKg').value) || 0;
    var hand = document.getElementById('hand').value;
    var age = parseFloat(document.getElementById('age').value) || 0;
    var gender = document.getElementById('gender').value;

    // Calculation logic
    var lbs = Math.round(gripKg * 2.205); var avg = gender === 'male' ? (age < 30 ? 47 : age < 40 ? 47 : age < 50 ? 45 : age < 60 ? 41 : age < 70 ? 36 : 30) : (age < 30 ? 29 : age < 40 ? 28 : age < 50 ? 27 : age < 60 ? 24 : age < 70 ? 21 : 18); if (hand === 'nondominant') avg = avg * 0.9; var ratio = gripKg / avg; var pctile = 50; if (ratio >= 1.4) pctile = 95; else if (ratio >= 1.2) pctile = 80 + Math.round((ratio - 1.2) * 75); else if (ratio >= 1.0) pctile = 50 + Math.round((ratio - 1.0) * 150); else if (ratio >= 0.8) pctile = 20 + Math.round((ratio - 0.8) * 150); else pctile = Math.max(1, Math.round(ratio * 25)); pctile = Math.max(1, Math.min(99, pctile)); var ratingText = pctile >= 90 ? 'Excellent' : pctile >= 70 ? 'Above Average' : pctile >= 40 ? 'Average' : pctile >= 20 ? 'Below Average' : 'Needs Improvement'; document.getElementById('gripLbs').textContent = lbs + ' lbs (' + fmt(gripKg, 1) + ' kg)'; document.getElementById('rating').textContent = ratingText; document.getElementById('percentile').textContent = pctile + 'th percentile'; document.getElementById('avgForAge').textContent = fmt(avg, 0) + ' kg';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['gripKg', 'hand', 'age', 'gender'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
