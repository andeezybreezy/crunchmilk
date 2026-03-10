(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  var totalRiseEl = document.getElementById('totalRise');
  var desiredRiseEl = document.getElementById('desiredRise');
  var treadEl = document.getElementById('treadDepth');
  var widthEl = document.getElementById('stairWidth');
  var noseEl = document.getElementById('noseOverhang');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['36" (3\')', '5', '7.20"', '42"', '55.3"', '40.6°'],
    ['72" (6\')', '10', '7.20"', '94.5"', '118.8"', '37.3°'],
    ['96" (8\')', '13', '7.38"', '126"', '158.4"', '37.3°'],
    ['108" (9\')', '14', '7.71"', '136.5"', '174.1"', '38.4°'],
    ['118" (9\'10")', '16', '7.38"', '157.5"', '196.9"', '36.8°'],
    ['132" (11\')', '18', '7.33"', '178.5"', '222.0"', '36.5°']
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
    var totalRise = getVal(totalRiseEl);
    var desiredRise = getVal(desiredRiseEl);
    var treadDepth = getVal(treadEl);
    var stairWidth = getVal(widthEl);
    var nosing = getVal(noseEl);

    if (totalRise <= 0 || desiredRise <= 0 || treadDepth <= 0) return;

    // Calculate number of risers (round to nearest whole)
    var numRisers = Math.round(totalRise / desiredRise);
    if (numRisers < 1) numRisers = 1;

    var actualRise = totalRise / numRisers;
    var numTreads = numRisers - 1;
    var totalRun = numTreads * treadDepth;

    // Stringer length (hypotenuse)
    var stringerLen = Math.sqrt(totalRise * totalRise + totalRun * totalRun);

    // Angle in degrees
    var angleRad = Math.atan2(totalRise, totalRun);
    var angleDeg = angleRad * (180 / Math.PI);

    // Rise + run comfort check
    var riseRunSum = actualRise + treadDepth;

    document.getElementById('rRisers').textContent = numRisers;
    document.getElementById('rActualRise').textContent = fmt(actualRise, 2) + '"';
    document.getElementById('rTreads').textContent = numTreads;
    document.getElementById('rTotalRun').textContent = fmt(totalRun, 1) + '" (' + fmt(totalRun / 12, 1) + ' ft)';
    document.getElementById('rStringer').textContent = fmt(stringerLen, 1) + '" (' + fmt(stringerLen / 12, 1) + ' ft)';
    document.getElementById('rAngle').textContent = fmt(angleDeg, 1) + '°';

    // Code compliance check
    var issues = [];
    var passes = [];

    if (actualRise > 7.75) {
      issues.push('Riser height ' + fmt(actualRise, 2) + '" exceeds code max of 7.75"');
    } else {
      passes.push('Riser height ' + fmt(actualRise, 2) + '" is within code max (7.75")');
    }

    if (treadDepth < 10) {
      issues.push('Tread depth ' + fmt(treadDepth, 1) + '" is below code min of 10"');
    } else {
      passes.push('Tread depth ' + fmt(treadDepth, 1) + '" meets code min (10")');
    }

    if (stairWidth < 36) {
      issues.push('Width ' + fmt(stairWidth, 0) + '" is below code min of 36"');
    } else {
      passes.push('Width ' + fmt(stairWidth, 0) + '" meets code min (36")');
    }

    if (riseRunSum >= 17 && riseRunSum <= 18) {
      passes.push('Rise + Run = ' + fmt(riseRunSum, 1) + '" (ideal comfort range: 17-18")');
    } else {
      issues.push('Rise + Run = ' + fmt(riseRunSum, 1) + '" (outside ideal 17-18" comfort range)');
    }

    var codeDiv = document.getElementById('codeCheck');
    var html = '';
    if (issues.length === 0) {
      html += '<div style="background:#dcfce7;padding:12px;border-radius:8px;border-left:4px solid #16a34a;margin-bottom:8px">';
      html += '<strong style="color:#16a34a">&#10004; All Code Checks Pass</strong></div>';
    } else {
      html += '<div style="background:#fef2f2;padding:12px;border-radius:8px;border-left:4px solid #dc2626;margin-bottom:8px">';
      html += '<strong style="color:#dc2626">&#10008; Code Issues Found</strong><br>';
      issues.forEach(function(i) { html += '• ' + i + '<br>'; });
      html += '</div>';
    }
    if (passes.length > 0) {
      html += '<div style="background:#f0fdf4;padding:10px;border-radius:8px;font-size:0.85rem">';
      passes.forEach(function(p) { html += '&#10004; ' + p + '<br>'; });
      html += '</div>';
    }
    codeDiv.innerHTML = html;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [totalRiseEl, desiredRiseEl, treadEl, widthEl, noseEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
