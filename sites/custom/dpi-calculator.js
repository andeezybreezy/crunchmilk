(function() {
  'use strict';

  var chartData = [
    ['4×6"', '1200', '1800', '2.2 MP'],
    ['5×7"', '1500', '2100', '3.2 MP'],
    ['8×10"', '2400', '3000', '7.2 MP'],
    ['11×14"', '3300', '4200', '13.9 MP'],
    ['16×20"', '4800', '6000', '28.8 MP'],
    ['20×24"', '6000', '7200', '43.2 MP'],
    ['24×36"', '7200', '10800', '77.8 MP'],
    ['30×40"', '9000', '12000', '108 MP']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) { var t = b; b = a % b; a = t; }
    return a;
  }

  function getQuality(dpi) {
    if (dpi >= 300) return 'Excellent';
    if (dpi >= 200) return 'Good';
    if (dpi >= 150) return 'Acceptable';
    if (dpi >= 100) return 'Low';
    return 'Poor';
  }

  function calculate() {
    var imgW = parseFloat(document.getElementById('imgWidth').value);
    var imgH = parseFloat(document.getElementById('imgHeight').value);
    var printW = parseFloat(document.getElementById('printWidth').value);
    var printH = parseFloat(document.getElementById('printHeight').value);

    if (isNaN(imgW) || isNaN(imgH) || isNaN(printW) || isNaN(printH) ||
        imgW <= 0 || imgH <= 0 || printW <= 0 || printH <= 0) return;

    var hDpi = Math.round(imgW / printW);
    var vDpi = Math.round(imgH / printH);
    var effDpi = Math.min(hDpi, vDpi);
    var megapixels = (imgW * imgH / 1000000).toFixed(1);

    var g = gcd(imgW, imgH);
    var ratioW = imgW / g;
    var ratioH = imgH / g;
    if (ratioW > 100) {
      var g2 = gcd(Math.round(imgW / 100), Math.round(imgH / 100));
      ratioW = Math.round(imgW / 100) / g2;
      ratioH = Math.round(imgH / 100) / g2;
    }

    document.getElementById('hDpi').textContent = hDpi + ' DPI';
    document.getElementById('vDpi').textContent = vDpi + ' DPI';
    document.getElementById('effDpi').textContent = effDpi + ' DPI';
    document.getElementById('quality').textContent = getQuality(effDpi);
    document.getElementById('megapixels').textContent = megapixels + ' MP';
    document.getElementById('aspectRatio').textContent = ratioW + ':' + ratioH;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  var inputs = ['imgWidth', 'imgHeight', 'printWidth', 'printHeight'];
  inputs.forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

})();
