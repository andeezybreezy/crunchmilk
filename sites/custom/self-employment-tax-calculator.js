(function() {
  'use strict';

  var SS_RATE = 0.124;
  var MEDICARE_RATE = 0.029;
  var SE_FACTOR = 0.9235;
  var SS_CAP = 168600;
  var ADDL_MEDICARE_SINGLE = 200000;
  var ADDL_MEDICARE_MARRIED = 250000;
  var ADDL_MEDICARE_RATE = 0.009;

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

  var lastCalc = null;

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

  function calcTaxes(netIncome, status, w2) {
    if (netIncome <= 0) return { seTax: 0, incomeTax: 0, totalTax: 0 };
    var taxableBase = netIncome * SE_FACTOR;
    var ssWages = Math.min(taxableBase + w2, SS_CAP);
    var ssBase = Math.max(0, ssWages - w2);
    var ssTax = ssBase * SS_RATE;
    var medicareTax = taxableBase * MEDICARE_RATE;
    var threshold = status === 'married' ? ADDL_MEDICARE_MARRIED : ADDL_MEDICARE_SINGLE;
    var addlMedicare = 0;
    if (taxableBase + w2 > threshold) {
      addlMedicare = Math.max(0, (taxableBase + w2) - threshold) * ADDL_MEDICARE_RATE;
      addlMedicare = Math.min(addlMedicare, taxableBase * ADDL_MEDICARE_RATE);
    }
    var seTax = ssTax + medicareTax + addlMedicare;
    var seDeduction = seTax / 2;
    var agi = netIncome + w2 - seDeduction;
    var taxableIncome = Math.max(0, agi - stdDeduction[status]);
    var incomeTax = calcIncomeTax(taxableIncome, status);
    return { seTax: seTax, incomeTax: incomeTax, totalTax: seTax + incomeTax };
  }

  function calculate() {
    var netIncome = parseFloat(document.getElementById('netIncome').value) || 0;
    var status = document.getElementById('filingStatus').value;
    var w2 = parseFloat(document.getElementById('w2Income').value) || 0;

    if (netIncome <= 0) return;

    var result = calcTaxes(netIncome, status, w2);
    var quarterly = result.totalTax / 4;
    var effectiveRate = ((result.totalTax / (netIncome + w2)) * 100);
    var seEffRate = ((result.seTax / netIncome) * 100);

    document.getElementById('seTax').textContent = fmt(result.seTax);
    document.getElementById('incomeTax').textContent = fmt(result.incomeTax);
    document.getElementById('totalTax').textContent = fmt(result.totalTax);
    document.getElementById('quarterly').textContent = fmt(quarterly);
    document.getElementById('effectiveRate').textContent = effectiveRate.toFixed(1) + '%';
    document.getElementById('seRate').textContent = seEffRate.toFixed(1) + '%';
    document.getElementById('result').classList.add('visible');

    lastCalc = { netIncome: netIncome, status: status, w2: w2, totalTax: result.totalTax };
    document.getElementById('whatIfSection').style.display = 'block';
    updateWhatIf();
  }

  function updateWhatIf() {
    if (!lastCalc) return;
    var toggle = document.getElementById('whatIfToggle');
    if (!toggle.checked) return;

    var incomeChange = parseFloat(document.getElementById('wiIncome').value) || 0;
    var newIncome = lastCalc.netIncome + incomeChange;
    if (newIncome < 0) newIncome = 0;

    var wiResult = calcTaxes(newIncome, lastCalc.status, lastCalc.w2);
    var diff = wiResult.totalTax - lastCalc.totalTax;

    document.getElementById('wiOriginal').textContent = fmt(lastCalc.totalTax);
    document.getElementById('wiNew').textContent = fmt(wiResult.totalTax);
    document.getElementById('wiDelta').textContent = (diff >= 0 ? '+' : '-') + fmt(Math.abs(diff));
    document.getElementById('wiDelta').style.color = diff <= 0 ? '#059669' : '#dc2626';
    document.getElementById('wiQuarterly').textContent = fmt(wiResult.totalTax / 4);
  }

  var wiToggle = document.getElementById('whatIfToggle');
  if (wiToggle) {
    wiToggle.addEventListener('change', function() {
      document.getElementById('whatIfControls').style.display = this.checked ? 'block' : 'none';
      if (this.checked) updateWhatIf();
    });
  }
  var wiIncome = document.getElementById('wiIncome');
  if (wiIncome) {
    wiIncome.addEventListener('input', function() {
      var v = parseInt(this.value);
      document.getElementById('wiIncomeVal').textContent = (v >= 0 ? '+$' : '-$') + Math.abs(v).toLocaleString();
      updateWhatIf();
    });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
