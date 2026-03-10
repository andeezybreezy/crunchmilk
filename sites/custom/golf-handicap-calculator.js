(function() {
  'use strict';

  var chartData = [
    ['5', '1 (lowest)', '−2.0 from differential'],
    ['6', '2 lowest', '−1.0 from average'],
    ['7–8', '2 lowest', 'None'],
    ['9–11', '3 lowest', 'None'],
    ['12–14', '4 lowest', 'None'],
    ['15–16', '5 lowest', 'None'],
    ['17–18', '6 lowest', 'None'],
    ['19', '7 lowest', 'None'],
    ['20', '8 lowest', 'None']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  var roundCount = 5;

  document.getElementById('addRoundBtn').addEventListener('click', function() {
    if (roundCount >= 20) return;
    roundCount++;
    var container = document.getElementById('roundsContainer');
    var div = document.createElement('div');
    div.className = 'input-group round-entry';
    div.setAttribute('data-round', roundCount);
    div.innerHTML = '<label>Round ' + roundCount + '</label>' +
      '<div class="input-row" style="gap:0.5rem">' +
      '<input type="number" class="round-score" placeholder="Score" min="50" max="150" inputmode="numeric" style="flex:1">' +
      '<input type="number" class="round-rating" placeholder="Rating" min="55" max="80" step="0.1" inputmode="decimal" style="flex:1">' +
      '<input type="number" class="round-slope" placeholder="Slope" min="55" max="155" inputmode="numeric" style="flex:1">' +
      '</div>';
    container.appendChild(div);
  });

  function getDiffCount(n) {
    if (n <= 5) return 1;
    if (n <= 6) return 2;
    if (n <= 8) return 2;
    if (n <= 11) return 3;
    if (n <= 14) return 4;
    if (n <= 16) return 5;
    if (n <= 18) return 6;
    if (n === 19) return 7;
    return 8;
  }

  function getAdjustment(n) {
    if (n === 5) return -2.0;
    if (n === 6) return -1.0;
    return 0;
  }

  function calculate() {
    var entries = document.querySelectorAll('.round-entry');
    var differentials = [];

    entries.forEach(function(entry) {
      var score = parseFloat(entry.querySelector('.round-score').value);
      var rating = parseFloat(entry.querySelector('.round-rating').value);
      var slope = parseFloat(entry.querySelector('.round-slope').value);

      if (!isNaN(score) && !isNaN(rating) && !isNaN(slope) && slope > 0) {
        var diff = (score - rating) * 113 / slope;
        differentials.push(Math.round(diff * 10) / 10);
      }
    });

    if (differentials.length < 5) {
      alert('Please enter at least 5 complete rounds (score, rating, and slope).');
      return;
    }

    differentials.sort(function(a, b) { return a - b; });

    var useCount = getDiffCount(differentials.length);
    var best = differentials.slice(0, useCount);
    var sum = best.reduce(function(a, b) { return a + b; }, 0);
    var avg = sum / useCount;
    var adjustment = getAdjustment(differentials.length);
    var handicap = (avg + adjustment) * 0.96;

    if (handicap < 0) handicap = 0;
    if (handicap > 54) handicap = 54;

    document.getElementById('handicapIndex').textContent = handicap.toFixed(1);
    document.getElementById('roundsUsed').textContent = useCount + ' of ' + differentials.length;
    document.getElementById('bestDiff').textContent = differentials[0].toFixed(1);
    document.getElementById('avgDiff').textContent = avg.toFixed(1);

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

})();
