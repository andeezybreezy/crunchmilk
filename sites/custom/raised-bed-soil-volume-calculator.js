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

    // Calculation logic
    var cubicFeet = length * width * (depth / 12); var cubicYards = cubicFeet / 27; var bags = Math.ceil(cubicFeet / 2);     document.getElementById('cubicFeet').textContent = fmt(cubicFeet,1);
    document.getElementById('cubicYards').textContent = fmt(cubicYards,2);
    document.getElementById('bags').textContent = fmt(bags,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'width', 'depth'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
