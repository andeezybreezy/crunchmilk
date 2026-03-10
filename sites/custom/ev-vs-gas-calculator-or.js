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

  var annualMiles = document.getElementById('annualMiles');
  var gasPrice = document.getElementById('gasPrice');
  var carMPG = document.getElementById('carMPG');
  var gasCarPrice = document.getElementById('gasCarPrice');
  var elecRate = document.getElementById('elecRate');
  var evEfficiency = document.getElementById('evEfficiency');
  var evPrice = document.getElementById('evPrice');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['1', '$1,500', '$480', '$1,020', '8,400'],
    ['2', '$3,000', '$960', '$2,540', '16,800'],
    ['3', '$4,500', '$1,440', '$4,060', '25,200'],
    ['4', '$6,000', '$1,920', '$5,580', '33,600'],
    ['5', '$7,500', '$2,400', '$7,100', '42,000']
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
    var miles = getVal(annualMiles);
    var gp = getVal(gasPrice);
    var mpg = getVal(carMPG);
    var gprice = getVal(gasCarPrice);
    var er = getVal(elecRate);
    var eff = getVal(evEfficiency);
    var ep = getVal(evPrice);

    if (miles <= 0 || mpg <= 0 || eff <= 0) return;

    // Annual fuel costs
    var gasAnnual = (miles / mpg) * gp;
    var evAnnual = (miles / eff) * er;
    var fuelSavings = gasAnnual - evAnnual;

    // Maintenance savings (~$0.03/mi difference)
    var maintSavings = miles * 0.03;
    var totalAnnualSavings = fuelSavings + maintSavings;

    // 5-year total savings (fuel + maintenance)
    var fiveYearSavings = totalAnnualSavings * 5;

    // Break-even considering price difference
    var priceDiff = ep - gprice;
    var breakEvenYears = totalAnnualSavings > 0 ? priceDiff / totalAnnualSavings : Infinity;

    // CO2 savings: 19.6 lbs CO2 per gallon
    var gallonsUsed = miles / mpg;
    var co2Saved = gallonsUsed * 19.6;

    document.getElementById('rGasCost').textContent = fmtDollars(gasAnnual);
    document.getElementById('rEvCost').textContent = fmtDollars(evAnnual);
    document.getElementById('rEvCost').style.color = evAnnual < gasAnnual ? '#059669' : '';
    document.getElementById('rGasCost').style.color = gasAnnual < evAnnual ? '#059669' : '';
    document.getElementById('rSavings').textContent = fmtDollars(fiveYearSavings);
    document.getElementById('rSavings').style.color = fiveYearSavings > 0 ? '#059669' : '#dc2626';

    if (breakEvenYears <= 0 || breakEvenYears === Infinity) {
      document.getElementById('rBreakeven').textContent = priceDiff <= 0 ? 'Immediate' : 'N/A';
    } else {
      document.getElementById('rBreakeven').textContent = fmt(breakEvenYears, 1) + ' years';
    }

    document.getElementById('rCO2').textContent = fmt(co2Saved, 0) + ' lbs';

    var winner = (priceDiff <= fiveYearSavings) ? 'EV Wins (5yr)' : 'Gas Wins (5yr)';
    document.getElementById('rWinner').textContent = winner;
    document.getElementById('rWinner').style.color = '#16a34a';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;font-size:0.9rem">';

    d += '<div style="padding:12px;background:#f9fafb;border-radius:8px">';
    d += '<strong>Gas Car (Annual)</strong><br>';
    d += 'Gallons used: ' + fmt(gallonsUsed, 0) + '<br>';
    d += 'Fuel cost: ' + fmtDollars(gasAnnual) + '<br>';
    d += 'Maintenance: ~' + fmtDollars(miles * 0.06) + '<br>';
    d += '<strong>Total: ' + fmtDollars(gasAnnual + miles * 0.06) + '/yr</strong>';
    d += '</div>';

    d += '<div style="padding:12px;background:#f0fdf4;border-radius:8px">';
    d += '<strong>EV (Annual)</strong><br>';
    d += 'kWh used: ' + fmt(miles / eff, 0) + '<br>';
    d += 'Fuel cost: ' + fmtDollars(evAnnual) + '<br>';
    d += 'Maintenance: ~' + fmtDollars(miles * 0.03) + '<br>';
    d += '<strong>Total: ' + fmtDollars(evAnnual + miles * 0.03) + '/yr</strong>';
    d += '</div>';

    d += '</div>';

    d += '<div style="margin-top:16px;padding:12px;background:#f0fdf4;border-radius:8px;font-size:0.9rem">';
    d += '<strong>Annual fuel savings: ' + fmtDollars(fuelSavings) + '</strong> | Maintenance savings: ~' + fmtDollars(maintSavings) + '<br>';
    if (priceDiff > 0 && totalAnnualSavings > 0) {
      d += 'Price premium of ' + fmtDollars(priceDiff) + ' paid back in <strong>' + fmt(breakEvenYears, 1) + ' years</strong>.<br>';
    }
    d += 'Lifetime CO\u2082 reduction: ~' + fmt(co2Saved * 10, 0) + ' lbs over 10 years.';
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

  var inputs = [annualMiles, gasPrice, carMPG, gasCarPrice, elecRate, evEfficiency, evPrice];
  inputs.forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
