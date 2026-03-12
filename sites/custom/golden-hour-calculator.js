(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var latitude = parseFloat(document.getElementById('latitude').value) || 0;
    var month = document.getElementById('month').value;

    // Calculation logic
    var monthIdx = ['January','February','March','April','May','June','July','August','September','October','November','December'].indexOf(month); var absLat = Math.abs(latitude); var baseDuration = 30; var latBonus = absLat * 0.3; var seasonMod = Math.abs(monthIdx - 5.5) <= 3 ? 5 : -5; if (absLat > 50) seasonMod *= 2; var duration = baseDuration + latBonus + seasonMod; var quality = absLat > 35 ? 'Rich warm tones' : 'Bright golden light';     document.getElementById('duration').textContent = fmt(Math.max(duration, 15),0);
    document.getElementById('quality').textContent = quality;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['latitude', 'month'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
