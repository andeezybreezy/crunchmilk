(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var oilPrice = parseFloat(document.getElementById('oilPrice').value) || 0;

    // Calculation logic
    var countries = [{name:'Saudi Arabia',breakeven:80},{name:'Russia',breakeven:55},{name:'UAE',breakeven:60},{name:'Iraq',breakeven:70},{name:'Iran',breakeven:90},{name:'Nigeria',breakeven:85},{name:'Venezuela',breakeven:120},{name:'Kuwait',breakeven:50},{name:'Qatar',breakeven:45},{name:'Libya',breakeven:95},{name:'Algeria',breakeven:100},{name:'Norway',breakeven:30},{name:'US Shale',breakeven:48},{name:'Canada Oil Sands',breakeven:55}]; var lines = countries.map(function(c) { var surplus = oilPrice >= c.breakeven; var diff = oilPrice - c.breakeven; return c.name + ': $' + c.breakeven + '/bbl — ' + (surplus ? 'SURPLUS (+$' + diff + ')' : 'DEFICIT (-$' + Math.abs(diff) + ')'); });     document.getElementById('results').textContent = lines.join(' | ');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['oilPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
