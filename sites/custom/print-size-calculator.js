(function() {
  'use strict';

  var chartData = [
    ['4×6"', '3:2', '1200 × 1800', '2.2'],
    ['5×7"', '5:7', '1500 × 2100', '3.2'],
    ['8×10"', '4:5', '2400 × 3000', '7.2'],
    ['8×12"', '2:3', '2400 × 3600', '8.6'],
    ['11×14"', '11:14', '3300 × 4200', '13.9'],
    ['12×18"', '2:3', '3600 × 5400', '19.4'],
    ['16×20"', '4:5', '4800 × 6000', '28.8'],
    ['20×30"', '2:3', '6000 × 9000', '54.0']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  var standardSizes = [
    [4, 6], [5, 7], [8, 10], [8, 12], [11, 14], [12, 18], [16, 20], [16, 24], [20, 30], [24, 36]
  ];

  function gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) { var t = b; b = a % b; a = t; }
    return a;
  }

  function calculate() {
    var pw = parseFloat(document.getElementById('pixelWidth').value);
    var ph = parseFloat(document.getElementById('pixelHeight').value);

    if (isNaN(pw) || isNaN(ph) || pw <= 0 || ph <= 0) return;

    var w300 = (pw / 300).toFixed(1);
    var h300 = (ph / 300).toFixed(1);
    var w200 = (pw / 200).toFixed(1);
    var h200 = (ph / 200).toFixed(1);
    var w150 = (pw / 150).toFixed(1);
    var h150 = (ph / 150).toFixed(1);
    var mp = (pw * ph / 1000000).toFixed(1);

    var g = gcd(pw, ph);
    var rw = pw / g;
    var rh = ph / g;
    if (rw > 50) {
      // Simplify approximately
      var g2 = gcd(Math.round(pw / 100), Math.round(ph / 100));
      rw = Math.round(pw / 100) / g2;
      rh = Math.round(ph / 100) / g2;
    }

    // Find best standard print size at 300 DPI
    var imgRatio = Math.max(pw, ph) / Math.min(pw, ph);
    var bestSize = '';
    var bestDiff = Infinity;
    standardSizes.forEach(function(s) {
      var sRatio = s[1] / s[0];
      var diff = Math.abs(imgRatio - sRatio);
      // Also check if image has enough pixels
      var neededW = s[0] * 300;
      var neededH = s[1] * 300;
      var maxPx = Math.max(pw, ph);
      var minPx = Math.min(pw, ph);
      if (minPx >= neededW && maxPx >= neededH && diff < bestDiff) {
        bestDiff = diff;
        bestSize = s[0] + '×' + s[1] + '"';
      }
    });
    if (!bestSize) bestSize = 'Image too small for standard sizes at 300 DPI';

    document.getElementById('size300').textContent = w300 + '" × ' + h300 + '"';
    document.getElementById('size200').textContent = w200 + '" × ' + h200 + '"';
    document.getElementById('size150').textContent = w150 + '" × ' + h150 + '"';
    document.getElementById('aspectRatio').textContent = rw + ':' + rh;
    document.getElementById('megapixels').textContent = mp + ' MP';
    document.getElementById('bestStandard').textContent = bestSize;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  ['pixelWidth', 'pixelHeight'].forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

})();
