(function() {
  'use strict';

  var chartData = [
    ['500 sq ft', '5,297', '7,946', '10,594', '13,243'],
    ['1,000 sq ft', '10,594', '15,891', '21,188', '26,485'],
    ['1,500 sq ft', '15,891', '23,837', '31,782', '39,728'],
    ['2,000 sq ft', '21,188', '31,782', '42,376', '52,970'],
    ['2,500 sq ft', '26,485', '39,728', '52,970', '66,213'],
    ['3,000 sq ft', '31,782', '47,673', '63,564', '79,455']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td><td>' + row[4] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var roofArea = parseFloat(document.getElementById('roofArea').value);
    var rainfall = parseFloat(document.getElementById('rainfall').value);
    var efficiency = parseFloat(document.getElementById('efficiency').value);
    var waterCost = parseFloat(document.getElementById('waterCost').value);

    if (isNaN(roofArea) || isNaN(rainfall) || roofArea <= 0 || rainfall <= 0) return;

    // 0.623 gallons per sq ft per inch of rain
    var rawGallons = roofArea * rainfall * 0.623;
    var annualGallons = rawGallons * efficiency;
    var monthlyGallons = annualGallons / 12;
    var perInchGallons = roofArea * 0.623 * efficiency;
    var liters = annualGallons * 3.78541;
    var barrels = annualGallons / 55;

    var savings = '';
    if (!isNaN(waterCost) && waterCost > 0) {
      savings = '$' + (annualGallons / 1000 * waterCost).toFixed(2) + '/yr';
    } else {
      savings = 'Enter water cost';
    }

    document.getElementById('annualGallons').textContent = Math.round(annualGallons).toLocaleString() + ' gal';
    document.getElementById('monthlyGallons').textContent = Math.round(monthlyGallons).toLocaleString() + ' gal';
    document.getElementById('perInch').textContent = Math.round(perInchGallons).toLocaleString() + ' gal';
    document.getElementById('savings').textContent = savings;
    document.getElementById('liters').textContent = Math.round(liters).toLocaleString() + ' L';
    document.getElementById('barrels').textContent = Math.round(barrels).toLocaleString() + ' barrels';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  ['roofArea', 'rainfall', 'waterCost'].forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

})();
