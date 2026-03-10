(function() {
  'use strict';

  var chartData = [
    ['NaCl', '58.44', '58.44', '5.84'],
    ['KCl', '74.55', '74.55', '7.46'],
    ['NaOH', '40.00', '40.00', '4.00'],
    ['HCl (37%)', '36.46', '~82 mL', '~8.2 mL'],
    ['Glucose', '180.16', '180.16', '18.02'],
    ['Tris base', '121.14', '121.14', '12.11'],
    ['EDTA', '292.24', '292.24', '29.22'],
    ['CaCl₂', '110.98', '110.98', '11.10']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function toggleFields() {
    var solveFor = document.getElementById('solveFor').value;
    document.getElementById('molarityGroup').style.display = solveFor === 'molarity' ? 'none' : '';
    document.getElementById('molesGroup').style.display = (solveFor === 'moles' || solveFor === 'mass') ? 'none' : '';
    document.getElementById('volumeGroup').style.display = solveFor === 'volume' ? 'none' : '';
    document.getElementById('mwGroup').style.display = solveFor === 'mass' ? '' : 'none';
    // Always show MW for mass calculation, also show if user wants
    if (solveFor !== 'mass') {
      document.getElementById('mwGroup').style.display = '';
    }
  }

  document.getElementById('solveFor').addEventListener('change', toggleFields);
  toggleFields();

  function calculate() {
    var solveFor = document.getElementById('solveFor').value;
    var molarityVal = parseFloat(document.getElementById('molarity').value);
    var molesVal = parseFloat(document.getElementById('moles').value);
    var volumeVal = parseFloat(document.getElementById('volume').value);
    var volUnit = document.getElementById('volUnit').value;
    var mwVal = parseFloat(document.getElementById('mw').value);

    // Convert volume to liters
    var volumeL = volumeVal;
    if (volUnit === 'mL') volumeL = volumeVal / 1000;

    var M, mol, volL, mass;

    switch (solveFor) {
      case 'molarity':
        if (isNaN(molesVal) || isNaN(volumeL) || volumeL <= 0) return;
        M = molesVal / volumeL;
        mol = molesVal;
        volL = volumeL;
        break;
      case 'moles':
        if (isNaN(molarityVal) || isNaN(volumeL) || molarityVal < 0) return;
        mol = molarityVal * volumeL;
        M = molarityVal;
        volL = volumeL;
        break;
      case 'volume':
        if (isNaN(molarityVal) || isNaN(molesVal) || molarityVal <= 0) return;
        volL = molesVal / molarityVal;
        M = molarityVal;
        mol = molesVal;
        break;
      case 'mass':
        if (isNaN(molarityVal) || isNaN(volumeL) || isNaN(mwVal) || mwVal <= 0) return;
        mol = molarityVal * volumeL;
        M = molarityVal;
        volL = volumeL;
        break;
    }

    mass = !isNaN(mwVal) && mwVal > 0 ? mol * mwVal : NaN;

    var fmt = function(v, d) { return isNaN(v) ? '—' : (v < 0.001 ? v.toExponential(3) : v.toFixed(d || 4)); };

    document.getElementById('resMolarity').textContent = fmt(M, 4) + ' M';
    document.getElementById('resMoles').textContent = fmt(mol, 6) + ' mol';

    if (volL >= 1) {
      document.getElementById('resVolume').textContent = fmt(volL, 4) + ' L';
    } else {
      document.getElementById('resVolume').textContent = fmt(volL * 1000, 2) + ' mL';
    }

    document.getElementById('resMass').textContent = isNaN(mass) ? 'Enter MW' : fmt(mass, 4) + ' g';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  ['molarity', 'moles', 'volume', 'mw'].forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

})();
