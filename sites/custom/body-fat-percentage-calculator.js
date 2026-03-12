(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sex = document.getElementById('sex').value;
    var waist = parseFloat(document.getElementById('waist').value) || 0;
    var neck = parseFloat(document.getElementById('neck').value) || 0;
    var height = parseFloat(document.getElementById('height').value) || 0;
    var hip = parseFloat(document.getElementById('hip').value) || 0;

    // Calculation logic
    var bodyFat; if (sex === 'Male') { bodyFat = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76; } else { bodyFat = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387; } bodyFat = Math.max(bodyFat, 3); var category; if (sex === 'Male') { category = bodyFat < 6 ? 'Essential' : bodyFat < 14 ? 'Athletic' : bodyFat < 18 ? 'Fit' : bodyFat < 25 ? 'Average' : 'Above Average'; } else { category = bodyFat < 14 ? 'Essential' : bodyFat < 21 ? 'Athletic' : bodyFat < 25 ? 'Fit' : bodyFat < 32 ? 'Average' : 'Above Average'; }     document.getElementById('bodyFat').textContent = fmt(bodyFat,1);
    document.getElementById('category').textContent = category;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sex', 'waist', 'neck', 'height', 'hip'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
