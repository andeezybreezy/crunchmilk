(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var roomLength = parseFloat(document.getElementById('roomLength').value) || 0;
    var roomWidth = parseFloat(document.getElementById('roomWidth').value) || 0;
    var ceilingHeight = parseFloat(document.getElementById('ceilingHeight').value) || 0;
    var doors = parseFloat(document.getElementById('doors').value) || 0;
    var windows = parseFloat(document.getElementById('windows').value) || 0;
    var coats = document.getElementById('coats').value;

    // Calculation logic
    var perimeter = 2 * (roomLength + roomWidth); var totalWall = perimeter * ceilingHeight; var doorArea = doors * 21; var windowArea = windows * 15; var paintable = totalWall - doorArea - windowArea; paintable = Math.max(paintable, 0); var numCoats = parseInt(coats); var totalCoverage = paintable * numCoats; var gallonsNeeded = totalCoverage / 350; var gallonsRounded = Math.ceil(gallonsNeeded * 4) / 4; var quartsNeeded = Math.ceil(gallonsNeeded * 4); var costLow = gallonsRounded * 30; var costHigh = gallonsRounded * 55; document.getElementById('wallArea').textContent = fmt(totalWall, 0) + ' sq ft'; document.getElementById('paintableArea').textContent = fmt(paintable, 0) + ' sq ft (minus doors/windows)'; document.getElementById('gallons').textContent = fmt(gallonsRounded, 2) + ' gallons (' + numCoats + ' coat' + (numCoats > 1 ? 's' : '') + ')'; document.getElementById('quarts').textContent = gallonsRounded < 1 ? quartsNeeded + ' quarts may be more economical' : 'N/A — buy gallons for best value'; document.getElementById('costEconomy').textContent = dollar(costLow); document.getElementById('costPremium').textContent = dollar(costHigh); document.getElementById('coveragePerCoat').textContent = fmt(paintable, 0) + ' sq ft per coat';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['roomLength', 'roomWidth', 'ceilingHeight', 'doors', 'windows', 'coats'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
