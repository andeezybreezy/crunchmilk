(function() {
  'use strict';

  var chartData = [
    ['12 M HCl', '1 M', '500 mL', '41.7 mL'],
    ['10 M NaOH', '0.1 M', '1 L', '10 mL'],
    ['18 M H₂SO₄', '2 M', '250 mL', '27.8 mL'],
    ['100 mg/mL', '1 mg/mL', '100 mL', '1 mL'],
    ['70% Ethanol', '10%', '500 mL', '71.4 mL'],
    ['5 M NaCl', '0.15 M', '1 L', '30 mL'],
    ['1 M Tris', '50 mM', '200 mL', '10 mL'],
    ['10× PBS', '1×', '1 L', '100 mL']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function toML(val, unit) {
    if (unit === 'L') return val * 1000;
    if (unit === 'µL') return val / 1000;
    return val;
  }

  function fromML(ml, unit) {
    if (unit === 'L') return ml / 1000;
    if (unit === 'µL') return ml * 1000;
    return ml;
  }

  function calculate() {
    var c1Raw = document.getElementById('c1').value.trim();
    var v1Raw = document.getElementById('v1').value.trim();
    var c2Raw = document.getElementById('c2').value.trim();
    var v2Raw = document.getElementById('v2').value.trim();

    var blanks = [c1Raw === '', v1Raw === '', c2Raw === '', v2Raw === ''];
    var blankCount = blanks.filter(Boolean).length;

    if (blankCount !== 1) {
      alert('Please leave exactly one field blank to solve for it.');
      return;
    }

    var c1 = parseFloat(c1Raw);
    var v1 = parseFloat(v1Raw);
    var c2 = parseFloat(c2Raw);
    var v2 = parseFloat(v2Raw);

    var v1Unit = document.getElementById('v1Unit').value;
    var v2Unit = document.getElementById('v2Unit').value;

    // Convert volumes to mL for calculation
    if (!blanks[1]) v1 = toML(v1, v1Unit);
    if (!blanks[3]) v2 = toML(v2, v2Unit);

    var solvedLabel = '';
    var solvedVal = 0;
    var solvedUnit = '';

    if (blanks[0]) {
      // Solve for C1
      c1 = (c2 * v2) / v1;
      solvedLabel = 'C1';
      solvedVal = c1;
      solvedUnit = document.getElementById('c1Unit').value;
    } else if (blanks[1]) {
      // Solve for V1
      v1 = (c2 * v2) / c1;
      solvedVal = fromML(v1, v1Unit);
      solvedLabel = 'V1';
      solvedUnit = v1Unit;
    } else if (blanks[2]) {
      // Solve for C2
      c2 = (c1 * v1) / v2;
      solvedLabel = 'C2';
      solvedVal = c2;
      solvedUnit = document.getElementById('c2Unit').value;
    } else {
      // Solve for V2
      v2 = (c1 * v1) / c2;
      solvedVal = fromML(v2, v2Unit);
      solvedLabel = 'V2';
      solvedUnit = v2Unit;
    }

    // Solvent to add = V2 - V1 (both in mL)
    var solventML = v2 - v1;
    var dilutionFactor = c1 / c2;

    var precision = solvedVal < 1 ? 4 : solvedVal < 100 ? 2 : 1;
    document.getElementById('solvedValue').textContent = solvedLabel + ' = ' + solvedVal.toFixed(precision) + ' ' + solvedUnit;
    document.getElementById('solventAdd').textContent = solventML > 0 ? solventML.toFixed(2) + ' mL' : 'N/A';
    document.getElementById('dilutionFactor').textContent = dilutionFactor.toFixed(2) + '×';
    document.getElementById('eqCheck').textContent = (c1 * v1).toFixed(2) + ' = ' + (c2 * v2).toFixed(2);

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  ['c1', 'v1', 'c2', 'v2'].forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

})();
