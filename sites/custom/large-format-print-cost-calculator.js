(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var widthIn = parseFloat(document.getElementById('widthIn').value) || 0;
    var heightIn = parseFloat(document.getElementById('heightIn').value) || 0;
    var quantity = parseFloat(document.getElementById('quantity').value) || 0;
    var sqftRate = parseFloat(document.getElementById('sqftRate').value) || 0;
    var finishing = document.getElementById('finishing').value;

    // Calculation logic
    var sf = (widthIn * heightIn) / 144; var fin = parseFloat(finishing); var perPrint = sf * (sqftRate + fin); var total = perPrint * quantity; var effRate = total / (sf * quantity); document.getElementById('sqft').textContent = fmt(sf, 2) + ' sq ft'; document.getElementById('costPerPrint').textContent = dollar(perPrint); document.getElementById('totalCost').textContent = dollar(total); document.getElementById('costPerSqFt').textContent = dollar(effRate) + '/sqft';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['widthIn', 'heightIn', 'quantity', 'sqftRate', 'finishing'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
