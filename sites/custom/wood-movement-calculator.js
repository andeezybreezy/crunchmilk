(function() {
  'use strict';

  // Coefficients: [tangential, radial] per 1% MC change
  var species = {
    'red-oak':     [0.00369, 0.00158],
    'white-oak':   [0.00365, 0.00180],
    'hard-maple':  [0.00353, 0.00165],
    'cherry':      [0.00274, 0.00126],
    'walnut':      [0.00274, 0.00190],
    'white-pine':  [0.00216, 0.00071],
    'douglas-fir': [0.00267, 0.00168],
    'poplar':      [0.00282, 0.00149],
    'ash':         [0.00274, 0.00166],
    'mahogany':    [0.00170, 0.00125],
    'teak':        [0.00155, 0.00105],
    'cedar':       [0.00166, 0.00081]
  };

  var chartData = [
    ['Red Oak', '0.00369', '0.00158', '2.33'],
    ['White Oak', '0.00365', '0.00180', '2.03'],
    ['Hard Maple', '0.00353', '0.00165', '2.14'],
    ['Cherry', '0.00274', '0.00126', '2.17'],
    ['Black Walnut', '0.00274', '0.00190', '1.44'],
    ['White Pine', '0.00216', '0.00071', '3.04'],
    ['Douglas Fir', '0.00267', '0.00168', '1.59'],
    ['Mahogany', '0.00170', '0.00125', '1.36'],
    ['Teak', '0.00155', '0.00105', '1.48'],
    ['Western Red Cedar', '0.00166', '0.00081', '2.05']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var sp = document.getElementById('species').value;
    var width = parseFloat(document.getElementById('boardWidth').value);
    var grainDir = document.getElementById('grainDir').value;
    var mcStart = parseFloat(document.getElementById('mcStart').value);
    var mcEnd = parseFloat(document.getElementById('mcEnd').value);

    if (!species[sp] || isNaN(width) || isNaN(mcStart) || isNaN(mcEnd) || width <= 0) return;

    var coeff = grainDir === 'tangential' ? species[sp][0] : species[sp][1];
    var mcChange = mcEnd - mcStart;
    var movement = width * coeff * mcChange;
    var newWidth = width + movement;
    var movementMm = movement * 25.4;

    var direction;
    if (mcChange > 0) direction = 'Expansion';
    else if (mcChange < 0) direction = 'Contraction';
    else direction = 'No change';

    document.getElementById('dimChange').textContent = (movement >= 0 ? '+' : '') + movement.toFixed(4) + '"';
    document.getElementById('newWidth').textContent = newWidth.toFixed(4) + '"';
    document.getElementById('changeMm').textContent = (movementMm >= 0 ? '+' : '') + movementMm.toFixed(2) + ' mm';
    document.getElementById('direction').textContent = direction;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  ['boardWidth', 'mcStart', 'mcEnd'].forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

})();
