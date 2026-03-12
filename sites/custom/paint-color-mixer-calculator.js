(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var totalGallons = parseFloat(document.getElementById('totalGallons').value) || 0;
    var color1Pct = parseFloat(document.getElementById('color1Pct').value) || 0;
    var color2Pct = parseFloat(document.getElementById('color2Pct').value) || 0;

    // Calculation logic
    var total = color1Pct + color2Pct; var base = totalGallons * (color1Pct / total); var tint = totalGallons * (color2Pct / total); var baseOz = base * 128; var tintOz = tint * 128;     document.getElementById('base').textContent = fmt(base,2);
    document.getElementById('tint').textContent = fmt(tint,2);
    document.getElementById('baseOz').textContent = fmt(baseOz,0);
    document.getElementById('tintOz').textContent = fmt(tintOz,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['totalGallons', 'color1Pct', 'color2Pct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
