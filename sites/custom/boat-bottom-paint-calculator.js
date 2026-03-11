(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var loa = parseFloat(document.getElementById('loa').value) || 0;
    var beam = parseFloat(document.getElementById('beam').value) || 0;
    var draft = parseFloat(document.getElementById('draft').value) || 0;
    var coats = parseFloat(document.getElementById('coats').value) || 0;

    // Calculation logic
    var area = loa * (beam + draft) * 0.85; var totalArea = area * coats; var gal = totalArea / 400; document.getElementById('hullArea').textContent = fmt(area, 0) + ' sq ft'; document.getElementById('gallons').textContent = fmt(gal, 1) + ' gallons'; document.getElementById('estCost').textContent = dollar(gal * 180); document.getElementById('resultTip').textContent = 'Coverage assumes 400 sq ft/gallon. Apply 2 coats minimum for full-season protection.';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['loa', 'beam', 'draft', 'coats'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
