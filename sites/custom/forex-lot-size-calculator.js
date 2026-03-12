(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var balance = parseFloat(document.getElementById('balance').value) || 0;
    var riskPct = parseFloat(document.getElementById('riskPct').value) || 0;
    var stopPips = parseFloat(document.getElementById('stopPips').value) || 0;
    var pipValue = parseFloat(document.getElementById('pipValue').value) || 0;

    // Calculation logic
    var riskDollar=balance*(riskPct/100); var lotSize=riskDollar/(stopPips*pipValue); var units=Math.floor(lotSize*100000); var microLots=Math.round(lotSize*100);     document.getElementById('riskDollar').textContent = dollar(riskDollar);
    document.getElementById('lotSize').textContent = fmt(lotSize,2)+' lots';
    document.getElementById('units').textContent = fmt(units,0)+' units';
    document.getElementById('microLots').textContent = microLots+' micro lots';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['balance', 'riskPct', 'stopPips', 'pipValue'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
