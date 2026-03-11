(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var length = parseFloat(document.getElementById('length').value) || 0;
    var width = parseFloat(document.getElementById('width').value) || 0;
    var depth = parseFloat(document.getElementById('depth').value) || 0;
    var mixRatio = document.getElementById('mixRatio').value;

    // Calculation logic
    var cubicIn = length * width * depth; var totalOz = cubicIn * 0.554; var ratios = {'1:1': [0.5,0.5], '2:1': [0.667,0.333], '3:1': [0.75,0.25]}; var r = ratios[mixRatio] || [0.5,0.5]; var resinOz = totalOz * r[0] * 1.1; var hardenerOz = totalOz * r[1] * 1.1;     document.getElementById('totalOz').textContent = fmt(totalOz,1);
    document.getElementById('resinOz').textContent = fmt(resinOz,1);
    document.getElementById('hardenerOz').textContent = fmt(hardenerOz,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'width', 'depth', 'mixRatio'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
