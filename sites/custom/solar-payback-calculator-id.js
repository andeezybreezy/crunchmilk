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

  var systemSize = document.getElementById('systemSize');
  var installCost = document.getElementById('installCost');
  var fedCredit = document.getElementById('fedCredit');
  var stateIncentive = document.getElementById('stateIncentive');
  var monthlyBill = document.getElementById('monthlyBill');
  var sunHours = document.getElementById('sunHours');
  var elecRate = document.getElementById('elecRate');
  var rateIncrease = document.getElementById('rateIncrease');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['1', '$0.15', '$1,752', '$1,752', '-$15,048'],
    ['5', '$0.17', '$1,972', '$9,268', '-$7,532'],
    ['10', '$0.20', '$2,287', '$20,488', '+$3,688'],
    ['15', '$0.23', '$2,651', '$33,638', '+$16,838'],
    ['20', '$0.27', '$3,073', '$49,024', '+$32,224'],
    ['25', '$0.31', '$3,562', '$67,001', '+$50,201']
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

  function calculate() {
    var size = getVal(systemSize);
    var cost = getVal(installCost);
    var fedPct = getVal(fedCredit) / 100;
    var stateInc = getVal(stateIncentive);
    var bill = getVal(monthlyBill);
    var sun = getVal(sunHours);
    var rate = getVal(elecRate);
    var rateInc = getVal(rateIncrease) / 100;

    if (size <= 0 || cost <= 0 || rate <= 0) return;

    var netCost = cost - (cost * fedPct) - stateInc;
    var annualProduction = size * sun * 365 * 0.80;
    var annualBill = bill * 12;

    var year1Savings = Math.min(annualProduction * rate, annualBill);
    var cumSavings = 0;
    var paybackYear = 0;
    var totalSavings25 = 0;

    for (var y = 1; y <= 25; y++) {
      var currentRate = rate * Math.pow(1 + rateInc, y - 1);
      var currentBill = annualBill * Math.pow(1 + rateInc, y - 1);
      var degradation = 1 - (0.005 * (y - 1));
      var yearProd = annualProduction * degradation;
      var yearSavings = Math.min(yearProd * currentRate, currentBill);
      cumSavings += yearSavings;
      totalSavings25 += yearSavings;
      if (paybackYear === 0 && cumSavings >= netCost) {
        paybackYear = y;
      }
    }

    var roi = ((totalSavings25 - netCost) / netCost) * 100;

    document.getElementById('rNetCost').textContent = fmtDollars(netCost);
    document.getElementById('rAnnualSavings').textContent = fmtDollars(year1Savings);
    document.getElementById('rPayback').textContent = paybackYear > 0 ? paybackYear + ' years' : '25+ years';
    document.getElementById('rPayback').style.color = paybackYear > 0 && paybackYear <= 10 ? '#059669' : '#d97706';
    document.getElementById('rLifetime').textContent = fmtDollars(totalSavings25);
    document.getElementById('rLifetime').style.color = '#059669';
    document.getElementById('rROI').textContent = fmt(roi, 0) + '%';
    document.getElementById('rROI').style.color = roi > 0 ? '#059669' : '#dc2626';
    document.getElementById('rProduction').textContent = fmt(annualProduction, 0) + ' kWh';

    var d = '';
    d += '<div style="padding:12px;background:#fffbeb;border-radius:8px;font-size:0.9rem;margin-bottom:12px">';
    d += '<strong>Cost Breakdown</strong><br>';
    d += 'Gross cost: ' + fmtDollars(cost) + '<br>';
    d += 'Federal credit (' + fmt(fedPct * 100, 0) + '%): -' + fmtDollars(cost * fedPct) + '<br>';
    if (stateInc > 0) d += 'State incentives: -' + fmtDollars(stateInc) + '<br>';
    d += '<strong>Net cost: ' + fmtDollars(netCost) + '</strong>';
    d += '</div>';

    d += '<div style="padding:12px;background:#f0fdf4;border-radius:8px;font-size:0.9rem">';
    d += '<strong>Production & Savings</strong><br>';
    d += 'Annual production: ' + fmt(annualProduction, 0) + ' kWh<br>';
    d += 'Monthly offset: ~' + fmt(annualProduction / 12, 0) + ' kWh (' + fmt(Math.min((annualProduction * rate / annualBill) * 100, 100), 0) + '% of bill)<br>';
    d += 'Year 1 savings: ' + fmtDollars(year1Savings) + '<br>';
    d += '25-year net profit: <strong style="color:#059669">' + fmtDollars(totalSavings25 - netCost) + '</strong>';
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

  var inputs = [systemSize, installCost, fedCredit, stateIncentive, monthlyBill, sunHours, elecRate, rateIncrease];
  inputs.forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
