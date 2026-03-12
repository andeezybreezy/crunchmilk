(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var depth = parseFloat(document.getElementById('depth').value) || 0;
    var freeboard = parseFloat(document.getElementById('freeboard').value) || 0;
    var scope = document.getElementById('scope').value;

    // Calculation logic
    var s = parseFloat(scope); var totalDepth = depth + freeboard; var rode = totalDepth * s; var chain = Math.max(totalDepth, rode * 0.15); document.getElementById('rodeLength').textContent = fmt(rode, 0) + ' ft'; document.getElementById('chainLength').textContent = fmt(chain, 0) + ' ft of chain'; document.getElementById('swingRadius').textContent = fmt(rode + 30, 0) + ' ft'; document.getElementById('resultTip').textContent = 'Always account for tidal changes — add expected tide rise to depth.';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['depth', 'freeboard', 'scope'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
