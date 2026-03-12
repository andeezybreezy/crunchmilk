(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var grossIncome = parseFloat(document.getElementById('grossIncome').value) || 0;
    var bizExpenses = parseFloat(document.getElementById('bizExpenses').value) || 0;
    var filingStatus = document.getElementById('filingStatus').value;
    var scorpSalaryPct = parseFloat(document.getElementById('scorpSalaryPct').value) || 0;
    var stateIncomeTaxRate = parseFloat(document.getElementById('stateIncomeTaxRate').value) || 0;

    // Calculation logic
    var netIncome = grossIncome - bizExpenses; var seTaxRate = 0.153; var seTaxableIncome = netIncome * 0.9235; var seTax = Math.min(seTaxableIncome, 168600) * 0.153 + Math.max(0, seTaxableIncome - 168600) * 0.029; var seDeduction = seTax / 2; var brackets; if (filingStatus === 'married') { brackets = [[22000, 0.10], [89450, 0.12], [190750, 0.22], [364200, 0.24], [462500, 0.32], [693750, 0.35], [Infinity, 0.37]]; } else { brackets = [[11000, 0.10], [44725, 0.12], [95375, 0.22], [182100, 0.24], [231250, 0.32], [578125, 0.35], [Infinity, 0.37]]; } var stdDeduction = filingStatus === 'married' ? 27700 : 13850; function calcFedTax(taxableIncome) { var tax = 0; var prev = 0; for (var b = 0; b < brackets.length; b++) { var bracketTop = brackets[b][0]; var rate = brackets[b][1]; var bracketIncome = Math.min(taxableIncome, bracketTop) - prev; if (bracketIncome <= 0) break; tax += bracketIncome * rate; prev = bracketTop; } return tax; } var qbiDeduction = Math.min(netIncome * 0.20, (filingStatus === 'married' ? 364200 : 182100) * 0.20); var soleTaxableIncome = Math.max(0, netIncome - seDeduction - stdDeduction - qbiDeduction); var soleFedTax = calcFedTax(soleTaxableIncome); var soleStateTax = netIncome * (stateIncomeTaxRate / 100); var soleTotalTax = soleFedTax + seTax + soleStateTax; var llcTotalTax = soleTotalTax; var scorpSalary = netIncome * (scorpSalaryPct / 100); var scorpDistribution = netIncome - scorpSalary; var scorpPayrollTax = scorpSalary * 0.153; var scorpSeDeduction = scorpPayrollTax / 2; var scorpQbi = Math.min(scorpDistribution * 0.20, qbiDeduction); var scorpTaxableIncome = Math.max(0, netIncome - scorpSeDeduction - stdDeduction - scorpQbi); var scorpFedTax = calcFedTax(scorpTaxableIncome); var scorpStateTax = netIncome * (stateIncomeTaxRate / 100); var scorpTotal = scorpFedTax + scorpPayrollTax + scorpStateTax; var savings = soleTotalTax - scorpTotal; var soleFiling = 200; var llcFiling = 500; var scorpFiling = 1500; var best = 'Sole Proprietorship'; if (netIncome > 40000 && netIncome <= 80000) best = 'LLC'; if (netIncome > 80000) best = 'S-Corp'; var scorpNetSavings = savings - (scorpFiling - soleFiling); if (scorpNetSavings < 0 && netIncome > 40000) best = 'LLC'; document.getElementById('solePropTax').textContent = '$' + soleTotalTax.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('llcTax').textContent = '$' + llcTotalTax.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' (same as Sole Prop)'; document.getElementById('scorpTax').textContent = '$' + scorpTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('soleSETax').textContent = '$' + seTax.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('scorpSETax').textContent = '$' + scorpPayrollTax.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('scorpSavings').textContent = savings > 0 ? '$' + savings.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '/yr' : 'No savings'; document.getElementById('annualFilingCost').textContent = 'Sole: $' + soleFiling + ' | LLC: $' + llcFiling + ' | S-Corp: $' + scorpFiling; document.getElementById('bestStructure').textContent = best;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['grossIncome', 'bizExpenses', 'filingStatus', 'scorpSalaryPct', 'stateIncomeTaxRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
