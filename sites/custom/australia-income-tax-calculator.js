(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var taxableIncome = parseFloat(document.getElementById('taxableIncome').value) || 0;
    var residency = document.getElementById('residency').value;
    var privateHealth = document.getElementById('privateHealth').value;
    var helpDebt = document.getElementById('helpDebt').value;

    // Calculation logic
    var income = taxableIncome;
    var tax = 0;
    if (residency === 'resident') {
      if (income <= 18200) tax = 0;
      else if (income <= 45000) tax = (income - 18200) * 0.16;
      else if (income <= 135000) tax = 4288 + (income - 45000) * 0.30;
      else if (income <= 190000) tax = 31288 + (income - 135000) * 0.37;
      else tax = 51638 + (income - 190000) * 0.45;
    } else if (residency === 'nonResident') {
      if (income <= 135000) tax = income * 0.30;
      else if (income <= 190000) tax = 40500 + (income - 135000) * 0.37;
      else tax = 60850 + (income - 190000) * 0.45;
    } else {
      if (income <= 45000) tax = income * 0.15;
      else if (income <= 135000) tax = 6750 + (income - 45000) * 0.30;
      else if (income <= 190000) tax = 33750 + (income - 135000) * 0.37;
      else tax = 54100 + (income - 190000) * 0.45;
    }
    var medicare = 0;
    if (residency === 'resident') {
      if (income > 26000) medicare = income * 0.02;
      else if (income > 24276) medicare = (income - 24276) * 0.10;
    }
    var mls = 0;
    if (privateHealth === 'no' && residency === 'resident') {
      if (income > 93000 && income <= 108000) mls = income * 0.01;
      else if (income > 108000 && income <= 144000) mls = income * 0.0125;
      else if (income > 144000) mls = income * 0.015;
    }
    var help = 0;
    if (helpDebt === 'yes' && residency === 'resident') {
      if (income >= 54435 && income < 62850) help = income * 0.01;
      else if (income >= 62850 && income < 66620) help = income * 0.02;
      else if (income >= 66620 && income < 70618) help = income * 0.025;
      else if (income >= 70618 && income < 74855) help = income * 0.03;
      else if (income >= 74855 && income < 79346) help = income * 0.035;
      else if (income >= 79346 && income < 84107) help = income * 0.04;
      else if (income >= 84107 && income < 89154) help = income * 0.045;
      else if (income >= 89154 && income < 94503) help = income * 0.05;
      else if (income >= 94503 && income < 100174) help = income * 0.055;
      else if (income >= 100174 && income < 106185) help = income * 0.06;
      else if (income >= 106185 && income < 112556) help = income * 0.065;
      else if (income >= 112556 && income < 119310) help = income * 0.07;
      else if (income >= 119310 && income < 126467) help = income * 0.075;
      else if (income >= 126467 && income < 134056) help = income * 0.08;
      else if (income >= 134056 && income < 142100) help = income * 0.085;
      else if (income >= 142100 && income < 150626) help = income * 0.09;
      else if (income >= 150626 && income < 159663) help = income * 0.095;
      else if (income >= 159663) help = income * 0.10;
    }
    var totalTaxVal = tax + medicare + mls + help;
    var effRate = income > 0 ? (totalTaxVal / income * 100) : 0;
    var takeHomeVal = income - totalTaxVal;
    var monthlyVal = takeHomeVal / 12;
    document.getElementById('incomeTax').textContent = 'A$' + tax.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('medicareLevy').textContent = 'A$' + medicare.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('medicareSurcharge').textContent = mls > 0 ? 'A$' + mls.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'A$0';
    document.getElementById('helpRepayment').textContent = help > 0 ? 'A$' + help.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'A$0';
    document.getElementById('totalTax').textContent = 'A$' + totalTaxVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('effectiveRate').textContent = effRate.toFixed(2) + '%';
    document.getElementById('takeHome').textContent = 'A$' + takeHomeVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('monthlyTakeHome').textContent = 'A$' + monthlyVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['taxableIncome', 'residency', 'privateHealth', 'helpDebt'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
