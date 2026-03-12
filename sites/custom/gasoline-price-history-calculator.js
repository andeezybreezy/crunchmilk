(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var era = document.getElementById('era').value;
    var currentGas = parseFloat(document.getElementById('currentGas').value) || 0;

    // Calculation logic
    var eras = {'1973': {price: 0.39, adjusted: 2.75, oil: 12, cause: 'Arab OPEC embargo against US/allies'}, '1979': {price: 0.86, adjusted: 3.90, oil: 40, cause: 'Iranian Revolution + Iran-Iraq War'}, '1990': {price: 1.35, adjusted: 3.20, oil: 41, cause: 'Iraq invades Kuwait, Gulf War'}, '2005': {price: 3.07, adjusted: 4.85, oil: 70, cause: 'Hurricane Katrina destroyed Gulf refineries'}, '2008': {price: 4.11, adjusted: 5.95, oil: 147, cause: 'Speculation + China demand + peak oil fears'}, '2011': {price: 3.53, adjusted: 4.90, oil: 113, cause: 'Arab Spring disrupted Libya/Egypt supply'}, '2022': {price: 5.02, adjusted: 5.40, oil: 120, cause: 'Russia-Ukraine war + sanctions'}}; var e = eras[era]; var diff = e.adjusted - currentGas; var comp = diff > 0 ? 'That crisis was $' + diff.toFixed(2) + ' MORE than today' : 'Today is $' + Math.abs(diff).toFixed(2) + ' MORE than that crisis';     document.getElementById('historicalPrice').textContent = '$' + e.price.toFixed(2) + '/gal';
    document.getElementById('adjustedPrice').textContent = '$' + e.adjusted.toFixed(2) + '/gal (today\'s dollars)';
    document.getElementById('comparison').textContent = comp;
    document.getElementById('oilAtTime').textContent = '$' + e.oil + '/barrel';
    document.getElementById('cause').textContent = e.cause;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['era', 'currentGas'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
