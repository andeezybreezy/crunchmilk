(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 1;
    return n.toFixed(d);
  }

  var directionEl = document.getElementById('direction');
  var avgGlucoseEl = document.getElementById('avgGlucose');
  var a1cInputEl = document.getElementById('a1cInput');
  var glucoseGroup = document.getElementById('glucoseGroup');
  var a1cGroup = document.getElementById('a1cGroup');
  var timeInRangeEl = document.getElementById('timeInRange');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['90', '4.8%', 'Normal', '>95%', 'Low'],
    ['110', '5.5%', 'Normal', '>90%', 'Low'],
    ['126', '6.0%', 'Prediabetes', '~85%', 'Moderate'],
    ['140', '6.5%', 'Prediabetes/Diabetes', '~75%', 'Elevated'],
    ['170', '7.5%', 'Diabetes', '~55%', 'High'],
    ['212', '9.0%', 'Diabetes (uncontrolled)', '~30%', 'Very High']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      var cells = '';
      for (var i = 0; i < row.length; i++) cells += '<td>' + row[i] + '</td>';
      tr.innerHTML = cells;
      chartBody.appendChild(tr);
    });
  }

  directionEl.addEventListener('change', function() {
    if (directionEl.value === 'glucoseToA1c') {
      glucoseGroup.style.display = '';
      a1cGroup.style.display = 'none';
    } else {
      glucoseGroup.style.display = 'none';
      a1cGroup.style.display = '';
    }
  });

  function getVal(el) {
    var v = parseFloat(el.value);
    return isNaN(v) ? 0 : v;
  }

  function getCategory(a1c) {
    if (a1c < 5.7) return { label: 'Normal', color: '#059669' };
    if (a1c < 6.5) return { label: 'Prediabetes', color: '#d97706' };
    if (a1c < 7.0) return { label: 'Diabetes (controlled)', color: '#dc2626' };
    if (a1c < 9.0) return { label: 'Diabetes (above target)', color: '#dc2626' };
    return { label: 'Diabetes (uncontrolled)', color: '#991b1b' };
  }

  function estimateTIR(avgGlucose) {
    // Rough estimate: TIR decreases as avg glucose increases
    if (avgGlucose <= 100) return '>95%';
    if (avgGlucose <= 115) return '~90-95%';
    if (avgGlucose <= 130) return '~80-90%';
    if (avgGlucose <= 150) return '~70-80%';
    if (avgGlucose <= 170) return '~50-65%';
    if (avgGlucose <= 200) return '~35-50%';
    return '<35%';
  }

  function calculate() {
    var direction = directionEl.value;
    var avgGlucose, a1c;

    if (direction === 'glucoseToA1c') {
      avgGlucose = getVal(avgGlucoseEl);
      if (avgGlucose <= 0) return;
      a1c = (avgGlucose + 46.7) / 28.7;
    } else {
      a1c = getVal(a1cInputEl);
      if (a1c <= 0) return;
      avgGlucose = (a1c * 28.7) - 46.7;
    }

    var tir = getVal(timeInRangeEl);
    var cat = getCategory(a1c);

    document.getElementById('rA1C').textContent = fmt(a1c, 1) + '%';
    document.getElementById('rA1C').style.color = cat.color;
    document.getElementById('rGlucose').textContent = Math.round(avgGlucose) + ' mg/dL';
    document.getElementById('rCategory').textContent = cat.label;
    document.getElementById('rCategory').style.color = cat.color;

    var tirDisplay = tir > 0 ? tir + '%' : estimateTIR(avgGlucose);
    document.getElementById('rTIR').textContent = tirDisplay;

    var tirColor = '#059669';
    var tirVal = tir > 0 ? tir : (avgGlucose <= 130 ? 85 : avgGlucose <= 160 ? 65 : 40);
    if (tirVal < 50) tirColor = '#dc2626';
    else if (tirVal < 70) tirColor = '#d97706';
    document.getElementById('rTIR').style.color = tirColor;

    var d = '';

    // Conversion result
    d += '<div style="padding:12px;background:' + (a1c < 5.7 ? '#f0fdf4' : a1c < 6.5 ? '#fffbeb' : '#fef2f2') + ';border-radius:8px;font-size:0.9rem;margin-bottom:12px">';
    d += '<strong>Conversion Result</strong><br>';
    d += 'Average glucose: <strong>' + Math.round(avgGlucose) + ' mg/dL</strong> (' + Math.round(avgGlucose / 18.016 * 10) / 10 + ' mmol/L)<br>';
    d += 'Estimated A1C (GMI): <strong style="color:' + cat.color + '">' + fmt(a1c, 1) + '%</strong><br>';
    d += 'Category: <strong style="color:' + cat.color + '">' + cat.label + '</strong>';
    d += '</div>';

    // Time in range context
    d += '<div style="padding:12px;background:#eff6ff;border-radius:8px;font-size:0.9rem;margin-bottom:12px">';
    d += '<strong>Time in Range Context</strong><br>';
    if (tir > 0) {
      d += 'Your TIR (70-180 mg/dL): <strong>' + tir + '%</strong><br>';
      if (tir >= 70) {
        d += '<span style="color:#059669">Meets recommended target of >70%</span><br>';
      } else {
        d += '<span style="color:#d97706">Below recommended target of >70%</span><br>';
      }
    } else {
      d += 'Estimated TIR: ' + estimateTIR(avgGlucose) + ' (enter your actual TIR above for precise data)<br>';
    }
    d += '<br><strong>TIR-A1C Relationship:</strong><br>';
    d += 'Each 10% increase in TIR ≈ 0.8% decrease in A1C<br>';
    d += '70% TIR ≈ A1C of ~7.0% | 80% TIR ≈ ~6.4% | 90% TIR ≈ ~5.8%';
    d += '</div>';

    // Reference ranges
    d += '<div style="padding:12px;background:#f9fafb;border-radius:8px;font-size:0.85rem">';
    d += '<strong>Reference Ranges</strong><br>';
    d += '<span style="color:#059669">Normal:</span> A1C < 5.7% | Avg glucose < 117 mg/dL<br>';
    d += '<span style="color:#d97706">Prediabetes:</span> A1C 5.7-6.4% | Avg glucose 117-137 mg/dL<br>';
    d += '<span style="color:#dc2626">Diabetes:</span> A1C ≥ 6.5% | Avg glucose ≥ 140 mg/dL<br>';
    d += '<span style="font-size:0.8rem;color:var(--text-light)">Note: CGM-derived GMI may differ from lab A1C by ±0.3-0.5%. Always confirm with lab testing.</span>';
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

  [directionEl, avgGlucoseEl, a1cInputEl, timeInRangeEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
