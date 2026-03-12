(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var gdpGrowth = parseFloat(document.getElementById('gdpGrowth').value) || 0;
    var expectedGDP = parseFloat(document.getElementById('expectedGDP').value) || 0;
    var annualIncome = parseFloat(document.getElementById('annualIncome').value) || 0;
    var investmentBalance = parseFloat(document.getElementById('investmentBalance').value) || 0;
    var jobSector = document.getElementById('jobSector').value;

    // Calculation logic
    var surprise = gdpGrowth - expectedGDP; var sectorMult = {tech: 1.5, finance: 1.3, manufacturing: 1.2, services: 1.0, government: 0.5, healthcare: 0.3}; var mult = sectorMult[jobSector] || 1.0; var impliedWageGrowth = gdpGrowth * 0.6 * mult; var incomeChange = annualIncome * (impliedWageGrowth / 100); var stockReaction = surprise * 2; var investChange = investmentBalance * (stockReaction / 100); var jobOutlook = gdpGrowth > 3 ? 'Strong hiring environment — good time for raises/job switching' : gdpGrowth > 1.5 ? 'Stable employment — moderate hiring' : gdpGrowth > 0 ? 'Slow growth — limited new hiring, hold steady' : 'Contraction — layoff risk increasing, build emergency fund'; var inflationSignal = gdpGrowth > 3.5 ? 'Hot economy — inflation risk elevated, Fed may hike' : gdpGrowth > 2 ? 'Goldilocks — growth with manageable inflation' : gdpGrowth > 0 ? 'Cooling — inflation should ease, rate cuts possible' : 'Deflationary risk — Fed will likely cut aggressively'; var bigPicture = gdpGrowth > 3 ? 'Economy expanding strongly — opportunities but watch for overheating' : gdpGrowth > 1.5 ? 'Healthy sustainable growth — no major concerns' : gdpGrowth > 0 ? 'Below-trend growth — caution warranted' : 'Economic contraction — recession likely, defensive positioning wise'; document.getElementById('gdpSurprise').textContent = (surprise >= 0 ? '+' : '') + fmt(surprise, 1) + '% vs expectations (' + (surprise > 0 ? 'stronger' : surprise < 0 ? 'weaker' : 'in-line') + ')'; document.getElementById('incomeImpact').textContent = (incomeChange >= 0 ? '+' : '') + dollar(incomeChange) + '/year implied wage growth'; document.getElementById('jobOutlook').textContent = jobOutlook; document.getElementById('investmentImpact').textContent = (investChange >= 0 ? '+' : '') + dollar(investChange) + ' estimated market reaction'; document.getElementById('inflationSignal').textContent = inflationSignal; document.getElementById('bigPicture').textContent = bigPicture;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['gdpGrowth', 'expectedGDP', 'annualIncome', 'investmentBalance', 'jobSector'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
