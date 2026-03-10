(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  // Coverage per roll/bag in sq ft by R-value and spacing
  var coverageData = {
    '11': { '16': 40, '24': 48, thickness: '3.5"', battW16: '15"', battW24: '23"' },
    '13': { '16': 40, '24': 48, thickness: '3.5"', battW16: '15"', battW24: '23"' },
    '15': { '16': 40, '24': 48, thickness: '3.5"', battW16: '15"', battW24: '23"' },
    '19': { '16': 62, '24': 75, thickness: '6.25"', battW16: '15"', battW24: '23"' },
    '21': { '16': 58, '24': 70, thickness: '5.5"', battW16: '15"', battW24: '23"' },
    '30': { '16': 31, '24': 42, thickness: '10"', battW16: '16"', battW24: '24"' },
    '38': { '16': 24, '24': 33, thickness: '12"', battW16: '16"', battW24: '24"' },
    '49': { '16': 18, '24': 24, thickness: '16"', battW16: '16"', battW24: '24"' }
  };

  var areaTypeEl = document.getElementById('areaType');
  var totalAreaEl = document.getElementById('totalArea');
  var rValueEl = document.getElementById('rValue');
  var spacingEl = document.getElementById('studSpacing');
  var priceEl = document.getElementById('battPrice');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['R-11', '3.5"', '2×4 wall', '40', '25'],
    ['R-13', '3.5"', '2×4 wall', '40', '25'],
    ['R-15', '3.5"', '2×4 wall', '40', '25'],
    ['R-19', '6.25"', '2×6 wall', '62', '17'],
    ['R-30', '10"', 'Attic', '31', '33'],
    ['R-38', '12"', 'Attic', '24', '42']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getVal(el) { var v = parseFloat(el.value); return isNaN(v) ? 0 : v; }

  function calculate() {
    var area = getVal(totalAreaEl);
    var rVal = rValueEl.value;
    var spacing = spacingEl.value;
    var price = getVal(priceEl);

    if (area <= 0) return;

    var data = coverageData[rVal];
    if (!data) return;

    var coveragePerPkg = data[spacing] || data['16'];
    var rolls = Math.ceil(area / coveragePerPkg);
    var totalCoverage = rolls * coveragePerPkg;
    var battWidth = spacing === '24' ? data.battW24 : data.battW16;
    var thickness = data.thickness;
    var cost = rolls * price;

    document.getElementById('rRolls').textContent = fmt(rolls, 0);
    document.getElementById('rCoverage').textContent = fmt(coveragePerPkg, 0) + ' sq ft';
    document.getElementById('rThickness').textContent = thickness;
    document.getElementById('rWidth').textContent = battWidth;
    document.getElementById('rTotalCov').textContent = fmt(totalCoverage, 0) + ' sq ft';
    document.getElementById('rCost').textContent = '$' + fmt(cost, 0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [areaTypeEl, totalAreaEl, rValueEl, spacingEl, priceEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
