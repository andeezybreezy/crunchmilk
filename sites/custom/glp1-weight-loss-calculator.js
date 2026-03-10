(function() {
  'use strict';

  // Clinical trial data: total % body weight loss and curve shape
  var medData = {
    wegovy:   { totalPct: 0.150, name: 'Wegovy (semaglutide 2.4mg)', peakWeek: 68 },
    ozempic:  { totalPct: 0.109, name: 'Ozempic (semaglutide 1mg)', peakWeek: 68 },
    mounjaro: { totalPct: 0.225, name: 'Mounjaro (tirzepatide 15mg)', peakWeek: 72 },
    zepbound: { totalPct: 0.225, name: 'Zepbound (tirzepatide 15mg)', peakWeek: 72 }
  };

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 1;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  // Logarithmic weight loss curve: fast early, plateau later
  function weightAtWeek(startWeight, totalPct, week, peakWeek) {
    if (week <= 0) return startWeight;
    var maxLoss = startWeight * totalPct;
    // Use log curve that reaches ~95% of max loss at peakWeek
    var k = -Math.log(0.05) / peakWeek;
    var progress = 1 - Math.exp(-k * week);
    var loss = maxLoss * progress;
    return startWeight - loss;
  }

  var currentWeightEl = document.getElementById('currentWeight');
  var heightFtEl = document.getElementById('heightFt');
  var heightInEl = document.getElementById('heightIn');
  var medicationEl = document.getElementById('medication');
  var goalWeightEl = document.getElementById('goalWeight');
  var timelineEl = document.getElementById('timeline');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['Week 4', '215 lbs (-2.3%)', '217 lbs (-1.4%)', '214 lbs (-2.7%)'],
    ['Week 12', '207 lbs (-5.9%)', '211 lbs (-4.1%)', '204 lbs (-7.3%)'],
    ['Week 24', '197 lbs (-10.5%)', '204 lbs (-7.3%)', '190 lbs (-13.6%)'],
    ['Week 36', '191 lbs (-13.2%)', '200 lbs (-9.1%)', '183 lbs (-16.8%)'],
    ['Week 52', '188 lbs (-14.5%)', '197 lbs (-10.5%)', '177 lbs (-19.5%)'],
    ['Week 68', '187 lbs (-15.0%)', '196 lbs (-10.9%)', '171 lbs (-22.3%)']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getVal(el) { var v = parseFloat(el.value); return isNaN(v) ? 0 : v; }

  function calculate() {
    var startW = getVal(currentWeightEl);
    var ft = getVal(heightFtEl);
    var inches = getVal(heightInEl);
    var med = medicationEl.value;
    var goalW = getVal(goalWeightEl);
    var weeks = getVal(timelineEl) || 68;

    if (startW <= 0) return;

    var data = medData[med];
    var totalHeightIn = ft * 12 + inches;

    var finalWeight = weightAtWeek(startW, data.totalPct, weeks, data.peakWeek);
    var totalLoss = startW - finalWeight;
    var pctLoss = (totalLoss / startW) * 100;

    var finalBMI = 0;
    if (totalHeightIn > 0) {
      finalBMI = (finalWeight / (totalHeightIn * totalHeightIn)) * 703;
    }

    // Find week to reach goal
    var goalWeek = null;
    if (goalW > 0 && goalW < startW) {
      for (var w = 1; w <= 200; w++) {
        if (weightAtWeek(startW, data.totalPct, w, data.peakWeek) <= goalW) {
          goalWeek = w;
          break;
        }
      }
    }

    document.getElementById('rWeight').textContent = fmt(finalWeight, 1) + ' lbs';
    document.getElementById('rLoss').textContent = fmt(totalLoss, 1) + ' lbs';
    document.getElementById('rPct').textContent = fmt(pctLoss, 1) + '%';
    document.getElementById('rBMI').textContent = totalHeightIn > 0 ? fmt(finalBMI, 1) : '—';

    // Build milestone table
    var milestones = [4, 12, 24, 36, 52, 68];
    if (weeks > 68) milestones.push(weeks);
    var d = '';
    d += '<div style="margin-bottom:16px"><strong>' + data.name + '</strong></div>';

    d += '<table style="width:100%;border-collapse:collapse;font-size:0.85rem;margin-bottom:16px">';
    d += '<thead><tr style="border-bottom:2px solid #e5e7eb">';
    d += '<th style="text-align:left;padding:8px 6px">Week</th>';
    d += '<th style="text-align:right;padding:8px 6px">Weight</th>';
    d += '<th style="text-align:right;padding:8px 6px">Lost</th>';
    d += '<th style="text-align:right;padding:8px 6px">% Lost</th>';
    if (totalHeightIn > 0) d += '<th style="text-align:right;padding:8px 6px">BMI</th>';
    d += '</tr></thead><tbody>';

    for (var i = 0; i < milestones.length; i++) {
      var wk = milestones[i];
      if (wk > weeks && wk !== weeks) continue;
      var wt = weightAtWeek(startW, data.totalPct, wk, data.peakWeek);
      var lost = startW - wt;
      var pct = (lost / startW) * 100;
      var bmi = totalHeightIn > 0 ? (wt / (totalHeightIn * totalHeightIn)) * 703 : 0;
      d += '<tr style="border-bottom:1px solid #f3f4f6">';
      d += '<td style="padding:6px">Week ' + wk + '</td>';
      d += '<td style="text-align:right;padding:6px">' + fmt(wt, 1) + ' lbs</td>';
      d += '<td style="text-align:right;padding:6px;color:#7c3aed">-' + fmt(lost, 1) + '</td>';
      d += '<td style="text-align:right;padding:6px">-' + fmt(pct, 1) + '%</td>';
      if (totalHeightIn > 0) d += '<td style="text-align:right;padding:6px">' + fmt(bmi, 1) + '</td>';
      d += '</tr>';
    }
    d += '</tbody></table>';

    if (goalWeek) {
      d += '<div style="padding:12px;background:#f5f3ff;border-radius:8px;margin-bottom:12px;font-size:0.9rem">';
      d += '<strong style="color:#7c3aed">Goal weight of ' + fmt(goalW, 0) + ' lbs:</strong> Estimated to reach around <strong>week ' + goalWeek + '</strong> (~' + fmt(goalWeek / 4.33, 0) + ' months).';
      d += '</div>';
    } else if (goalW > 0 && goalW < startW) {
      d += '<div style="padding:12px;background:#fef3c7;border-radius:8px;margin-bottom:12px;font-size:0.9rem">';
      d += '<strong>Goal weight of ' + fmt(goalW, 0) + ' lbs</strong> may not be reachable with ' + data.name + ' alone based on clinical trial averages. The projected minimum weight is about ' + fmt(weightAtWeek(startW, data.totalPct, 200, data.peakWeek), 0) + ' lbs.';
      d += '</div>';
    }

    d += '<div style="padding:12px;background:#fef3c7;border-radius:8px;font-size:0.8rem">';
    d += '<strong>Important:</strong> These projections use population averages from clinical trials. Individual results vary widely. About 1 in 3 patients exceeds these averages; about 1 in 3 falls below. Factors like diet, exercise, starting BMI, dose titration, and genetics all affect outcomes. Always consult your healthcare provider.';
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

  [currentWeightEl, heightFtEl, heightInEl, goalWeightEl, timelineEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
