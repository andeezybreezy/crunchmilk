(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var imgWidth = parseFloat(document.getElementById('imgWidth').value) || 0;
    var imgHeight = parseFloat(document.getElementById('imgHeight').value) || 0;
    var viewDist = parseFloat(document.getElementById('viewDist').value) || 0;
    var pricePerSqFt = parseFloat(document.getElementById('pricePerSqFt').value) || 0;

    // Calculation logic
    var w300 = imgWidth / 300;
    var h300 = imgHeight / 300;
    var w150 = imgWidth / 150;
    var h150 = imgHeight / 150;
    var recDPI = Math.max(72, Math.round(3438 / (viewDist * 12)));
    var wRec = imgWidth / recDPI;
    var hRec = imgHeight / recDPI;
    var sqft = (wRec * hRec) / 144;
    var cost = sqft * pricePerSqFt;
    document.getElementById('maxSize300').textContent = fmt(w300, 1) + '" × ' + fmt(h300, 1) + '"';
    document.getElementById('maxSize150').textContent = fmt(w150, 1) + '" × ' + fmt(h150, 1) + '"';
    document.getElementById('recommendedDPI').textContent = recDPI + ' DPI (at ' + viewDist + 'ft → ' + fmt(wRec, 1) + '" × ' + fmt(hRec, 1) + '")';
    document.getElementById('printCost').textContent = dollar(cost) + ' (' + fmt(sqft, 1) + ' sq ft)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['imgWidth', 'imgHeight', 'viewDist', 'pricePerSqFt'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
