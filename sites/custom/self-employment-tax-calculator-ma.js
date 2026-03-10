(function() {
  'use strict';

  var SS_RATE = 0.124;
  var MEDICARE_RATE = 0.029;
  var SE_FACTOR = 0.9235;
  var SS_CAP = 168600;
  var ADDL_MEDICARE_SINGLE = 200000;
  var ADDL_MEDICARE_MARRIED = 250000;
  var ADDL_MEDICARE_RATE = 0.009;

  // 2024 federal brackets (simplified)
  var brackets = {
    single: [
      [11600, 0.10], [47150, 0.12], [100525, 0.22],
      [191950, 0.24], [243725, 0.32], [609350, 0.35], [Infinity, 0.37]
    ],
    married: [
      [23200, 0.10], [94300, 0.12], [201050, 0.22],
      [383900, 0.24], [487450, 0.32], [731200, 0.35], [Infinity, 0.37]
    ],
    head: [
      [16550, 0.10], [63100, 0.12], [100500, 0.22],
      [191950, 0.24], [243725, 0.32], [609350, 0.35], [Infinity, 0.37]
    ]
  };

  var stdDeduction = { single: 14600, married: 29200, head: 21900 };

  function fmt(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function calcIncomeTax(taxableIncome, status) {
    var b = brackets[status];
    var tax = 0;
    var prev = 0;
    for (var i = 0; i < b.length; i++) {
      var limit = b[i][0];
      var rate = b[i][1];
      if (taxableIncome <= limit) {
        tax += (taxableIncome - prev) * rate;
        break;
      }
      tax += (limit - prev) * rate;
      prev = limit;
    }
    return Math.max(0, tax);
  }

  function calculate() {
    var netIncome = parseFloat(document.getElementById('netIncome').value) || 0;
    var status = document.getElementById('filingStatus').value;
    var w2 = parseFloat(document.getElementById('w2Income').value) || 0;

    if (netIncome <= 0) return;

    // SE tax calculation
    var taxableBase = netIncome * SE_FACTOR;
    var ssWages = Math.min(taxableBase + w2, SS_CAP);
    var ssBase = Math.max(0, ssWages - w2);
    var ssTax = ssBase * SS_RATE;
    var medicareTax = taxableBase * MEDICARE_RATE;

    // Additional Medicare tax
    var threshold = status === 'married' ? ADDL_MEDICARE_MARRIED : ADDL_MEDICARE_SINGLE;
    var addlMedicare = 0;
    if (taxableBase + w2 > threshold) {
      addlMedicare = Math.max(0, (taxableBase + w2) - threshold) * ADDL_MEDICARE_RATE;
      // Only on SE portion
      addlMedicare = Math.min(addlMedicare, taxableBase * ADDL_MEDICARE_RATE);
    }

    var seTax = ssTax + medicareTax + addlMedicare;

    // Income tax estimate
    var seDeduction = seTax / 2;
    var agi = netIncome + w2 - seDeduction;
    var taxableIncome = Math.max(0, agi - stdDeduction[status]);
    var incomeTax = calcIncomeTax(taxableIncome, status);

    var totalTax = seTax + incomeTax;
    var quarterly = totalTax / 4;
    var effectiveRate = ((totalTax / (netIncome + w2)) * 100);
    var seEffRate = ((seTax / netIncome) * 100);

    document.getElementById('seTax').textContent = fmt(seTax);
    document.getElementById('incomeTax').textContent = fmt(incomeTax);
    document.getElementById('totalTax').textContent = fmt(totalTax);
    document.getElementById('quarterly').textContent = fmt(quarterly);
    document.getElementById('effectiveRate').textContent = effectiveRate.toFixed(1) + '%';
    document.getElementById('seRate').textContent = seEffRate.toFixed(1) + '%';
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  // Enter key support
  var inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
