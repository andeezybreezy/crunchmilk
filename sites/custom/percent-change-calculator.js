(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var originalValue = parseFloat(document.getElementById('originalValue').value) || 0;
    var newValue = parseFloat(document.getElementById('newValue').value) || 0;

    // Calculation logic
    var ov=parseFloat(originalValue),nv=parseFloat(newValue);if(ov===0){document.getElementById('percentChange').textContent='Error: original value cannot be zero';return;}var diff=nv-ov;var pct=(diff/Math.abs(ov))*100;document.getElementById('percentChange').textContent=fmt(Math.abs(pct),2)+'%';document.getElementById('difference').textContent=fmt(diff,4);document.getElementById('direction').textContent=diff>0?'Increase ↑':diff<0?'Decrease ↓':'No change';

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
