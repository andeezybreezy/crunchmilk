(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var amount = parseFloat(document.getElementById('amount').value) || 0;
    var apy = parseFloat(document.getElementById('apy').value) || 0;
    var months = parseFloat(document.getElementById('months').value) || 0;
    var compounding = document.getElementById('compounding').value;

    // Calculation logic
    var years=months/12; var n=compounding==='daily'?365:compounding==='monthly'?12:1; var futureValue; if(compounding==='none'){futureValue=amount*(1+(apy/100)*years);}else{futureValue=amount*Math.pow(1+(apy/100)/n,n*years);} var earnings=futureValue-amount; var monthlyIncome=earnings/months; var dailyIncome=earnings/(months*30);     document.getElementById('futureValue').textContent = dollar(futureValue);
    document.getElementById('earnings').textContent = dollar(earnings);
    document.getElementById('monthlyIncome').textContent = dollar(monthlyIncome)+'/month';
    document.getElementById('dailyIncome').textContent = dollar(dailyIncome)+'/day';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['amount', 'apy', 'months', 'compounding'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
