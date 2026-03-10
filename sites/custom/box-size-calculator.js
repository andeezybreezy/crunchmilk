(function() {
  'use strict';

  var chartData = [
    ['6×4×4"', '96', '1 lb', 'Small items, jewelry'],
    ['8×6×4"', '192', '2 lbs', 'Books, small electronics'],
    ['10×8×6"', '480', '4 lbs', 'Shoes, medium items'],
    ['12×10×8"', '960', '7 lbs', 'Clothing, home goods'],
    ['14×12×10"', '1,680', '13 lbs', 'Multiple items, gifts'],
    ['18×14×12"', '3,024', '22 lbs', 'Large electronics'],
    ['24×18×12"', '5,184', '38 lbs', 'Bulk items, equipment'],
    ['24×24×24"', '13,824', '100 lbs', 'Large/bulky items']
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
    var l = parseFloat(document.getElementById('boxLength').value);
    var w = parseFloat(document.getElementById('boxWidth').value);
    var h = parseFloat(document.getElementById('boxHeight').value);
    var actualWt = parseFloat(document.getElementById('actualWeight').value);
    var dimFactor = parseFloat(document.getElementById('carrier').value);

    if (isNaN(l) || isNaN(w) || isNaN(h) || l <= 0 || w <= 0 || h <= 0) return;

    var volume = l * w * h;
    var dimWeight = Math.ceil(volume / dimFactor);
    var cuFt = (volume / 1728).toFixed(2);

    // Girth + Length: length is longest side
    var dims = [l, w, h].sort(function(a, b) { return b - a; });
    var longest = dims[0];
    var girth = 2 * dims[1] + 2 * dims[2];
    var girthPlusLength = girth + longest;

    var billWeight, billedBy;
    if (!isNaN(actualWt) && actualWt > 0) {
      billWeight = Math.max(Math.ceil(actualWt), dimWeight);
      billedBy = dimWeight > actualWt ? 'DIM Weight' : 'Actual Weight';
    } else {
      billWeight = dimWeight;
      billedBy = 'Enter actual weight';
    }

    document.getElementById('dimWeight').textContent = dimWeight + ' lbs';
    document.getElementById('billWeight').textContent = billWeight + ' lbs';
    document.getElementById('volume').textContent = Math.round(volume).toLocaleString() + ' cu in';
    document.getElementById('girthLength').textContent = girthPlusLength.toFixed(1) + '"' + (girthPlusLength > 165 ? ' ⚠ Over limit!' : '');
    document.getElementById('cuFt').textContent = cuFt + ' cu ft';
    document.getElementById('billedBy').textContent = billedBy;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  ['boxLength', 'boxWidth', 'boxHeight', 'actualWeight'].forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

})();
