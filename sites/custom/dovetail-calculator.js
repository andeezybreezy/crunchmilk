(function() {
  'use strict';

  var chartData = [
    ['3"', '2', '0.94"', '0.38"'],
    ['4"', '2', '1.31"', '0.50"'],
    ['5"', '3', '1.06"', '0.44"'],
    ['6"', '3', '1.31"', '0.53"'],
    ['8"', '4', '1.31"', '0.54"'],
    ['10"', '5', '1.31"', '0.55"'],
    ['12"', '6', '1.31"', '0.55"'],
    ['16"', '8', '1.31"', '0.55"']
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
    var boardWidth = parseFloat(document.getElementById('boardWidth').value);
    var numTails = parseInt(document.getElementById('numTails').value, 10);
    var ratio = parseInt(document.getElementById('ratio').value, 10);
    var halfPinRatio = parseFloat(document.getElementById('halfPinRatio').value);
    var thickness = parseFloat(document.getElementById('boardThickness').value);

    if (isNaN(boardWidth) || isNaN(numTails) || boardWidth <= 0 || numTails < 1) return;

    var angle = Math.atan(1 / ratio) * (180 / Math.PI);
    var numPins = numTails - 1; // full pins between tails

    // Layout: halfPin + tail + pin + tail + ... + tail + halfPin
    // 2 half-pins + numTails tails + (numTails - 1) full pins = board width
    // Let tail narrow-face = T, pin narrow-face = P, half-pin = H
    // H = halfPinRatio * T
    // Total = 2*H + numTails*T + numPins*P
    // For even spacing with equal-width pins: P = some fraction of T
    // Traditional: pins are about 1/3 to 1/2 of tail width at narrow face

    // Simple approach: distribute evenly
    // Total spaces = numTails + numPins + 2 half-pins (as fraction)
    // Effective units = 2*halfPinRatio + numTails + numPins * pinFraction
    // Let's use pin = half of the remaining after half-pins and tails

    // Better approach: equal spacing between centers
    // Board = 2*halfPin + numTails*tailWidth + numPins*pinWidth
    // With pinWidth proportional to tailWidth
    // Assume pinWidth = tailWidth * 0.4 (narrow pins common)

    var pinFraction = 0.4;
    var effectiveUnits = 2 * halfPinRatio + numTails + numPins * pinFraction;
    var tailWidth = boardWidth / effectiveUnits;
    var pinWidth = tailWidth * pinFraction;
    var halfPinWidth = tailWidth * halfPinRatio;

    // Verify total
    var total = 2 * halfPinWidth + numTails * tailWidth + numPins * pinWidth;

    document.getElementById('tailWidth').textContent = tailWidth.toFixed(4) + '"';
    document.getElementById('pinWidth').textContent = numPins > 0 ? pinWidth.toFixed(4) + '"' : 'N/A (1 tail)';
    document.getElementById('halfPin').textContent = halfPinWidth.toFixed(4) + '"';
    document.getElementById('angle').textContent = angle.toFixed(1) + '° (1:' + ratio + ')';
    document.getElementById('jointDepth').textContent = (!isNaN(thickness) && thickness > 0) ? thickness + '"' : 'Enter thickness';
    document.getElementById('pinsTails').textContent = (numPins + 2) + ' pins, ' + numTails + ' tails';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  ['boardWidth', 'numTails', 'boardThickness'].forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

})();
