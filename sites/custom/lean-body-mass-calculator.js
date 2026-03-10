(function() {
  'use strict';

  var unit = 'lbs';

  var chartData = [
    ['6-10%', 'Essential/Competition (Men)', '11-18 lbs', '162-169 lbs'],
    ['10-15%', 'Athletic (Men)', '18-27 lbs', '153-162 lbs'],
    ['15-20%', 'Fit (Men)', '27-36 lbs', '144-153 lbs'],
    ['20-25%', 'Average (Men)', '36-45 lbs', '135-144 lbs'],
    ['14-18%', 'Athletic (Women)', '25-32 lbs', '148-155 lbs'],
    ['18-24%', 'Fit (Women)', '32-43 lbs', '137-148 lbs'],
    ['25-31%', 'Average (Women)', '45-56 lbs', '124-135 lbs'],
    ['32%+', 'Above Average', '58+ lbs', 'Below 122 lbs']
  ];

  var toggleBtns = document.querySelectorAll('.unit-toggle[aria-label="Weight unit"] button');
  toggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      toggleBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      unit = btn.dataset.unit;
    });
  });

  function calculate() {
    var w = parseFloat(document.getElementById('weight').value);
    var bf = parseFloat(document.getElementById('bodyFat').value);
    if (isNaN(w) || isNaN(bf) || w <= 0 || bf < 0 || bf >= 100) return;

    var fatMass = w * (bf / 100);
    var lbm = w - fatMass;
    var leanPct = 100 - bf;

    var unitLabel = unit;
    document.getElementById('lbmValue').textContent = lbm.toFixed(1) + ' ' + unitLabel;
    document.getElementById('fatMass').textContent = fatMass.toFixed(1) + ' ' + unitLabel;
    document.getElementById('leanPct').textContent = leanPct.toFixed(1) + '%';

    // FFMI calculation if height provided
    var ft = parseFloat(document.getElementById('heightFt').value) || 0;
    var inc = parseFloat(document.getElementById('heightIn').value) || 0;
    if (ft > 0 || inc > 0) {
      var heightM = (ft * 12 + inc) * 0.0254;
      var lbmKg = unit === 'lbs' ? lbm * 0.453592 : lbm;
      var ffmi = lbmKg / (heightM * heightM);
      var normalizedFFMI = ffmi + 6.1 * (1.8 - heightM);
      document.getElementById('ffmi').textContent = ffmi.toFixed(1) + ' (normalized: ' + normalizedFFMI.toFixed(1) + ')';
    } else {
      document.getElementById('ffmi').textContent = 'Enter height above';
    }

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
  document.getElementById('weight').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  document.getElementById('bodyFat').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });

  // Render chart
  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

})();
