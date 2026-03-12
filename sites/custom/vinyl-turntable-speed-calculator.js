(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var targetRpm = document.getElementById('targetRpm').value;
    var measuredRpm = parseFloat(document.getElementById('measuredRpm').value) || 0;

    // Calculation logic
    var target = parseFloat(targetRpm); var error = ((measuredRpm - target) / target) * 100; var pitchShift = error * 17.31; var status = Math.abs(error) < 0.5 ? 'Accurate' : Math.abs(error) < 1 ? 'Slightly off' : 'Needs adjustment';     document.getElementById('error').textContent = (error >= 0 ? '+' : '') + fmt(error,2);
    document.getElementById('pitchShift').textContent = (pitchShift >= 0 ? '+' : '') + fmt(pitchShift,1);
    document.getElementById('status').textContent = status;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['targetRpm', 'measuredRpm'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
