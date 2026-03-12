(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var immigrantType = document.getElementById('immigrantType').value;
    var numImmigrants = parseFloat(document.getElementById('numImmigrants').value) || 0;
    var avgWage = parseFloat(document.getElementById('avgWage').value) || 0;
    var yearsInUS = parseFloat(document.getElementById('yearsInUS').value) || 0;
    var stateServiceCost = parseFloat(document.getElementById('stateServiceCost').value) || 0;

    // Calculation logic
    var taxRates = {highskill: 0.28, legal: 0.18, undocumented: 0.12, refugee: 0.10}; var serviceUse = {highskill: 0.5, legal: 0.8, undocumented: 0.6, refugee: 1.2}; var gdpMult = {highskill: 2.5, legal: 1.8, undocumented: 1.5, refugee: 1.3}; var jobMult = {highskill: 1.83, legal: 1.2, undocumented: 0.8, refugee: 0.6}; var taxRate = taxRates[immigrantType] || 0.18; var svcMult = serviceUse[immigrantType] || 0.8; var gMult = gdpMult[immigrantType] || 1.8; var jMult = jobMult[immigrantType] || 1.2; var annualTax = avgWage * taxRate * numImmigrants; var totalTax = annualTax * yearsInUS; var annualSvc = stateServiceCost * svcMult * numImmigrants; var totalSvc = annualSvc * yearsInUS; var netFiscal = totalTax - totalSvc; var gdpOutput = avgWage * gMult * numImmigrants * yearsInUS; var jobs = Math.round(numImmigrants * jMult); var perCapita = netFiscal / numImmigrants; document.getElementById('taxContribution').textContent = dollar(totalTax) + ' over ' + yearsInUS + ' years'; document.getElementById('serviceCost').textContent = dollar(totalSvc) + ' over ' + yearsInUS + ' years'; document.getElementById('netFiscal').textContent = (netFiscal >= 0 ? '+' : '') + dollar(netFiscal); document.getElementById('economicOutput').textContent = dollar(gdpOutput) + ' GDP contribution'; document.getElementById('perCapitaImpact').textContent = (perCapita >= 0 ? '+' : '') + dollar(perCapita) + '/immigrant'; document.getElementById('jobCreation').textContent = fmt(jobs, 0) + ' jobs created/supported';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['immigrantType', 'numImmigrants', 'avgWage', 'yearsInUS', 'stateServiceCost'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
