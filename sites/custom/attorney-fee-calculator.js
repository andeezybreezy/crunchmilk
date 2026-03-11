(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var hourlyRate = parseFloat(document.getElementById('hourlyRate').value) || 0;
    var estHours = parseFloat(document.getElementById('estHours').value) || 0;
    var retainer = parseFloat(document.getElementById('retainer').value) || 0;

    // Calculation logic
    var total = hourlyRate * estHours; var after = Math.max(0, total - retainer); document.getElementById('totalFees').textContent = dollar(total); document.getElementById('afterRetainer').textContent = dollar(after); document.getElementById('perMonth').textContent = dollar(total / 6) + '/month';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['hourlyRate', 'estHours', 'retainer'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
