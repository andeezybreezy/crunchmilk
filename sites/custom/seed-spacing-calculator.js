(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v <= 0 ? 0 : v;
  }

  function calculate() {
    var bedLength = val('bedLength');
    var bedWidth = val('bedWidth');
    var seedSpacing = val('seedSpacing');
    var rowSpacing = val('rowSpacing');
    var germRate = val('germRate');

    if (bedLength <= 0 || bedWidth <= 0 || seedSpacing <= 0 || rowSpacing <= 0 || germRate <= 0) return;

    var bedLengthIn = bedLength * 12;
    var bedWidthIn = bedWidth * 12;

    // Number of rows that fit across the width
    var numRows = Math.floor(bedWidthIn / rowSpacing) + 1;

    // Seeds per row along the length
    var seedsPerRow = Math.floor(bedLengthIn / seedSpacing) + 1;

    var totalSpots = numRows * seedsPerRow;

    // Account for germination rate — plant extra
    var totalSeeds = Math.ceil(totalSpots / (germRate / 100));

    var areaSqFt = bedLength * bedWidth;
    var perSqFt = 144 / (seedSpacing * rowSpacing);

    document.getElementById('numRows').textContent = numRows + ' rows';
    document.getElementById('seedsPerRow').textContent = seedsPerRow;
    document.getElementById('totalSpots').textContent = totalSpots;
    document.getElementById('totalSeeds').textContent = totalSeeds + ' seeds';
    document.getElementById('growArea').textContent = areaSqFt.toFixed(1) + ' sq ft';
    document.getElementById('perSqFt').textContent = perSqFt.toFixed(1);

    document.getElementById('resultTip').textContent =
      'Rows spaced ' + rowSpacing + '" apart · Seeds ' + seedSpacing + '" apart in each row';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  document.querySelectorAll('input[type="number"]').forEach(function(el) {
    el.addEventListener('input', calculate);
  });

  calculate();

  // Populate chart
  var tbody = document.querySelector('.chart-table tbody');
  if (tbody) {
    var crops = [
      ['Lettuce', '6"', '12"', '4', '1/4"'],
      ['Carrots', '2"', '6"', '16', '1/4"'],
      ['Radishes', '2"', '6"', '16', '1/2"'],
      ['Beans (bush)', '4"', '18"', '2', '1"'],
      ['Peas', '3"', '18"', '2.7', '1"'],
      ['Tomatoes', '24"', '36"', '0.17', '1/4"'],
      ['Peppers', '18"', '24"', '0.33', '1/4"'],
      ['Squash', '36"', '48"', '0.08', '1"']
    ];
    crops.forEach(function(r) {
      var tr = document.createElement('tr');
      r.forEach(function(c) {
        var td = document.createElement('td');
        td.textContent = c;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
})();
