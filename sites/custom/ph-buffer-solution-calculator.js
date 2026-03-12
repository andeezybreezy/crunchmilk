(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var targetPH = parseFloat(document.getElementById('targetPH').value) || 0;
    var pKa = parseFloat(document.getElementById('pKa').value) || 0;
    var totalConc = parseFloat(document.getElementById('totalConc').value) || 0;
    var volume = parseFloat(document.getElementById('volume').value) || 0;

    // Calculation logic
    var ratio = Math.pow(10, targetPH - pKa); var totalMoles = totalConc * volume; var baseMoles = totalMoles * ratio / (1 + ratio); var acidMoles = totalMoles - baseMoles;     document.getElementById('ratio').textContent = fmt(ratio,2);
    document.getElementById('baseMoles').textContent = fmt(baseMoles,2);
    document.getElementById('acidMoles').textContent = fmt(acidMoles,2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['targetPH', 'pKa', 'totalConc', 'volume'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
