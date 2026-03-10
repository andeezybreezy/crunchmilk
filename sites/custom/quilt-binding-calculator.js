(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v <= 0 ? 0 : v;
  }

  function calculate() {
    var quiltW = val('quiltW');
    var quiltH = val('quiltH');
    var bindType = document.getElementById('bindType').value;
    var stripWidth = val('stripWidth');
    var fabricWidth = val('fabricWidth');

    if (quiltW <= 0 || quiltH <= 0 || stripWidth <= 0 || fabricWidth <= 0) return;

    var perimeter = 2 * (quiltW + quiltH);
    var extra = 12; // extra for corners and joining
    var totalBinding = perimeter + extra;

    // Usable strip length from WOF (subtract ~2" for selvage and trimming)
    var usableWof = fabricWidth - 2;
    var numStrips = Math.ceil(totalBinding / usableWof);

    // Fabric needed in inches
    var fabricInches = numStrips * stripWidth;
    var yardage = fabricInches / 36;

    // Finished binding width
    var finishedWidth;
    if (bindType === 'double') {
      finishedWidth = stripWidth / 4; // folded in half, then each half folds in
    } else {
      finishedWidth = stripWidth / 2 - 0.25; // single fold minus seam
    }

    document.getElementById('perimeter').textContent = perimeter.toFixed(0) + '"';
    document.getElementById('totalBinding').textContent = totalBinding.toFixed(0) + '"';
    document.getElementById('numStrips').textContent = numStrips + ' strips at ' + stripWidth + '"';
    document.getElementById('yardage').textContent = yardage.toFixed(2) + ' yards';
    document.getElementById('finishedWidth').textContent = '~' + finishedWidth.toFixed(2) + '"';
    document.getElementById('fabricInches').textContent = fabricInches.toFixed(1) + '"';

    var label = bindType === 'double' ? 'Double-fold' : 'Single-fold';
    document.getElementById('resultTip').textContent =
      label + ' binding · ' + numStrips + ' strips × ' + usableWof + '" = ' +
      (numStrips * usableWof).toFixed(0) + '" total strip length';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  document.querySelectorAll('input[type="number"]').forEach(function(el) {
    el.addEventListener('input', calculate);
  });
  document.getElementById('bindType').addEventListener('change', calculate);

  calculate();

  // Populate chart
  var tbody = document.querySelector('.chart-table tbody');
  if (tbody) {
    var quilts = [
      { name: 'Baby (36×52)', w: 36, h: 52 },
      { name: 'Throw (50×65)', w: 50, h: 65 },
      { name: 'Twin (65×87)', w: 65, h: 87 },
      { name: 'Full (80×87)', w: 80, h: 87 },
      { name: 'Queen (88×92)', w: 88, h: 92 },
      { name: 'King (105×92)', w: 105, h: 92 }
    ];
    var stripW = 2.5;
    var wof = 40; // usable
    quilts.forEach(function(q) {
      var perim = 2 * (q.w + q.h);
      var total = perim + 12;
      var strips = Math.ceil(total / wof);
      var yd = (strips * stripW / 36).toFixed(2);
      var tr = document.createElement('tr');
      [q.name, perim + '"', total + '"', strips.toString(), yd].forEach(function(txt) {
        var td = document.createElement('td');
        td.textContent = txt;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
})();
