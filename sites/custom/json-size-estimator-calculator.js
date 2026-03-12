(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var records = parseFloat(document.getElementById('records').value) || 0;
    var fieldsPerRecord = parseFloat(document.getElementById('fieldsPerRecord').value) || 0;
    var avgFieldLength = parseFloat(document.getElementById('avgFieldLength').value) || 0;

    // Calculation logic
    var fieldOverhead = 15; var bytesPerRecord = fieldsPerRecord * (avgFieldLength + fieldOverhead); var totalBytes = records * bytesPerRecord + 100; var sizeKB = totalBytes / 1024; var sizeMB = sizeKB / 1024; var transferTime = (totalBytes * 8) / 10000000;     document.getElementById('sizeKB').textContent = fmt(sizeKB,1);
    document.getElementById('sizeMB').textContent = fmt(sizeMB,2);
    document.getElementById('transferTime').textContent = fmt(transferTime,2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['records', 'fieldsPerRecord', 'avgFieldLength'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
