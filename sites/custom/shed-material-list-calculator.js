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
    var height = parseFloat(document.getElementById('height').value) || 0;

    // Calculation logic
    var sqft = length * width; var perimeter = 2 * (length + width); var studs = Math.ceil(perimeter / 1.33) + 8; var wallArea = perimeter * height; var floorSheets = Math.ceil(sqft / 32); var wallSheets = Math.ceil(wallArea / 32); var roofSheets = Math.ceil(sqft * 1.15 / 32); var plywood = floorSheets + wallSheets + roofSheets; return {studs: fmt(studs,0), plywood: fmt(plywood,0), sqft: fmt(sqft,0)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'width', 'height'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
