(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 0;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var customEl = document.getElementById('customWatts');

  // Standard generator sizes in watts
  var genSizes = [3000, 3500, 4000, 5000, 6500, 7500, 8000, 10000, 12000, 14000, 17500, 20000, 22000];

  var chartData = [
    ['3,000W', '2,400W', 'Portable', 'Fridge + lights + chargers', '$400-$800'],
    ['5,000W', '4,000W', 'Portable', 'Essentials + furnace', '$600-$1,200'],
    ['7,500W', '6,000W', 'Portable', 'Essentials + well pump or AC', '$1,000-$2,000'],
    ['10,000W', '8,000W', 'Portable', 'Most circuits except AC + dryer', '$1,500-$3,000'],
    ['14,000W', '12,000W', 'Standby', 'Whole house minus central AC', '$3,500-$6,000'],
    ['22,000W', '18,000W', 'Standby', 'Entire house including AC', '$5,000-$15,000']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getAllCheckboxes() {
    var boxes = [];
    var essential = document.querySelectorAll('#essentialLoads input[type=checkbox]');
    var large = document.querySelectorAll('#largeLoads input[type=checkbox]');
    essential.forEach(function(cb) { boxes.push(cb); });
    large.forEach(function(cb) { boxes.push(cb); });
    return boxes;
  }

  function calculate() {
    var checkboxes = getAllCheckboxes();
    var totalRunning = 0;
    var maxSurge = 0; // largest single starting surge above running
    var itemCount = 0;

    checkboxes.forEach(function(cb) {
      if (cb.checked) {
        var run = parseInt(cb.getAttribute('data-run'), 10) || 0;
        var start = parseInt(cb.getAttribute('data-start'), 10) || 0;
        totalRunning += run;
        var surge = start - run;
        if (surge > maxSurge) maxSurge = surge;
        itemCount++;
      }
    });

    // Add custom watts
    var custom = parseFloat(customEl.value) || 0;
    if (custom > 0) {
      totalRunning += custom;
      itemCount++;
    }

    if (totalRunning <= 0) return;

    // Starting watts = running + largest surge
    var totalStarting = totalRunning + maxSurge;

    // Recommended size with 20% safety margin
    var recommended = totalStarting * 1.20;

    // Find nearest standard generator size
    var genSize = genSizes[genSizes.length - 1];
    for (var i = 0; i < genSizes.length; i++) {
      if (genSizes[i] >= recommended) {
        genSize = genSizes[i];
        break;
      }
    }

    // Generator type
    var genType = genSize <= 12000 ? 'Portable' : 'Standby (whole-house)';
    if (genSize > 8000 && genSize <= 12000) genType = 'Large portable or small standby';

    var margin = ((genSize / totalStarting) - 1) * 100;

    document.getElementById('rRunning').textContent = fmt(totalRunning) + 'W';
    document.getElementById('rStarting').textContent = fmt(totalStarting) + 'W';
    document.getElementById('rSize').textContent = fmt(genSize) + 'W generator';
    document.getElementById('rType').textContent = genType;
    document.getElementById('rItems').textContent = itemCount + ' items';
    document.getElementById('rMargin').textContent = fmt(margin, 0) + '% headroom';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  // Listen to all checkboxes and custom input
  var allBoxes = getAllCheckboxes();
  allBoxes.forEach(function(cb) {
    cb.addEventListener('change', calculate);
  });
  customEl.addEventListener('input', calculate);
  customEl.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });

})();
