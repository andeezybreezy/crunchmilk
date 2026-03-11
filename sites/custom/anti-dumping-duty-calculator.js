(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var exportPrice = parseFloat(document.getElementById('exportPrice').value) || 0;
    var fairValue = parseFloat(document.getElementById('fairValue').value) || 0;
    var quantity = parseFloat(document.getElementById('quantity').value) || 0;

    // Calculation logic
    var dumpingMargin = Math.max(((fairValue - exportPrice) / exportPrice) * 100, 0); var dutyPerUnit = Math.max(fairValue - exportPrice, 0); var totalDuty = dutyPerUnit * quantity;     document.getElementById('dumpingMargin').textContent = fmt(dumpingMargin,1);
    document.getElementById('dutyPerUnit').textContent = dollar(dutyPerUnit);
    document.getElementById('totalDuty').textContent = dollar(totalDuty);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['exportPrice', 'fairValue', 'quantity'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
