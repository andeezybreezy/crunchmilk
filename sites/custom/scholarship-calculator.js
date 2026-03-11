(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var tuition = parseFloat(document.getElementById('tuition').value) || 0;
    var room = parseFloat(document.getElementById('room').value) || 0;
    var scholarships = parseFloat(document.getElementById('scholarships').value) || 0;
    var fedAid = parseFloat(document.getElementById('fedAid').value) || 0;
    var years = parseFloat(document.getElementById('years').value) || 0;

    // Calculation logic
    var annual = tuition + room; var aid = scholarships + fedAid; var net = Math.max(0, annual - aid); var totalNet = net * years; var covPct = Math.min(100, (aid / annual) * 100); document.getElementById('annualNet').textContent = dollar(net); document.getElementById('totalNet').textContent = dollar(totalNet); document.getElementById('covered').textContent = pct(covPct); document.getElementById('gap').textContent = dollar(totalNet);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['tuition', 'room', 'scholarships', 'fedAid', 'years'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
