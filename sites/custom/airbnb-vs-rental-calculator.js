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

  // DOM refs
  var propertyValue = document.getElementById('propertyValue');
  var monthlyRent = document.getElementById('monthlyRent');
  var ltrVacancy = document.getElementById('ltrVacancy');
  var ltrMaint = document.getElementById('ltrMaint');
  var nightlyRate = document.getElementById('nightlyRate');
  var occupancy = document.getElementById('occupancy');
  var cleaningFee = document.getElementById('cleaningFee');
  var mgmtPct = document.getElementById('mgmtPct');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rLTR = document.getElementById('rLTR');
  var rAirbnb = document.getElementById('rAirbnb');
  var rBreakeven = document.getElementById('rBreakeven');
  var rWinner = document.getElementById('rWinner');
  var resultDetails = document.getElementById('resultDetails');

  // Chart
  var chartData = [
    ['40%', '146', '$21,900', '$9,265', '$12,635'],
    ['50%', '183', '$27,375', '$11,290', '$16,085'],
    ['60%', '219', '$32,850', '$13,315', '$19,535'],
    ['70%', '256', '$38,325', '$15,340', '$22,985'],
    ['80%', '292', '$43,800', '$17,365', '$26,435'],
    ['90%', '329', '$49,275', '$19,390', '$29,885']
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
    var propVal = getVal(propertyValue);
    var rent = getVal(monthlyRent);
    var vacRate = getVal(ltrVacancy) / 100;
    var maintRate = getVal(ltrMaint) / 100;
    var nightly = getVal(nightlyRate);
    var occRate = getVal(occupancy) / 100;
    var cleaning = getVal(cleaningFee);
    var mgmt = getVal(mgmtPct) / 100;

    if (rent <= 0 && nightly <= 0) { hideResult(); return; }

    // Long-term rental calculation
    var ltrGross = rent * 12;
    var ltrEffective = ltrGross * (1 - vacRate);
    var ltrMaintCost = ltrEffective * maintRate;
    var ltrNet = ltrEffective - ltrMaintCost;

    // Airbnb calculation
    var bookedNights = 365 * occRate;
    var avgStayLength = 3; // assume 3-night average stay
    var turnovers = bookedNights / avgStayLength;
    var airbnbGross = nightly * bookedNights;
    var cleaningCost = cleaning * turnovers;
    var mgmtCost = airbnbGross * mgmt;
    var suppliesCost = bookedNights * 5; // ~$5/night supplies
    var airbnbNet = airbnbGross - cleaningCost - mgmtCost - suppliesCost;

    // Break-even occupancy: find occupancy where airbnb net = ltr net
    // airbnbNet(occ) = nightly*365*occ - cleaning*(365*occ/avgStay) - nightly*365*occ*mgmt - 365*occ*5
    // = occ * [nightly*365 - cleaning*365/avgStay - nightly*365*mgmt - 365*5]
    // = occ * 365 * [nightly - cleaning/avgStay - nightly*mgmt - 5]
    var perNightNet = nightly - (cleaning / avgStayLength) - (nightly * mgmt) - 5;
    var breakEvenOcc = perNightNet > 0 ? (ltrNet / (365 * perNightNet)) * 100 : 999;

    // Management time estimate
    var airbnbHoursWeek = Math.round(turnovers * 0.5 + bookedNights * 0.05);
    var ltrHoursMonth = 3;

    var winner = airbnbNet > ltrNet ? 'Airbnb' : 'Long-Term Rental';
    var diff = Math.abs(airbnbNet - ltrNet);

    rLTR.textContent = fmtDollars(ltrNet);
    rAirbnb.textContent = fmtDollars(airbnbNet);
    rAirbnb.style.color = airbnbNet > ltrNet ? '#059669' : '';
    rLTR.style.color = ltrNet > airbnbNet ? '#059669' : '';
    rBreakeven.textContent = breakEvenOcc <= 100 ? fmt(breakEvenOcc, 0) + '%' : 'N/A';
    rWinner.textContent = winner;
    rWinner.style.color = '#7c3aed';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;font-size:0.9rem">';

    // LTR breakdown
    d += '<div style="padding:12px;background:#f9fafb;border-radius:8px">';
    d += '<strong>Long-Term Breakdown</strong><br>';
    d += 'Gross rent: ' + fmtDollars(ltrGross) + '/yr<br>';
    d += 'After vacancy (' + fmt(vacRate * 100, 0) + '%): ' + fmtDollars(ltrEffective) + '<br>';
    d += 'Maintenance: -' + fmtDollars(ltrMaintCost) + '<br>';
    d += '<strong>Net: ' + fmtDollars(ltrNet) + '/yr</strong><br>';
    d += '<span style="font-size:0.8rem;color:var(--text-light)">~' + ltrHoursMonth + ' hrs/month management</span>';
    d += '</div>';

    // Airbnb breakdown
    d += '<div style="padding:12px;background:#f5f3ff;border-radius:8px">';
    d += '<strong>Airbnb Breakdown</strong><br>';
    d += 'Booked nights: ' + fmt(bookedNights, 0) + ' (' + fmt(occRate * 100, 0) + '%)<br>';
    d += 'Gross revenue: ' + fmtDollars(airbnbGross) + '<br>';
    d += 'Cleaning (' + fmt(turnovers, 0) + ' turnovers): -' + fmtDollars(cleaningCost) + '<br>';
    d += 'Management (' + fmt(mgmt * 100, 0) + '%): -' + fmtDollars(mgmtCost) + '<br>';
    d += 'Supplies: -' + fmtDollars(suppliesCost) + '<br>';
    d += '<strong>Net: ' + fmtDollars(airbnbNet) + '/yr</strong><br>';
    d += '<span style="font-size:0.8rem;color:var(--text-light)">~' + airbnbHoursWeek + ' hrs/week management</span>';
    d += '</div>';

    d += '</div>';

    // Summary
    d += '<div style="margin-top:16px;padding:12px;background:' + (airbnbNet > ltrNet ? '#f5f3ff' : '#f9fafb') + ';border-radius:8px;font-size:0.9rem">';
    d += '<strong>' + winner + ' wins by ' + fmtDollars(diff) + '/year.</strong>';
    if (breakEvenOcc <= 100 && breakEvenOcc > 0) {
      d += '<br>Airbnb breaks even with long-term at <strong>' + fmt(breakEvenOcc, 0) + '% occupancy</strong>.';
    }
    if (propVal > 0) {
      d += '<br>LTR yield: ' + fmt((ltrNet / propVal) * 100, 1) + '% | Airbnb yield: ' + fmt((airbnbNet / propVal) * 100, 1) + '%';
    }
    d += '</div>';

    resultDetails.innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  function hideResult() {
    resultEl.classList.remove('visible');
    resultEl.style.display = 'none';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  var inputs = [propertyValue, monthlyRent, ltrVacancy, ltrMaint, nightlyRate, occupancy, cleaningFee, mgmtPct];
  inputs.forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });

})();
