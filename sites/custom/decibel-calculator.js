(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var mode = document.getElementById('mode').value;
    var val1 = parseFloat(document.getElementById('val1').value) || 0;
    var val2 = parseFloat(document.getElementById('val2').value) || 0;
    var distance = parseFloat(document.getElementById('distance').value) || 0;

    // Calculation logic
    var r1, r2, percept;
    if (mode === 'add') {
      var combined = 10 * Math.log10(Math.pow(10, val1/10) + Math.pow(10, val2/10));
      r1 = fmt(combined, 1) + ' dB combined';
      r2 = 'Difference: ' + fmt(Math.abs(val1 - val2), 1) + ' dB';
      var diff = combined - Math.max(val1, val2);
      percept = '+' + fmt(diff, 1) + ' dB over loudest source';
    } else if (mode === 'power') {
      var dbP = 10 * Math.log10(val1 / (val2 || 0.001));
      r1 = fmt(dbP, 2) + ' dB';
      r2 = fmt(val1, 3) + 'W vs ' + fmt(val2, 3) + 'W reference';
      percept = dbP >= 10 ? 'Perceived as ~' + fmt(Math.pow(2, dbP/10), 1) + '× louder' : 'Moderate difference';
    } else if (mode === 'voltage') {
      var dbV = 20 * Math.log10(val1 / (val2 || 0.001));
      r1 = fmt(dbV, 2) + ' dB';
      r2 = fmt(val1, 3) + 'V vs ' + fmt(val2, 3) + 'V reference';
      percept = 'Voltage ratio: ' + fmt(val1/val2, 2) + ':1';
    } else {
      var dbAtDist = val1 - 20 * Math.log10(distance / (val2 || 1));
      r1 = fmt(dbAtDist, 1) + ' dB at ' + fmt(distance, 1) + 'm';
      r2 = 'Source: ' + fmt(val1, 0) + ' dB at ' + fmt(val2, 1) + 'm';
      percept = 'Drops ' + fmt(val1 - dbAtDist, 1) + ' dB over distance';
    }
    document.getElementById('result1').textContent = r1;
    document.getElementById('result2').textContent = r2;
    document.getElementById('perception').textContent = percept;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['mode', 'val1', 'val2', 'distance'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
