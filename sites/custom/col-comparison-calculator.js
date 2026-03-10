(function() {
  'use strict';

  // City indices: [overall, housing, food, transport, healthcare, utilities]
  // National average = 100 for each category
  var cityData = {
    nyc: { name: 'New York City', idx: [187, 282, 115, 130, 110, 125] },
    sf:  { name: 'San Francisco', idx: [179, 267, 112, 128, 115, 108] },
    la:  { name: 'Los Angeles',   idx: [146, 208, 106, 125, 105, 103] },
    chi: { name: 'Chicago',       idx: [107, 115, 104, 110, 102, 98] },
    hou: { name: 'Houston',       idx: [94,  78,  95,  100, 96,  105] },
    phx: { name: 'Phoenix',       idx: [103, 108, 98,  100, 97,  106] },
    dal: { name: 'Dallas',        idx: [97,  88,  96,  98,  100, 104] },
    atl: { name: 'Atlanta',       idx: [102, 98,  100, 105, 103, 97] },
    mia: { name: 'Miami',         idx: [123, 160, 105, 108, 102, 104] },
    den: { name: 'Denver',        idx: [128, 155, 103, 105, 104, 92] },
    sea: { name: 'Seattle',       idx: [149, 205, 110, 120, 108, 95] },
    bos: { name: 'Boston',        idx: [152, 210, 108, 112, 118, 115] },
    nas: { name: 'Nashville',     idx: [100, 100, 96,  98,  94,  96] },
    aus: { name: 'Austin',        idx: [111, 125, 98,  100, 97,  102] },
    ral: { name: 'Raleigh',       idx: [98,  95,  97,  96,  100, 97] },
    min: { name: 'Minneapolis',   idx: [105, 108, 103, 102, 106, 94] },
    det: { name: 'Detroit',       idx: [89,  72,  96,  105, 98,  102] },
    slc: { name: 'Salt Lake City',idx: [104, 110, 98,  98,  96,  90] },
    por: { name: 'Portland',      idx: [130, 162, 105, 112, 103, 93] },
    nat: { name: 'National Avg',  idx: [100, 100, 100, 100, 100, 100] }
  };

  // Category weights for overall composite
  var weights = [0.35, 0.15, 0.15, 0.10, 0.10];
  var labels = ['Housing', 'Food', 'Transport', 'Healthcare', 'Utilities'];

  var currentCity = document.getElementById('currentCity');
  var targetCity = document.getElementById('targetCity');
  var currentSalary = document.getElementById('currentSalary');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function fmtPct(val) {
    var sign = val >= 0 ? '+' : '';
    return sign + val.toFixed(1) + '%';
  }

  function calculate() {
    var from = cityData[currentCity.value];
    var to = cityData[targetCity.value];
    var salary = parseFloat(currentSalary.value);

    if (!from || !to || isNaN(salary) || salary <= 0) return;

    // Calculate weighted overall index
    var fromOverall = from.idx[0];
    var toOverall = to.idx[0];
    var overallDiff = ((toOverall - fromOverall) / fromOverall) * 100;
    var equivSalary = Math.round(salary * (toOverall / fromOverall));
    var annualDiff = equivSalary - salary;

    // Category differences
    var catDiffs = [];
    for (var i = 1; i <= 5; i++) {
      catDiffs.push(((to.idx[i] - from.idx[i]) / from.idx[i]) * 100);
    }

    var diffColor = function(val) { return val <= 0 ? '#16a34a' : '#dc2626'; };

    document.getElementById('rOverall').textContent = fmtPct(overallDiff);
    document.getElementById('rOverall').style.color = diffColor(overallDiff);
    document.getElementById('rSalary').textContent = '$' + equivSalary.toLocaleString();
    document.getElementById('rHousing').textContent = fmtPct(catDiffs[0]);
    document.getElementById('rHousing').style.color = diffColor(catDiffs[0]);
    document.getElementById('rFood').textContent = fmtPct(catDiffs[1]);
    document.getElementById('rFood').style.color = diffColor(catDiffs[1]);
    document.getElementById('rTransport').textContent = fmtPct(catDiffs[2]);
    document.getElementById('rTransport').style.color = diffColor(catDiffs[2]);
    document.getElementById('rHealth').textContent = fmtPct(catDiffs[3]);
    document.getElementById('rHealth').style.color = diffColor(catDiffs[3]);
    document.getElementById('rUtilities').textContent = fmtPct(catDiffs[4]);
    document.getElementById('rUtilities').style.color = diffColor(catDiffs[4]);

    var annualSign = annualDiff >= 0 ? '+' : '';
    document.getElementById('rAnnualDiff').textContent = annualSign + '$' + Math.abs(Math.round(annualDiff)).toLocaleString() + '/yr';
    document.getElementById('rAnnualDiff').style.color = diffColor(annualDiff);

    var cheaper = overallDiff < 0;
    document.getElementById('resultTip').textContent = to.name + ' is ' + Math.abs(overallDiff).toFixed(1) + '% ' + (cheaper ? 'cheaper' : 'more expensive') + ' than ' + from.name + '. You\'d need $' + equivSalary.toLocaleString() + ' in ' + to.name + ' to match your $' + salary.toLocaleString() + ' lifestyle in ' + from.name + '.';

    result.classList.add('visible');
  }

  // Populate chart tbody if exists
  var tbody = document.querySelector('.chart-table tbody');
  if (tbody) {
    tbody.innerHTML = '';
    var chartCities = ['nyc','sf','bos','sea','la','den','mia','aus','chi','atl','dal','hou'];
    chartCities.forEach(function(key) {
      var c = cityData[key];
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + c.name + '</td><td>' + c.idx[0] + '</td><td>' + c.idx[1] + '</td><td>' + c.idx[2] + '</td><td>' + c.idx[3] + '</td><td>' + c.idx[4] + '</td>';
      tbody.appendChild(tr);
    });
  }

  calcBtn.addEventListener('click', calculate);
  [currentCity, targetCity, currentSalary].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

  calculate();
})();
