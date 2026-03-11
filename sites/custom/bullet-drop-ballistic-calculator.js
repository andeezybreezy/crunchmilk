(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var velocity = parseFloat(document.getElementById('velocity').value) || 0;
    var bc = parseFloat(document.getElementById('bc').value) || 0;
    var distance = parseFloat(document.getElementById('distance').value) || 0;
    var zeroRange = parseFloat(document.getElementById('zeroRange').value) || 0;

    // Calculation logic
    var timeToTarget = distance / (velocity * (1 - (1-bc) * distance/3000)); var timeToZero = zeroRange / velocity; var drop = 0.5 * 386.09 * Math.pow(timeToTarget, 2) - 0.5 * 386.09 * Math.pow(timeToZero, 2) * (distance/zeroRange); var moa = Math.abs(drop) / (distance * 0.01047); var vel = velocity * Math.pow(bc, distance/1000) * (1 - distance*0.0002);     document.getElementById('drop').textContent = fmt(-Math.abs(drop * 0.08),1);
    document.getElementById('moa').textContent = fmt(moa * 0.3,1);
    document.getElementById('velocity_at_range').textContent = fmt(Math.max(vel,500),0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['velocity', 'bc', 'distance', 'zeroRange'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
