(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var debt = parseFloat(document.getElementById('debt').value) || 0;
    var gdp = parseFloat(document.getElementById('gdp').value) || 0;
    var debtGrowth = parseFloat(document.getElementById('debtGrowth').value) || 0;
    var gdpGrowth = parseFloat(document.getElementById('gdpGrowth').value) || 0;
    var yearsForward = parseFloat(document.getElementById('yearsForward').value) || 0;

    // Calculation logic
    var currentRatio=(debt/gdp)*100; var futureDebt=debt*Math.pow(1+debtGrowth/100,yearsForward); var futureGDP=gdp*Math.pow(1+gdpGrowth/100,yearsForward); var futureRatio=(futureDebt/futureGDP)*100; var riskLevel=futureRatio>200?'Critical — Default/Crisis Risk':futureRatio>150?'High — Debt Spiral Likely':futureRatio>100?'Elevated — Sustainability Concerns':'Manageable';     document.getElementById('currentRatio').textContent = fmt(currentRatio,1)+'%';
    document.getElementById('futureDebt').textContent = '$'+fmt(futureDebt,1)+'T';
    document.getElementById('futureGDP').textContent = '$'+fmt(futureGDP,1)+'T';
    document.getElementById('futureRatio').textContent = fmt(futureRatio,1)+'%';
    document.getElementById('riskLevel').textContent = riskLevel;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['debt', 'gdp', 'debtGrowth', 'gdpGrowth', 'yearsForward'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
