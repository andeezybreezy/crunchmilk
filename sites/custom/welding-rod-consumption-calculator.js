(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var jointLength = parseFloat(document.getElementById('jointLength').value) || 0;
    var rodLength = parseFloat(document.getElementById('rodLength').value) || 0;
    var passes = parseFloat(document.getElementById('passes').value) || 0;

    // Calculation logic
    var deposition = rodLength * 0.6; var rodsNeeded = Math.ceil((jointLength * passes) / deposition); var totalWeight = rodsNeeded * 0.12;     document.getElementById('rodsNeeded').textContent = fmt(rodsNeeded,0);
    document.getElementById('totalWeight').textContent = fmt(totalWeight,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['jointLength', 'rodLength', 'passes'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
