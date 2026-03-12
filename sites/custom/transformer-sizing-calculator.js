(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var voltage = parseFloat(document.getElementById('voltage').value) || 0;
    var amperage = parseFloat(document.getElementById('amperage').value) || 0;
    var phase = document.getElementById('phase').value;
    var safetyFactor = parseFloat(document.getElementById('safetyFactor').value) || 0;

    // Calculation logic
    var kva;
    if (phase === '1') { kva = (voltage * amperage) / 1000; } else { kva = (voltage * amperage * 1.732) / 1000; }
    var kvaWithSafety = kva * safetyFactor;
    var stdSizes = [3,5,7.5,10,15,25,37.5,45,50,75,100,112.5,150,200,225,300,500,750,1000];
    var recommended = stdSizes[stdSizes.length - 1];
    for (var i = 0; i < stdSizes.length; i++) { if (stdSizes[i] >= kvaWithSafety) { recommended = stdSizes[i]; break; } }
    var maxA = phase === '1' ? (recommended * 1000) / voltage : (recommended * 1000) / (voltage * 1.732);
    document.getElementById('kva').textContent = fmt(kvaWithSafety, 1) + ' kVA (with ' + fmt(safetyFactor * 100, 0) + '% safety)';
    document.getElementById('kvaRounded').textContent = fmt(recommended, 1) + ' kVA transformer';
    document.getElementById('maxAmps').textContent = fmt(maxA, 1) + ' A';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['voltage', 'amperage', 'phase', 'safetyFactor'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
