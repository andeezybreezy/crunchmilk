(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var passYds = parseFloat(document.getElementById('passYds').value) || 0;
    var passTD = parseFloat(document.getElementById('passTD').value) || 0;
    var passInt = parseFloat(document.getElementById('passInt').value) || 0;
    var rushYds = parseFloat(document.getElementById('rushYds').value) || 0;
    var rushTD = parseFloat(document.getElementById('rushTD').value) || 0;
    var receptions = parseFloat(document.getElementById('receptions').value) || 0;
    var recYds = parseFloat(document.getElementById('recYds').value) || 0;
    var recTD = parseFloat(document.getElementById('recTD').value) || 0;

    // Calculation logic
    var std = (passYds * 0.04) + (passTD * 4) + (passInt * -2) + (rushYds * 0.1) + (rushTD * 6) + (recYds * 0.1) + (recTD * 6); var half = std + (receptions * 0.5); var full = std + (receptions * 1.0); document.getElementById('stdPts').textContent = fmt(std, 1) + ' pts'; document.getElementById('halfPpr').textContent = fmt(half, 1) + ' pts'; document.getElementById('fullPpr').textContent = fmt(full, 1) + ' pts';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['passYds', 'passTD', 'passInt', 'rushYds', 'rushTD', 'receptions', 'recYds', 'recTD'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
