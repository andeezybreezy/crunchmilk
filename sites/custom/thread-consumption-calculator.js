(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var seamLength = parseFloat(document.getElementById('seamLength').value) || 0;
    var seamType = document.getElementById('seamType').value;

    // Calculation logic
    var multipliers = {straight: 2.5, zigzag: 3.5, overlock: 4, topstitch: 2}; var mult = multipliers[seamType] || 2.5; var thread = seamLength * mult; var bobbin = seamType === 'overlock' ? 0 : thread * 0.6; var totalInches = thread + bobbin; var yards = totalInches / 36; var spools = Math.ceil(yards / 200); document.getElementById('threadNeeded').textContent = fmt(yards, 0) + ' yards (top thread)'; document.getElementById('bobbinThread').textContent = seamType === 'overlock' ? 'N/A (uses loopers)' : fmt(bobbin / 36, 0) + ' yards'; document.getElementById('spools').textContent = spools + ' spool(s) of 200yd';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['seamLength', 'seamType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
