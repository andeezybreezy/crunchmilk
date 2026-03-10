(function() {
  'use strict';

  var unit = 'lbs';
  var platesLbs = [45, 35, 25, 10, 5, 2.5, 1.25];
  var platesKg = [25, 20, 15, 10, 5, 2.5, 1.25];
  var activePlates = {};

  var chartData = [
    ['135 lbs', '45 lbs', '1\u00D745'],
    ['185 lbs', '70 lbs', '1\u00D745, 1\u00D725'],
    ['225 lbs', '90 lbs', '2\u00D745'],
    ['275 lbs', '115 lbs', '2\u00D745, 1\u00D725'],
    ['315 lbs', '135 lbs', '3\u00D745'],
    ['365 lbs', '160 lbs', '3\u00D745, 1\u00D725'],
    ['405 lbs', '180 lbs', '4\u00D745'],
    ['455 lbs', '205 lbs', '4\u00D745, 1\u00D725'],
    ['495 lbs', '225 lbs', '5\u00D745'],
    ['500 lbs', '227.5 lbs', '5\u00D745, 1\u00D72.5']
  ];

  function renderPlateOptions() {
    var container = document.getElementById('plateOptions');
    container.innerHTML = '';
    var plates = unit === 'lbs' ? platesLbs : platesKg;
    plates.forEach(function(p) {
      var label = document.createElement('label');
      label.className = 'checkbox-label';
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = activePlates[p] !== false;
      cb.addEventListener('change', function() { activePlates[p] = cb.checked; });
      label.appendChild(cb);
      label.appendChild(document.createTextNode(' ' + p + ' ' + unit));
      container.appendChild(label);
      if (activePlates[p] === undefined) activePlates[p] = true;
    });
  }

  // Unit toggle
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
      document.getElementById('barUnitLabel').textContent = unit;
      document.getElementById('barWeight').value = unit === 'lbs' ? '45' : '20';
      activePlates = {};
      renderPlateOptions();
    });
  });

  renderPlateOptions();

  function calculate() {
    var target = parseFloat(document.getElementById('targetWeight').value);
    var bar = parseFloat(document.getElementById('barWeight').value);
    if (isNaN(target) || isNaN(bar) || target <= bar) return;

    var perSide = (target - bar) / 2;
    var plates = unit === 'lbs' ? platesLbs : platesKg;
    var remaining = perSide;
    var result = [];

    plates.forEach(function(p) {
      if (activePlates[p] === false) return;
      while (remaining >= p - 0.001) {
        result.push(p);
        remaining -= p;
      }
    });

    var actualPerSide = perSide - remaining;
    var actualTotal = bar + actualPerSide * 2;

    // Count plates
    var counts = {};
    result.forEach(function(p) {
      counts[p] = (counts[p] || 0) + 1;
    });
    var plateStr = Object.keys(counts).sort(function(a, b) { return b - a; }).map(function(p) {
      return counts[p] + '\u00D7' + p;
    }).join(', ');

    document.getElementById('perSide').textContent = actualPerSide.toFixed(actualPerSide % 1 ? 2 : 0) + ' ' + unit;
    document.getElementById('totalLoaded').textContent = actualTotal.toFixed(actualTotal % 1 ? 2 : 0) + ' ' + unit;
    document.getElementById('plateList').textContent = plateStr || 'No plates needed';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
  document.getElementById('targetWeight').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });

  // Render chart
  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td>';
      chartBody.appendChild(tr);
    });
  }

})();
