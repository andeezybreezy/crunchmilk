(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var knownValue = parseFloat(document.getElementById('knownValue').value) || 0;
    var knownType = document.getElementById('knownType').value;

    // Calculation logic
    var v=parseFloat(knownValue);var r;if(knownType==='radius'){r=v;}else if(knownType==='diameter'){r=v/2;}else if(knownType==='circumference'){r=v/(2*Math.PI);}else if(knownType==='area'){r=Math.sqrt(v/Math.PI);}if(r<0){document.getElementById('radius').textContent='Error: value must be positive';return;}document.getElementById('radius').textContent=fmt(r,6);document.getElementById('diameter').textContent=fmt(2*r,6);document.getElementById('circumference').textContent=fmt(2*Math.PI*r,6);document.getElementById('area').textContent=fmt(Math.PI*r*r,6)+' square units';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['knownValue', 'knownType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
