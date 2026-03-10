(function() {
  'use strict';

  var unit = 'lbs';

  var chartData = [
    ['100 lbs / 45 kg', '50 oz', '67 oz', '1.5-2.0 L', '6-8'],
    ['120 lbs / 54 kg', '60 oz', '80 oz', '1.8-2.4 L', '8-10'],
    ['140 lbs / 64 kg', '70 oz', '93 oz', '2.1-2.8 L', '9-12'],
    ['160 lbs / 73 kg', '80 oz', '107 oz', '2.4-3.2 L', '10-13'],
    ['180 lbs / 82 kg', '90 oz', '120 oz', '2.7-3.6 L', '11-15'],
    ['200 lbs / 91 kg', '100 oz', '133 oz', '3.0-3.9 L', '13-17'],
    ['220 lbs / 100 kg', '110 oz', '147 oz', '3.3-4.3 L', '14-18'],
    ['250 lbs / 113 kg', '125 oz', '167 oz', '3.7-4.9 L', '16-21']
  ];

  var toggleBtns = document.querySelectorAll('.unit-toggle button');
  toggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      toggleBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      unit = btn.dataset.unit;
    });
  });

  function calculate() {
    var w = parseFloat(document.getElementById('weight').value);
    var activityFactor = parseFloat(document.getElementById('activity').value);
    var climateFactor = parseFloat(document.getElementById('climate').value);
    if (isNaN(w) || w <= 0) return;

    var weightLbs = unit === 'kg' ? w * 2.20462 : w;

    // Base: 0.67 oz per lb of body weight, adjusted by activity and climate
    var baseOz = weightLbs * 0.67;
    var totalOz = baseOz * activityFactor * climateFactor;

    var liters = totalOz * 0.0295735;
    var glasses = totalOz / 8;
    var bottles = totalOz / 16.9;

    document.getElementById('waterOz').textContent = Math.round(totalOz) + ' oz';
    document.getElementById('waterL').textContent = liters.toFixed(1) + ' L';
    document.getElementById('waterGlasses').textContent = Math.round(glasses);
    document.getElementById('waterBottles').textContent = Math.round(bottles * 10) / 10;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
  document.getElementById('weight').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });

  // Render chart
  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td><td>' + row[4] + '</td>';
      chartBody.appendChild(tr);
    });
  }

})();
