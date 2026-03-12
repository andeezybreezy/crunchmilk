(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var targetTorque = parseFloat(document.getElementById('targetTorque').value) || 0;
    var wrenchLength = parseFloat(document.getElementById('wrenchLength').value) || 0;
    var extLength = parseFloat(document.getElementById('extLength').value) || 0;

    // Calculation logic
    var effectiveLength = wrenchLength + extLength; var dialSetting = targetTorque * (wrenchLength / effectiveLength); var appliedForce = targetTorque * 12 / effectiveLength;     document.getElementById('dialSetting').textContent = fmt(dialSetting,1);
    document.getElementById('appliedForce').textContent = fmt(appliedForce,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['targetTorque', 'wrenchLength', 'extLength'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
