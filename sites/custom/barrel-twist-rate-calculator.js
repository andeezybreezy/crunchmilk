(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var caliber = parseFloat(document.getElementById('caliber').value) || 0;
    var bulletLength = parseFloat(document.getElementById('bulletLength').value) || 0;
    var velocity = parseFloat(document.getElementById('velocity').value) || 0;

    // Calculation logic
    var twist = (150 * Math.pow(caliber, 2)) / bulletLength * Math.sqrt(2800/velocity); var standards = [7, 8, 9, 10, 12, 14, 16, 18, 20]; var nearest = standards.reduce(function(prev, curr) { return Math.abs(curr - twist) < Math.abs(prev - twist) ? curr : prev; });     document.getElementById('twist').textContent = '1:' + fmt(twist,1);
    document.getElementById('standard').textContent = '1:' + nearest;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['caliber', 'bulletLength', 'velocity'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
