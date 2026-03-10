(function() {
  'use strict';

  function $(id) { return document.getElementById(id); }
  function fmt(n) { return '$' + n.toFixed(2); }

  var chartData = [
    ['California (SCE)', '38\u201354\u00a2', '27\u201335\u00a2', '14\u201318\u00a2', '4pm\u20139pm', 'Solar + battery'],
    ['Arizona (APS)', '24\u201338\u00a2', '14\u201319\u00a2', '6\u20138\u00a2', '3pm\u20138pm', 'Pool pump shifting'],
    ['Texas (TXU)', '18\u201328\u00a2', '12\u201316\u00a2', '8\u201311\u00a2', '2pm\u20137pm', 'EV charging'],
    ['New York (ConEd)', '30\u201342\u00a2', '20\u201328\u00a2', '12\u201316\u00a2', '2pm\u20136pm', 'Appliance shifting'],
    ['Florida (FPL)', '14\u201322\u00a2', '11\u201315\u00a2', '7\u201310\u00a2', '12pm\u20139pm', 'EV + pool pump'],
    ['Illinois (ComEd)', '16\u201324\u00a2', '10\u201314\u00a2', '5\u20138\u00a2', '2pm\u20137pm', 'Overnight charging']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  $('calcBtn').addEventListener('click', function() {
    var flatRate = parseFloat($('flatRate').value) || 0;
    var peakRate = parseFloat($('peakRate').value) || 0;
    var midRate = parseFloat($('midRate').value) || 0;
    var offRate = parseFloat($('offRate').value) || 0;
    var monthlyKwh = parseFloat($('monthlyKwh').value) || 0;
    var peakPct = parseFloat($('peakPct').value) || 0;
    var midPct = parseFloat($('midPct').value) || 0;
    var shiftPct = parseFloat($('shiftPct').value) || 0;

    if (monthlyKwh <= 0 || flatRate <= 0) return;

    // Convert cents to dollars
    var flatD = flatRate / 100;
    var peakD = peakRate / 100;
    var midD = midRate / 100;
    var offD = offRate / 100;

    var offPct = 100 - peakPct - midPct;
    if (offPct < 0) offPct = 0;

    var peakKwh = monthlyKwh * (peakPct / 100);
    var midKwh = monthlyKwh * (midPct / 100);
    var offKwh = monthlyKwh * (offPct / 100);

    // Flat rate cost
    var flatCost = monthlyKwh * flatD;

    // TOU current pattern cost
    var touCurrent = (peakKwh * peakD) + (midKwh * midD) + (offKwh * offD);

    // TOU optimized: shift some peak to off-peak
    var shiftedKwh = peakKwh * (shiftPct / 100);
    var newPeakKwh = peakKwh - shiftedKwh;
    var newOffKwh = offKwh + shiftedKwh;
    var touOptimized = (newPeakKwh * peakD) + (midKwh * midD) + (newOffKwh * offD);

    var savings = flatCost - touOptimized;
    var annualSavings = savings * 12;
    var effectiveRate = (touOptimized / monthlyKwh) * 100;

    $('rFlat').textContent = fmt(flatCost);
    $('rTouCurrent').textContent = fmt(touCurrent);
    $('rTouOptimized').textContent = fmt(touOptimized);
    $('rSavings').textContent = fmt(savings) + '/mo';
    $('rSavings').style.color = savings >= 0 ? '#059669' : '#dc2626';
    $('rAnnual').textContent = fmt(annualSavings) + '/yr';
    $('rAnnual').style.color = annualSavings >= 0 ? '#059669' : '#dc2626';
    $('rEffective').textContent = effectiveRate.toFixed(1) + '\u00a2/kWh';

    var d = '';
    d += '<div style="padding:14px;background:#eef2ff;border-radius:8px;margin-bottom:12px">';
    d += '<strong>Usage Distribution</strong>';
    d += '<div style="margin-top:8px">';

    // Before optimization
    d += '<div style="font-size:0.8rem;color:var(--text-light);margin-bottom:4px">Current pattern:</div>';
    d += '<div style="display:flex;height:24px;border-radius:4px;overflow:hidden;margin-bottom:8px">';
    d += '<div style="width:' + peakPct + '%;background:#dc2626;display:flex;align-items:center;justify-content:center;color:white;font-size:0.7rem">' + peakPct + '% peak</div>';
    d += '<div style="width:' + midPct + '%;background:#f59e0b;display:flex;align-items:center;justify-content:center;color:white;font-size:0.7rem">' + midPct + '% mid</div>';
    d += '<div style="width:' + offPct + '%;background:#059669;display:flex;align-items:center;justify-content:center;color:white;font-size:0.7rem">' + offPct + '% off</div>';
    d += '</div>';

    // After optimization
    var newPeakPct = (peakPct * (1 - shiftPct / 100)).toFixed(0);
    var newOffPctVal = (100 - newPeakPct - midPct).toFixed(0);
    d += '<div style="font-size:0.8rem;color:var(--text-light);margin-bottom:4px">After shifting ' + shiftPct + '% of peak:</div>';
    d += '<div style="display:flex;height:24px;border-radius:4px;overflow:hidden">';
    d += '<div style="width:' + newPeakPct + '%;background:#dc2626;display:flex;align-items:center;justify-content:center;color:white;font-size:0.7rem">' + newPeakPct + '% peak</div>';
    d += '<div style="width:' + midPct + '%;background:#f59e0b;display:flex;align-items:center;justify-content:center;color:white;font-size:0.7rem">' + midPct + '% mid</div>';
    d += '<div style="width:' + newOffPctVal + '%;background:#059669;display:flex;align-items:center;justify-content:center;color:white;font-size:0.7rem">' + newOffPctVal + '% off</div>';
    d += '</div></div></div>';

    d += '<div style="padding:14px;background:#f0fdf4;border-radius:8px;margin-bottom:12px">';
    d += '<strong style="color:#059669">Easy Loads to Shift Off-Peak</strong>';
    d += '<ul style="margin:8px 0 0 0;padding-left:20px;font-size:0.9rem;line-height:1.7">';
    d += '<li>EV charging (set timer for 11pm-6am) \u2014 saves ~$30-80/mo</li>';
    d += '<li>Laundry (run after 9pm or before 7am)</li>';
    d += '<li>Dishwasher (delay start to off-peak)</li>';
    d += '<li>Pool pump (schedule for early morning)</li>';
    d += '<li>Water heater (timer or heat pump mode off-peak)</li>';
    d += '</ul></div>';

    if (touCurrent > flatCost && savings < 0) {
      d += '<div style="padding:12px;background:#fef2f2;border-radius:8px;font-size:0.85rem">';
      d += '<strong style="color:#dc2626">Warning:</strong> With your current usage pattern, TOU would cost MORE than flat rate. You need to shift more usage off-peak or stick with your flat rate plan.';
      d += '</div>';
    }

    $('resultDetails').innerHTML = d;
    $('result').classList.add('visible');
    $('result').style.display = 'block';
  });
})();
