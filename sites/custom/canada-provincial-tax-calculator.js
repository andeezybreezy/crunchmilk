(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var taxableIncome = parseFloat(document.getElementById('taxableIncome').value) || 0;
    var province = document.getElementById('province').value;
    var rrspDeduction = parseFloat(document.getElementById('rrspDeduction').value) || 0;
    var eligibleDividends = parseFloat(document.getElementById('eligibleDividends').value) || 0;

    // Calculation logic
    var income = taxableIncome - rrspDeduction;
    var fedBrackets = [{limit: 55867, rate: 0.15}, {limit: 111733 - 55867, rate: 0.205}, {limit: 154906 - 111733, rate: 0.26}, {limit: 220000 - 154906, rate: 0.29}, {limit: Infinity, rate: 0.33}];
    var provBrackets = {
      AB: [{limit: 142292, rate: 0.10}, {limit: 170751 - 142292, rate: 0.12}, {limit: 227668 - 170751, rate: 0.13}, {limit: 341502 - 227668, rate: 0.14}, {limit: Infinity, rate: 0.15}],
      BC: [{limit: 45654, rate: 0.0506}, {limit: 91310 - 45654, rate: 0.077}, {limit: 104835 - 91310, rate: 0.105}, {limit: 127299 - 104835, rate: 0.1229}, {limit: 172602 - 127299, rate: 0.147}, {limit: 240716 - 172602, rate: 0.168}, {limit: Infinity, rate: 0.205}],
      MB: [{limit: 36842, rate: 0.108}, {limit: 79625 - 36842, rate: 0.1275}, {limit: Infinity, rate: 0.174}],
      NB: [{limit: 47715, rate: 0.094}, {limit: 95431 - 47715, rate: 0.14}, {limit: 176756 - 95431, rate: 0.16}, {limit: Infinity, rate: 0.195}],
      NL: [{limit: 41457, rate: 0.087}, {limit: 82913 - 41457, rate: 0.145}, {limit: 148027 - 82913, rate: 0.158}, {limit: 207239 - 148027, rate: 0.178}, {limit: 264750 - 207239, rate: 0.198}, {limit: 529500 - 264750, rate: 0.208}, {limit: 1059000 - 529500, rate: 0.213}, {limit: Infinity, rate: 0.218}],
      NS: [{limit: 29590, rate: 0.0879}, {limit: 59180 - 29590, rate: 0.1495}, {limit: 93000 - 59180, rate: 0.1667}, {limit: 150000 - 93000, rate: 0.175}, {limit: Infinity, rate: 0.21}],
      ON: [{limit: 51446, rate: 0.0505}, {limit: 102894 - 51446, rate: 0.0915}, {limit: 150000 - 102894, rate: 0.1116}, {limit: 220000 - 150000, rate: 0.1216}, {limit: Infinity, rate: 0.1316}],
      PE: [{limit: 31984, rate: 0.098}, {limit: 63969 - 31984, rate: 0.138}, {limit: Infinity, rate: 0.167}],
      QC: [{limit: 51780, rate: 0.14}, {limit: 103545 - 51780, rate: 0.19}, {limit: 126000 - 103545, rate: 0.24}, {limit: Infinity, rate: 0.2575}],
      SK: [{limit: 49720, rate: 0.105}, {limit: 142058 - 49720, rate: 0.125}, {limit: Infinity, rate: 0.145}]
    };
    function calcBrackets(inc, brackets) {
      var tax = 0; var rem = inc;
      for (var i = 0; i < brackets.length && rem > 0; i++) {
        var chunk = Math.min(rem, brackets[i].limit);
        tax += chunk * brackets[i].rate;
        rem -= chunk;
      }
      return tax;
    }
    var fedBPA = 15705;
    var fedTaxable = Math.max(0, income - fedBPA);
    var fedTax = calcBrackets(income, fedBrackets);
    var fedCredit = Math.min(income, fedBPA) * 0.15;
    fedTax = Math.max(0, fedTax - fedCredit);
    var provTax = calcBrackets(income, provBrackets[province] || provBrackets['ON']);
    var provBPA = {AB: 21003, BC: 11981, MB: 15000, NB: 12458, NL: 10382, NS: 8481, ON: 11865, PE: 12000, QC: 17183, SK: 17661};
    var pBPA = provBPA[province] || 11000;
    var pCreditRate = (provBrackets[province] || provBrackets['ON'])[0].rate;
    provTax = Math.max(0, provTax - pBPA * pCreditRate);
    var totalTaxVal = fedTax + provTax;
    var margRate = 0;
    var rem2 = income;
    for (var j = 0; j < fedBrackets.length; j++) { if (rem2 <= fedBrackets[j].limit) { margRate = fedBrackets[j].rate; break; } rem2 -= fedBrackets[j].limit; }
    var rem3 = income; var pBracks = provBrackets[province] || provBrackets['ON'];
    for (var k = 0; k < pBracks.length; k++) { if (rem3 <= pBracks[k].limit) { margRate += pBracks[k].rate; break; } rem3 -= pBracks[k].limit; }
    var effRate = taxableIncome > 0 ? (totalTaxVal / taxableIncome * 100) : 0;
    var afterTax = taxableIncome - totalTaxVal;
    document.getElementById('federalTax').textContent = '$' + fedTax.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('provincialTax').textContent = '$' + provTax.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('totalTax').textContent = '$' + totalTaxVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('marginalRate').textContent = (margRate * 100).toFixed(2) + '%';
    document.getElementById('effectiveRate').textContent = effRate.toFixed(2) + '%';
    document.getElementById('afterTaxIncome').textContent = '$' + afterTax.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['taxableIncome', 'province', 'rrspDeduction', 'eligibleDividends'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
