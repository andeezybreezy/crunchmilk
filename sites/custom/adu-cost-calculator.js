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

  // Cost per sqft: [low, mid, high] for each type
  var costPerSqft = {
    garage:       { basic: [80, 100], mid: [120, 150], high: [170, 210] },
    detached:     { basic: [130, 170], mid: [180, 250], high: [260, 360] },
    basement:     { basic: [65, 90], mid: [100, 140], high: [150, 190] },
    above_garage: { basic: [110, 150], mid: [160, 210], high: [220, 290] }
  };

  // Location multiplier
  var locationMult = { high: 1.45, medium: 1.0, low: 0.7 };

  // Permit fee ranges
  var permitFees = { high: [8000, 15000], medium: [3000, 8000], low: [1500, 4000] };

  // Timeline months
  var timelines = {
    garage: [3, 5],
    detached: [6, 12],
    basement: [2, 4],
    above_garage: [5, 8]
  };

  var aduType = document.getElementById('aduType');
  var sqft = document.getElementById('sqft');
  var locationTier = document.getElementById('locationTier');
  var finishLevel = document.getElementById('finishLevel');
  var monthlyRent = document.getElementById('monthlyRent');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['Garage Conversion', '$60,000', '$84,000', '$120,000', '3-5 months'],
    ['Basement Conversion', '$48,000', '$72,000', '$108,000', '2-4 months'],
    ['Above-Garage', '$78,000', '$114,000', '$168,000', '5-8 months'],
    ['Detached New Build', '$90,000', '$138,000', '$210,000', '6-12 months']
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
    var type = aduType.value;
    var size = getVal(sqft);
    var location = locationTier.value;
    var finish = finishLevel.value;
    var rent = getVal(monthlyRent);

    if (size <= 0) return;

    var rates = costPerSqft[type][finish];
    var mult = locationMult[location];
    var costLow = Math.round(size * rates[0] * mult);
    var costHigh = Math.round(size * rates[1] * mult);
    var costMid = Math.round((costLow + costHigh) / 2);

    var permits = permitFees[location];
    var permitLow = permits[0];
    var permitHigh = permits[1];

    var timeline = timelines[type];

    var totalLow = costLow + permitLow;
    var totalHigh = costHigh + permitHigh;
    var totalMid = Math.round((totalLow + totalHigh) / 2);

    var annualRent = rent * 12;
    var netRent = annualRent * 0.85; // 85% after vacancy, maintenance
    var paybackYears = netRent > 0 ? totalMid / netRent : 0;
    var tenYearROI = netRent > 0 ? ((netRent * 10 - totalMid) / totalMid) * 100 : 0;

    document.getElementById('rCostRange').textContent = fmtDollars(costLow) + ' – ' + fmtDollars(costHigh);
    document.getElementById('rPermits').textContent = fmtDollars(permitLow) + ' – ' + fmtDollars(permitHigh);
    document.getElementById('rTimeline').textContent = timeline[0] + '–' + timeline[1] + ' months';
    document.getElementById('rRental').textContent = rent > 0 ? fmtDollars(annualRent) + '/yr' : '—';
    document.getElementById('rPayback').textContent = paybackYears > 0 ? fmt(paybackYears, 1) + ' years' : '—';
    document.getElementById('rPayback').style.color = paybackYears > 0 && paybackYears <= 10 ? '#059669' : '#b45309';
    document.getElementById('rROI').textContent = tenYearROI > 0 ? fmt(tenYearROI, 0) + '%' : '—';
    document.getElementById('rROI').style.color = tenYearROI > 0 ? '#059669' : '';

    var typeName = aduType.options[aduType.selectedIndex].text;
    var locationName = locationTier.options[locationTier.selectedIndex].text;

    var d = '';
    d += '<div style="padding:12px;background:#fffbeb;border-radius:8px;font-size:0.9rem;margin-bottom:12px">';
    d += '<strong>' + typeName + ' — ' + fmt(size, 0) + ' sqft</strong><br>';
    d += 'Location: ' + locationName + '<br>';
    d += 'Construction: ' + fmtDollars(costLow) + ' – ' + fmtDollars(costHigh) + '<br>';
    d += 'Permits & fees: ' + fmtDollars(permitLow) + ' – ' + fmtDollars(permitHigh) + '<br>';
    d += '<strong>Total estimated: ' + fmtDollars(totalLow) + ' – ' + fmtDollars(totalHigh) + '</strong><br>';
    d += 'Cost per sqft: $' + fmt(costLow / size, 0) + ' – $' + fmt(costHigh / size, 0);
    d += '</div>';

    if (rent > 0) {
      d += '<div style="padding:12px;background:#f0fdf4;border-radius:8px;font-size:0.9rem">';
      d += '<strong>Rental Income Projection</strong><br>';
      d += 'Gross annual rent: ' + fmtDollars(annualRent) + '<br>';
      d += 'Net annual (after vacancy/maintenance): ~' + fmtDollars(netRent) + '<br>';
      d += 'Payback period: <strong>' + fmt(paybackYears, 1) + ' years</strong><br>';
      d += '10-year net profit: <strong style="color:#059669">' + fmtDollars(netRent * 10 - totalMid) + '</strong><br>';
      d += '<span style="font-size:0.8rem;color:var(--text-light)">Based on midpoint estimate of ' + fmtDollars(totalMid) + '. Does not include property value increase.</span>';
      d += '</div>';
    }

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

  var inputs = [aduType, sqft, locationTier, finishLevel, monthlyRent];
  inputs.forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
