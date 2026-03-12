(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var originalValue = parseFloat(document.getElementById('originalValue').value) || 0;
    var newValue = parseFloat(document.getElementById('newValue').value) || 0;

    // Calculation logic
    var ov=parseFloat(originalValue),nv=parseFloat(newValue);if(ov===0){document.getElementById('percentChange').textContent='Error: original value cannot be zero';return;}var diff=nv-ov;var pct=(diff/Math.abs(ov))*100;document.getElementById('percentChange').textContent=fmt(Math.abs(pct),2)+'%';document.getElementById('difference').textContent=fmt(diff, 2);document.getElementById('direction').textContent=diff>0?'Increase ↑':diff<0?'Decrease ↓':'No change';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['originalValue', 'newValue'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
