(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var bedX = parseFloat(document.getElementById('bedX').value) || 0;
    var bedY = parseFloat(document.getElementById('bedY').value) || 0;
    var bedZ = parseFloat(document.getElementById('bedZ').value) || 0;
    var margin = parseFloat(document.getElementById('margin').value) || 0;

    // Calculation logic
    var usableX = bedX - 2 * margin;
    var usableY = bedY - 2 * margin;
    var area = usableX * usableY;
    var totalVol = bedX * bedY * bedZ / 1000;
    var usableVol = usableX * usableY * bedZ / 1000;
    document.getElementById('usableArea').textContent = fmt(area, 0) + ' mm² (' + fmt(usableX, 0) + '×' + fmt(usableY, 0) + ')';
    document.getElementById('buildVolume').textContent = fmt(totalVol, 0) + ' cm³';
    document.getElementById('usableVolume').textContent = fmt(usableVol, 0) + ' cm³';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['bedX', 'bedY', 'bedZ', 'margin'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
