(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var area = parseFloat(document.getElementById('area').value) || 0;
    var coverage = parseFloat(document.getElementById('coverage').value) || 0;
    var coats = parseFloat(document.getElementById('coats').value) || 0;
    var priceGal = parseFloat(document.getElementById('priceGal').value) || 0;

    // Calculation logic
    var gallons = Math.ceil((area * coats) / coverage); var totalCost = gallons * priceGal;     document.getElementById('gallons').textContent = fmt(gallons,0);
    document.getElementById('totalCost').textContent = dollar(totalCost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['area', 'coverage', 'coats', 'priceGal'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
