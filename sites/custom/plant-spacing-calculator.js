(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function calculate() {
    var lengthFt = val('areaLength');
    var widthFt = val('areaWidth');
    var spacing = val('plantSpacing');
    var pattern = document.getElementById('pattern').value;
    var buffer = val('edgeBuffer');

    if (lengthFt <= 0 || widthFt <= 0 || spacing <= 0) return;

    var lengthIn = lengthFt * 12;
    var widthIn = widthFt * 12;

    // Usable area after edge buffer
    var usableL = lengthIn - 2 * buffer;
    var usableW = widthIn - 2 * buffer;

    if (usableL <= 0 || usableW <= 0) return;

    var totalPlants = 0;
    var numRows = 0;
    var numCols = 0;

    if (pattern === 'square') {
      numCols = Math.floor(usableL / spacing) + 1;
      numRows = Math.floor(usableW / spacing) + 1;
      totalPlants = numRows * numCols;
    } else {
      // Triangular offset: row spacing = spacing * sqrt(3)/2 ≈ spacing * 0.866
      var rowDist = spacing * Math.sqrt(3) / 2;
      numRows = Math.floor(usableW / rowDist) + 1;
      numCols = Math.floor(usableL / spacing) + 1;
      totalPlants = 0;
      for (var r = 0; r < numRows; r++) {
        if (r % 2 === 0) {
          totalPlants += numCols;
        } else {
          // Offset row: shifted by half spacing, may fit one fewer
          var offsetCols = Math.floor((usableL - spacing / 2) / spacing) + 1;
          totalPlants += Math.max(0, offsetCols);
        }
      }
    }

    var areaSqFt = lengthFt * widthFt;
    var usableSqFt = (usableL / 12) * (usableW / 12);
    var plantsPerSqFt = totalPlants / usableSqFt;
    var sqFtPerPlant = usableSqFt / totalPlants;

    document.getElementById('totalPlants').textContent = totalPlants;
    document.getElementById('plantsPerSqFt').textContent = plantsPerSqFt.toFixed(2);
    document.getElementById('numRows').textContent = numRows;
    document.getElementById('numCols').textContent = numCols + (pattern === 'triangle' ? ' (even rows)' : '');
    document.getElementById('usableArea').textContent = usableSqFt.toFixed(1) + ' sq ft';
    document.getElementById('sqFtPerPlant').textContent = sqFtPerPlant.toFixed(2) + ' sq ft';

    var label = pattern === 'square' ? 'Square grid' : 'Triangular offset';
    document.getElementById('resultTip').textContent =
      label + ' · ' + spacing + '" spacing · ' + buffer + '" edge buffer';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  document.querySelectorAll('input[type="number"]').forEach(function(el) {
    el.addEventListener('input', calculate);
  });
  document.getElementById('pattern').addEventListener('change', calculate);

  calculate();

  // Populate chart
  var tbody = document.querySelector('.chart-table tbody');
  if (tbody) {
    var spacings = [4, 6, 9, 12, 18, 24, 36];
    spacings.forEach(function(s) {
      var perSqFt = 144 / (s * s);
      var sqFtPer = (s * s) / 144;
      // In 4×8 bed (46" usable × 94" usable with 1" buffer approx)
      var cols48 = Math.floor(94 / s) + 1;
      var rows48 = Math.floor(46 / s) + 1;
      var in48 = cols48 * rows48;
      var cols44 = Math.floor(46 / s) + 1;
      var in44 = cols44 * rows48;
      var tr = document.createElement('tr');
      [s + '"', perSqFt.toFixed(1), sqFtPer.toFixed(2), in48.toString(), in44.toString()].forEach(function(txt) {
        var td = document.createElement('td');
        td.textContent = txt;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
})();
