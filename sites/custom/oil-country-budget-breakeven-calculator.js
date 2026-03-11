(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var oilPrice = parseFloat(document.getElementById('oilPrice').value) || 0;

    // Calculation logic
    var countries = [{name:'Saudi Arabia',breakeven:80},{name:'Russia',breakeven:55},{name:'UAE',breakeven:60},{name:'Iraq',breakeven:70},{name:'Iran',breakeven:90},{name:'Nigeria',breakeven:85},{name:'Venezuela',breakeven:120},{name:'Kuwait',breakeven:50},{name:'Qatar',breakeven:45},{name:'Libya',breakeven:95},{name:'Algeria',breakeven:100},{name:'Norway',breakeven:30},{name:'US Shale',breakeven:48},{name:'Canada Oil Sands',breakeven:55}]; var lines = countries.map(function(c) { var surplus = v.oilPrice >= c.breakeven; var diff = v.oilPrice - c.breakeven; return c.name + ': $' + c.breakeven + '/bbl — ' + (surplus ? 'SURPLUS (+$' + diff + ')' : 'DEFICIT (-$' + Math.abs(diff) + ')'); }); return {results: lines.join(' | ')};

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
