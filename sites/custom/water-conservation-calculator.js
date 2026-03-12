(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var showerMin = parseFloat(document.getElementById('showerMin').value) || 0;
    var flushes = parseFloat(document.getElementById('flushes').value) || 0;
    var laundryLoads = parseFloat(document.getElementById('laundryLoads').value) || 0;
    var lawnMin = parseFloat(document.getElementById('lawnMin').value) || 0;

    // Calculation logic
    var showerGal = showerMin * 2.5 * 30; var flushGal = flushes * 3.5 * 30; var laundryGal = laundryLoads * 30 * 4.33; var lawnGal = lawnMin * 12 * 4.33; var currentGal = showerGal + flushGal + laundryGal + lawnGal; var efficientShower = showerMin * 1.5 * 30; var efficientFlush = flushes * 1.6 * 30; var efficientLaundry = laundryLoads * 15 * 4.33; var efficientLawn = lawnMin * 8 * 4.33; var efficientTotal = efficientShower + efficientFlush + efficientLaundry + efficientLawn; var savingsGal = currentGal - efficientTotal; var savingsCost = savingsGal * 0.005;     document.getElementById('currentGal').textContent = fmt(currentGal,0);
    document.getElementById('savingsGal').textContent = fmt(savingsGal,0);
    document.getElementById('savingsCost').textContent = dollar(savingsCost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['showerMin', 'flushes', 'laundryLoads', 'lawnMin'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
