(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 0;
    return Math.round(n).toString();
  }

  var age = document.getElementById('age');
  var restingHR = document.getElementById('restingHR');
  var knownMax = document.getElementById('knownMax');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['25', '155 bpm', '143–156 bpm', '117–137 bpm', '195'],
    ['30', '150 bpm', '139–152 bpm', '114–133 bpm', '190'],
    ['35', '145 bpm', '135–148 bpm', '111–130 bpm', '185'],
    ['40', '140 bpm', '131–144 bpm', '108–126 bpm', '180'],
    ['50', '130 bpm', '123–136 bpm', '102–119 bpm', '170'],
    ['60', '120 bpm', '115–128 bpm', '96–112 bpm', '160']
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
    var a = getVal(age);
    var rhr = getVal(restingHR);
    var maxKnown = getVal(knownMax);

    if (a <= 0 || a > 120) return;

    var maxHR = maxKnown > 0 ? maxKnown : 220 - a;

    // MAF Method: 180 - age
    var mafHR = 180 - a;
    var mafLow = mafHR - 10;

    // % of Max: 60-70% of maxHR
    var pctLow = Math.round(maxHR * 0.60);
    var pctHigh = Math.round(maxHR * 0.70);

    // Karvonen: resting + 60-70% of (max - resting)
    var karLow, karHigh;
    var hasRHR = rhr > 0;
    if (hasRHR) {
      var hrr = maxHR - rhr;
      karLow = Math.round(rhr + hrr * 0.60);
      karHigh = Math.round(rhr + hrr * 0.70);
    }

    document.getElementById('rMAF').textContent = mafLow + '–' + mafHR + ' bpm';
    document.getElementById('rMAF').style.color = '#059669';

    if (hasRHR) {
      document.getElementById('rKarvonen').textContent = karLow + '–' + karHigh + ' bpm';
      document.getElementById('rKarvonen').style.color = '#059669';
    } else {
      document.getElementById('rKarvonen').textContent = 'Enter resting HR';
      document.getElementById('rKarvonen').style.color = '#9ca3af';
    }

    document.getElementById('rPctMax').textContent = pctLow + '–' + pctHigh + ' bpm';
    document.getElementById('rPctMax').style.color = '#059669';

    // Recommended: average of available methods
    var recLow, recHigh;
    if (hasRHR) {
      recLow = Math.round((mafLow + karLow + pctLow) / 3);
      recHigh = Math.round((mafHR + karHigh + pctHigh) / 3);
    } else {
      recLow = Math.round((mafLow + pctLow) / 2);
      recHigh = Math.round((mafHR + pctHigh) / 2);
    }
    document.getElementById('rRecommended').textContent = recLow + '–' + recHigh + ' bpm';
    document.getElementById('rRecommended').style.color = '#059669';

    var d = '';

    d += '<div style="padding:12px;background:#f0fdf4;border-radius:8px;font-size:0.9rem;margin-bottom:12px">';
    d += '<strong>Method Comparison</strong><br><br>';

    d += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;text-align:center">';

    d += '<div style="padding:10px;background:#fff;border-radius:8px;border:2px solid #05966933">';
    d += '<div style="font-size:0.75rem;color:#6b7280">MAF (180−Age)</div>';
    d += '<div style="font-size:1.2rem;font-weight:700;color:#059669">' + mafLow + '–' + mafHR + '</div>';
    d += '<div style="font-size:0.7rem;color:#9ca3af">Conservative</div>';
    d += '</div>';

    if (hasRHR) {
      d += '<div style="padding:10px;background:#fff;border-radius:8px;border:2px solid #059669">';
      d += '<div style="font-size:0.75rem;color:#6b7280">Karvonen (60-70%)</div>';
      d += '<div style="font-size:1.2rem;font-weight:700;color:#059669">' + karLow + '–' + karHigh + '</div>';
      d += '<div style="font-size:0.7rem;color:#059669">Most personalized</div>';
      d += '</div>';
    } else {
      d += '<div style="padding:10px;background:#f9fafb;border-radius:8px;border:2px dashed #d1d5db">';
      d += '<div style="font-size:0.75rem;color:#9ca3af">Karvonen</div>';
      d += '<div style="font-size:0.9rem;color:#9ca3af">Needs resting HR</div>';
      d += '</div>';
    }

    d += '<div style="padding:10px;background:#fff;border-radius:8px;border:2px solid #05966933">';
    d += '<div style="font-size:0.75rem;color:#6b7280">% Max (60-70%)</div>';
    d += '<div style="font-size:1.2rem;font-weight:700;color:#059669">' + pctLow + '–' + pctHigh + '</div>';
    d += '<div style="font-size:0.7rem;color:#9ca3af">Standard</div>';
    d += '</div>';

    d += '</div></div>';

    d += '<div style="padding:12px;background:#fffbeb;border-radius:8px;font-size:0.9rem;margin-bottom:12px">';
    d += '<strong>The Nose Breathing Test</strong><br>';
    d += 'During exercise, if you can breathe comfortably through your nose only (mouth closed), you are in Zone 2. ';
    d += 'If you need to open your mouth to breathe, you have crossed into Zone 3. This is the simplest real-time check — no heart rate monitor needed.';
    d += '</div>';

    d += '<div style="padding:12px;background:#f5f3ff;border-radius:8px;font-size:0.9rem">';
    d += '<strong>Your Details</strong><br>';
    d += 'Age: ' + Math.round(a) + ' | Est. max HR: ' + Math.round(maxHR) + ' bpm';
    if (hasRHR) d += ' | Resting HR: ' + Math.round(rhr) + ' bpm';
    if (maxKnown > 0) d += '<br><span style="font-size:0.8rem;color:#059669">Using your known max HR of ' + Math.round(maxKnown) + ' bpm</span>';
    else d += '<br><span style="font-size:0.8rem;color:#9ca3af">Using estimated max (220−age). Enter known max for better accuracy.</span>';
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

  var inputs = [age, restingHR, knownMax];
  inputs.forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
