(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var acres = parseFloat(document.getElementById('acres').value) || 0;
    var cropET = parseFloat(document.getElementById('cropET').value) || 0;
    var rainfall = parseFloat(document.getElementById('rainfall').value) || 0;
    var efficiency = document.getElementById('efficiency').value;
    var waterCost = parseFloat(document.getElementById('waterCost').value) || 0;

    // Calculation logic
    var eff = parseFloat(efficiency); var net = Math.max(0, cropET - rainfall); var gross = net / eff; var acreFeet = (gross / 12) * acres; var gallons = acreFeet * 325851; var cost = acreFeet * waterCost; document.getElementById('netNeed').textContent = fmt(net, 1) + ' in/season'; document.getElementById('grossNeed').textContent = fmt(gross, 1) + ' in/season'; document.getElementById('totalGallons').textContent = fmt(gallons, 0) + ' gal'; document.getElementById('totalCost').textContent = dollar(cost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['acres', 'cropET', 'rainfall', 'efficiency', 'waterCost'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
