(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var nozzle = parseFloat(document.getElementById('nozzle').value) || 0;
    var quality = document.getElementById('quality').value;

    // Calculation logic
    var maxLayer = nozzle * 0.75; var qualityMult = {'Draft (fast)': 0.75, 'Standard': 0.5, 'High Detail': 0.35, 'Ultra Fine': 0.2}; var mult = qualityMult[quality] || 0.5; var layerHeight = nozzle * mult;     document.getElementById('layerHeight').textContent = fmt(layerHeight,2);
    document.getElementById('maxLayer').textContent = fmt(maxLayer,2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['nozzle', 'quality'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
