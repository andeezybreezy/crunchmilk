(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var grossIncome = parseFloat(document.getElementById('grossIncome').value) || 0;
    var taxCode = document.getElementById('taxCode').value;
    var pensionContrib = parseFloat(document.getElementById('pensionContrib').value) || 0;
    var giftAid = parseFloat(document.getElementById('giftAid').value) || 0;

    // Calculation logic
    var income = grossIncome - pensionContrib;
    var pa = 12570;
    if (taxCode === 'blind') pa += 2870;
    if (income > 100000) {
      pa = Math.max(0, pa - (income - 100000) / 2);
    }
    var taxableIncome = Math.max(0, income - pa);
    var tax = 0;
    if (taxCode === 'scottish') {
      var bands = [{limit: 2162, rate: 0.19}, {limit: 13118 - 2162, rate: 0.20}, {limit: 31092 - 13118, rate: 0.21}, {limit: 62430 - 31092, rate: 0.42}, {limit: 125140 - 62430, rate: 0.45}, {limit: Infinity, rate: 0.48}];
      var remaining = taxableIncome;
      for (var i = 0; i < bands.length && remaining > 0; i++) {
        var chunk = Math.min(remaining, bands[i].limit);
        tax += chunk * bands[i].rate;
        remaining -= chunk;
      }
    } else {
      var basicLimit = 37700;
      if (giftAid > 0) basicLimit += giftAid * 0.25;
      if (taxableIncome <= basicLimit) {
        tax = taxableIncome * 0.20;
      } else if (taxableIncome <= 125140) {
        tax = basicLimit * 0.20 + (taxableIncome - basicLimit) * 0.40;
      } else {
        tax = basicLimit * 0.20 + (125140 - basicLimit) * 0.40 + (taxableIncome - 125140) * 0.45;
      }
    }
    var effRate = grossIncome > 0 ? (tax / grossIncome * 100) : 0;
    var monthlyTaxVal = tax / 12;
    var takeHomeAnn = grossIncome - tax;
    var takeHomeMon = takeHomeAnn / 12;
    document.getElementById('personalAllowance').textContent = '\u00A3' + pa.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('totalIncomeTax').textContent = '\u00A3' + tax.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('effectiveTaxRate').textContent = effRate.toFixed(2) + '%';
    document.getElementById('monthlyTax').textContent = '\u00A3' + monthlyTaxVal.toFixed(2);
    document.getElementById('takeHomeAnnual').textContent = '\u00A3' + takeHomeAnn.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('takeHomeMonthly').textContent = '\u00A3' + takeHomeMon.toFixed(2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['grossIncome', 'taxCode', 'pensionContrib', 'giftAid'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
