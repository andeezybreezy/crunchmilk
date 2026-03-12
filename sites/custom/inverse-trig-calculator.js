(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var trigFunction = document.getElementById('trigFunction').value;
    var value = parseFloat(document.getElementById('value').value) || 0;

    // Calculation logic
    var fn=document.getElementById('trigFunction').value; var val=parseFloat(document.getElementById('value').value); if(isNaN(val)){document.getElementById('angleDegrees').textContent='Enter a number';return;} var rad; if(fn==='arcsin'){if(val<-1||val>1){document.getElementById('angleDegrees').textContent='arcsin requires value between -1 and 1';return;} rad=Math.asin(val);} else if(fn==='arccos'){if(val<-1||val>1){document.getElementById('angleDegrees').textContent='arccos requires value between -1 and 1';return;} rad=Math.acos(val);} else {rad=Math.atan(val);} var deg=rad*180/Math.PI; document.getElementById('angleDegrees').textContent=fmt(deg,6)+'\u00B0'; document.getElementById('angleRadians').textContent=fmt(rad,6)+' rad';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['trigFunction', 'value'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
