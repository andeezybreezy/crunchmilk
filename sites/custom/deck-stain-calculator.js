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
    var railing = document.getElementById('railing').value;
    var coats = parseFloat(document.getElementById('coats').value) || 0;

    // Calculation logic
    var floorArea = length * width; var railingArea = railing === 'Yes' ? 2 * (length + width) * 3 * 0.5 : 0; var area = floorArea + railingArea; var gallons = Math.ceil(area * coats / 250); var cost = gallons * 40; return {area: fmt(area,0), gallons: fmt(gallons,0), cost: dollar(cost)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'width', 'railing', 'coats'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
