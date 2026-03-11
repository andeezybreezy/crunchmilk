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
    var thickness = parseFloat(document.getElementById('thickness').value) || 0;
    var pricePerYard = parseFloat(document.getElementById('pricePerYard').value) || 0;

    // Calculation logic
    var cubicFeet = length * width * (thickness / 12); var cubicYards = cubicFeet / 27 * 1.1; var bags80 = Math.ceil(cubicFeet / 0.6); var cost = cubicYards * pricePerYard;     document.getElementById('cubicYards').textContent = fmt(cubicYards,2);
    document.getElementById('bags80').textContent = fmt(bags80,0);
    document.getElementById('cost').textContent = dollar(cost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'width', 'thickness', 'pricePerYard'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
