(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var length = parseFloat(document.getElementById('length').value) || 0;
    var width = parseFloat(document.getElementById('width').value) || 0;
    var pitch = document.getElementById('pitch').value;
    var layers = document.getElementById('layers').value;

    // Calculation logic
    var pitchFactors = {'4/12 (low)': 1.054, '6/12 (moderate)': 1.118, '8/12 (steep)': 1.202, '10/12 (steep)': 1.302, '12/12 (45°)': 1.414}; var factor = pitchFactors[pitch] || 1.118; var actualArea = length * width * factor; var squares = actualArea / 100 * 1.1; var bundles = Math.ceil(squares * 3); var underlayment = Math.ceil(actualArea / 400);     document.getElementById('squares').textContent = fmt(squares,1);
    document.getElementById('bundles').textContent = fmt(bundles,0);
    document.getElementById('underlayment').textContent = fmt(underlayment,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'width', 'pitch', 'layers'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
