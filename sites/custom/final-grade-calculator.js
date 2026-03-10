(function() {
  'use strict';

  var chartData = [
    ['95%', '70.0%', '20.0%', '—'],
    ['90%', '90.0%', '40.0%', '—'],
    ['85%', '110.0% ✗', '60.0%', '10.0%'],
    ['80%', '130.0% ✗', '80.0%', '30.0%'],
    ['75%', '150.0% ✗', '100.0%', '50.0%'],
    ['70%', '170.0% ✗', '120.0% ✗', '70.0%'],
    ['65%', '190.0% ✗', '140.0% ✗', '90.0%'],
    ['60%', '210.0% ✗', '160.0% ✗', '110.0% ✗']
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
    var current = parseFloat(document.getElementById('currentGrade').value);
    var weight = parseFloat(document.getElementById('finalWeight').value) / 100;
    var desired = parseFloat(document.getElementById('desiredGrade').value);

    if (isNaN(current) || isNaN(weight) || isNaN(desired) || weight <= 0 || weight > 1) return;

    var needed = (desired - current * (1 - weight)) / weight;
    var maxFinal = current * (1 - weight) + 100 * weight;
    var minFinal = current * (1 - weight);

    var feasibility;
    if (needed <= 0) feasibility = 'Already achieved!';
    else if (needed <= 90) feasibility = 'Very achievable';
    else if (needed <= 100) feasibility = 'Achievable';
    else feasibility = 'Not possible without extra credit';

    document.getElementById('neededGrade').textContent = needed.toFixed(1) + '%';
    document.getElementById('feasibility').textContent = feasibility;
    document.getElementById('maxGrade').textContent = maxFinal.toFixed(1) + '%';
    document.getElementById('minGrade').textContent = minFinal.toFixed(1) + '%';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  ['currentGrade', 'finalWeight', 'desiredGrade'].forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

})();
