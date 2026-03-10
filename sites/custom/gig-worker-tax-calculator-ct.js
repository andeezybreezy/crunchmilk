(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function fmtDollars(n) {
    var sign = n < 0 ? '-' : '';
    return sign + '$' + fmt(Math.abs(n), 0).replace(/\..*/, '');
  }

  var grossIncome = document.getElementById('grossIncome');
  var expenses = document.getElementById('expenses');
  var filingStatus = document.getElementById('filingStatus');
  var otherIncome = document.getElementById('otherIncome');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['$30,000', '$4,238', '$1,028', '$5,266', '17.6%'],
    ['$50,000', '$7,065', '$3,258', '$10,323', '20.6%'],
    ['$75,000', '$10,597', '$6,638', '$17,235', '23.0%'],
    ['$100,000', '$14,130', '$10,607', '$24,737', '24.7%'],
    ['$125,000', '$17,662', '$15,230', '$32,892', '26.3%'],
    ['$150,000', '$20,458', '$20,120', '$40,578', '27.1%']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td><td>' + row[4] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getVal(el) {
    var v = parseFloat(el.value);
    return isNaN(v) ? 0 : v;
  }

  // 2024 tax brackets
  var brackets = {
    single: [
      { limit: 11600, rate: 0.10 },
      { limit: 47150, rate: 0.12 },
      { limit: 100525, rate: 0.22 },
      { limit: 191950, rate: 0.24 },
      { limit: 243725, rate: 0.32 },
      { limit: 609350, rate: 0.35 },
      { limit: Infinity, rate: 0.37 }
    ],
    married: [
      { limit: 23200, rate: 0.10 },
      { limit: 94300, rate: 0.12 },
      { limit: 201050, rate: 0.22 },
      { limit: 383900, rate: 0.24 },
      { limit: 487450, rate: 0.32 },
      { limit: 731200, rate: 0.35 },
      { limit: Infinity, rate: 0.37 }
    ],
    hoh: [
      { limit: 16550, rate: 0.10 },
      { limit: 63100, rate: 0.12 },
      { limit: 100500, rate: 0.22 },
      { limit: 191950, rate: 0.24 },
      { limit: 243700, rate: 0.32 },
      { limit: 609350, rate: 0.35 },
      { limit: Infinity, rate: 0.37 }
    ]
  };

  var stdDeduction = { single: 14600, married: 29200, hoh: 21900 };

  function calcIncomeTax(taxableIncome, status) {
    var brk = brackets[status];
    var tax = 0;
    var prev = 0;
    for (var i = 0; i < brk.length; i++) {
      var upper = brk[i].limit;
      var rate = brk[i].rate;
      if (taxableIncome <= prev) break;
      var chunk = Math.min(taxableIncome, upper) - prev;
      tax += chunk * rate;
      prev = upper;
    }
    return Math.max(tax, 0);
  }

  function calculate() {
    var gross = getVal(grossIncome);
    var exp = getVal(expenses);
    var status = filingStatus.value;
    var w2 = getVal(otherIncome);

    if (gross <= 0) return;

    var netEarnings = gross - exp;
    var seBase = netEarnings * 0.9235;
    var ssTaxCap = 168600;

    // SE tax
    var ssTax = Math.min(seBase, ssTaxCap) * 0.124;
    var medicareTax = seBase * 0.029;
    var additionalMedicare = seBase > 200000 ? (seBase - 200000) * 0.009 : 0;
    var seTax = ssTax + medicareTax + additionalMedicare;

    // Income tax
    var seDeduction = seTax / 2;
    var agi = netEarnings + w2 - seDeduction;
    var deduction = stdDeduction[status];
    var taxableIncome = Math.max(agi - deduction, 0);
    var incomeTax = calcIncomeTax(taxableIncome, status);

    // If there's W-2 income, approximate that some income tax is already withheld
    // We calculate total tax on combined income
    var totalTax = seTax + incomeTax;
    var effectiveRate = gross > 0 ? (totalTax / gross) * 100 : 0;
    var quarterly = totalTax / 4;

    // W-2 equivalent: account for employer FICA (7.65%) and benefits (~$7,500/yr)
    var employerFICA = netEarnings * 0.0765;
    var benefitsValue = 7500;
    var w2Equivalent = netEarnings - employerFICA - benefitsValue;

    document.getElementById('rSETax').textContent = fmtDollars(seTax);
    document.getElementById('rIncomeTax').textContent = fmtDollars(incomeTax);
    document.getElementById('rTotalTax').textContent = fmtDollars(totalTax);
    document.getElementById('rTotalTax').style.color = '#dc2626';
    document.getElementById('rEffRate').textContent = fmt(effectiveRate, 1) + '%';
    document.getElementById('rQuarterly').textContent = fmtDollars(quarterly);
    document.getElementById('rW2Equiv').textContent = fmtDollars(w2Equivalent);

    var takeHome = netEarnings - totalTax;

    var d = '';
    d += '<div style="padding:12px;background:#eff6ff;border-radius:8px;font-size:0.9rem;margin-bottom:12px">';
    d += '<strong>Tax Breakdown</strong><br>';
    d += 'Net self-employment income: ' + fmtDollars(netEarnings) + '<br>';
    d += 'SE tax base (92.35%): ' + fmtDollars(seBase) + '<br>';
    d += 'Social Security (12.4%): ' + fmtDollars(ssTax) + '<br>';
    d += 'Medicare (2.9%): ' + fmtDollars(medicareTax) + '<br>';
    if (additionalMedicare > 0) d += 'Additional Medicare (0.9%): ' + fmtDollars(additionalMedicare) + '<br>';
    d += 'Half-SE deduction: -' + fmtDollars(seDeduction) + '<br>';
    d += 'Standard deduction: -' + fmtDollars(deduction) + '<br>';
    d += 'Taxable income: ' + fmtDollars(taxableIncome) + '<br>';
    d += '</div>';

    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.9rem">';
    d += '<div style="padding:12px;background:#f0fdf4;border-radius:8px">';
    d += '<strong>Take-Home</strong><br>';
    d += 'After taxes: <strong style="color:#059669">' + fmtDollars(takeHome) + '</strong><br>';
    d += 'Monthly: ' + fmtDollars(takeHome / 12);
    d += '</div>';
    d += '<div style="padding:12px;background:#fefce8;border-radius:8px">';
    d += '<strong>Quarterly Payments</strong><br>';
    d += 'Q1 (Apr 15): ' + fmtDollars(quarterly) + '<br>';
    d += 'Q2 (Jun 15): ' + fmtDollars(quarterly) + '<br>';
    d += 'Q3 (Sep 15): ' + fmtDollars(quarterly) + '<br>';
    d += 'Q4 (Jan 15): ' + fmtDollars(quarterly);
    d += '</div>';
    d += '</div>';

    d += '<div style="margin-top:12px;padding:12px;background:#f5f3ff;border-radius:8px;font-size:0.9rem">';
    d += '<strong>W-2 Comparison</strong><br>';
    d += 'Your ' + fmtDollars(gross) + ' gross 1099 income nets ' + fmtDollars(takeHome) + ' after taxes.<br>';
    d += 'An equivalent W-2 salary would be approximately <strong>' + fmtDollars(w2Equivalent) + '</strong>, ';
    d += 'accounting for employer-paid FICA and typical benefits.';
    d += '</div>';

    document.getElementById('resultDetails').innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  var inputs = [grossIncome, expenses, filingStatus, otherIncome];
  inputs.forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
