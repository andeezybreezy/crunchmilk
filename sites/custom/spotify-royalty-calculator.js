(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var streams = parseFloat(document.getElementById('streams').value) || 0;
    var perStreamRate = document.getElementById('perStreamRate').value;
    var labelSplit = parseFloat(document.getElementById('labelSplit').value) || 0;
    var monthlyGrowth = parseFloat(document.getElementById('monthlyGrowth').value) || 0;
    var months = parseFloat(document.getElementById('months').value) || 0;

    // Calculation logic
    var rate = parseFloat(perStreamRate);
    var gross = streams * rate;
    var share = gross * (labelSplit / 100);
    var totalStreams = 0;
    var monthlyStreams = streams;
    var growthFactor = 1 + (monthlyGrowth / 100);
    for (var i = 0; i < months; i++) {
      totalStreams += monthlyStreams;
      monthlyStreams = Math.round(monthlyStreams * growthFactor);
    }
    var projRev = totalStreams * rate * (labelSplit / 100);
    var monthlyAvgVal = projRev / months;
    document.getElementById('currentRevenue').textContent = '$' + gross.toFixed(2);
    document.getElementById('yourShare').textContent = '$' + share.toFixed(2);
    document.getElementById('projectedStreams').textContent = totalStreams.toLocaleString();
    document.getElementById('projectedRevenue').textContent = '$' + projRev.toFixed(2);
    document.getElementById('monthlyAvg').textContent = '$' + monthlyAvgVal.toFixed(2) + '/mo';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['streams', 'perStreamRate', 'labelSplit', 'monthlyGrowth', 'months'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
