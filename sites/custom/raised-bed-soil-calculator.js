(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');
  var bedShape = document.getElementById('bedShape');

  bedShape.addEventListener('change', function() {
    document.getElementById('rectInputs').style.display = bedShape.value === 'rect' ? '' : 'none';
    document.getElementById('circInputs').style.display = bedShape.value === 'circle' ? '' : 'none';
  });

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function calculate() {
    var shape = bedShape.value;
    var depthIn = val('bedDepth');
    var numBeds = Math.max(1, Math.round(val('numBeds')));
    var bagSize = parseFloat(document.getElementById('bagSize').value);
    var depthFt = depthIn / 12;
    var cuFtPer = 0;

    if (shape === 'rect') {
      cuFtPer = val('bedLength') * val('bedWidth') * depthFt;
    } else {
      var r = val('bedDiam') / 2;
      cuFtPer = Math.PI * r * r * depthFt;
    }

    if (cuFtPer <= 0) return;

    var totalCuFt = cuFtPer * numBeds;
    var cuYd = totalCuFt / 27;
    var bags = Math.ceil(totalCuFt / bagSize);
    var weightLbs = totalCuFt * 40; // ~40 lbs per cu ft
    var liters = totalCuFt * 28.3168;
    var gallons = totalCuFt * 7.48052;

    document.getElementById('cuFt').textContent = totalCuFt.toFixed(1) + ' cu ft';
    document.getElementById('cuYd').textContent = cuYd.toFixed(2) + ' cu yd';
    document.getElementById('bags').textContent = bags + ' bags (' + bagSize + ' cu ft each)';
    document.getElementById('weight').textContent = Math.round(weightLbs).toLocaleString() + ' lbs';
    document.getElementById('liters').textContent = Math.round(liters).toLocaleString() + ' L';
    document.getElementById('gallons').textContent = Math.round(gallons).toLocaleString() + ' gal';

    var tip = numBeds > 1
      ? numBeds + ' beds × ' + cuFtPer.toFixed(1) + ' cu ft each'
      : 'Single bed at ' + depthIn + '" deep';
    if (cuYd >= 1) tip += ' · Bulk delivery recommended';
    document.getElementById('resultTip').textContent = tip;

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  document.querySelectorAll('input[type="number"]').forEach(function(el) {
    el.addEventListener('input', calculate);
  });
  bedShape.addEventListener('change', calculate);
  document.getElementById('bagSize').addEventListener('change', calculate);

  calculate();

  // Populate chart
  var tbody = document.querySelector('.chart-table tbody');
  if (tbody) {
    var beds = [
      { name: '4×4 ft', l: 4, w: 4 },
      { name: '4×8 ft', l: 4, w: 8 },
      { name: '4×12 ft', l: 4, w: 12 },
      { name: '3×6 ft', l: 3, w: 6 },
      { name: '2×8 ft', l: 2, w: 8 },
      { name: '6×6 ft', l: 6, w: 6 }
    ];
    beds.forEach(function(b) {
      var cf = b.l * b.w * 1; // 12" depth = 1 ft
      var cy = cf / 27;
      var bags = Math.ceil(cf / 2);
      var tr = document.createElement('tr');
      [b.name, cf.toFixed(1), cy.toFixed(2), bags.toString()].forEach(function(txt) {
        var td = document.createElement('td');
        td.textContent = txt;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
})();
