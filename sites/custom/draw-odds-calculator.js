(function() {
  'use strict';

  function calculate() {
    var totalApplicants = parseInt(document.getElementById('totalApplicants').value);
    var totalTags = parseInt(document.getElementById('totalTags').value);
    var yourPoints = parseInt(document.getElementById('yourPoints').value) || 0;
    var system = document.getElementById('pointSystem').value;

    if (isNaN(totalApplicants) || isNaN(totalTags) || totalApplicants <= 0 || totalTags <= 0) return;

    var baseOdds = Math.min(totalTags / totalApplicants, 1);
    var yourOdds = 0;
    var avgPoints = 2; // assumed average points in pool

    if (system === 'random') {
      yourOdds = baseOdds;
    } else if (system === 'preference') {
      // Preference: estimate how many people have more points
      // Simplified model: assume roughly even distribution 0 to max points seen
      var maxPoints = Math.max(yourPoints + 5, 15);
      // People at each level: roughly totalApplicants / (maxPoints+1)
      var perLevel = totalApplicants / (maxPoints + 1);
      var aheadOfYou = 0;
      for (var p = maxPoints; p > yourPoints; p--) {
        aheadOfYou += perLevel;
      }
      // If tags > ahead, you draw
      if (totalTags > aheadOfYou) {
        var remainingTags = totalTags - aheadOfYou;
        yourOdds = Math.min(remainingTags / perLevel, 1);
      } else {
        yourOdds = 0.001; // very unlikely
      }
    } else if (system === 'bonus') {
      // Bonus: weighted random, entries = points + 1
      // Estimate total entries: sum of (points+1) for all applicants
      // Assume average points ~avgPoints
      var totalEntries = totalApplicants * (avgPoints + 1);
      var yourEntries = yourPoints + 1;
      // Replace your entry in the pool
      totalEntries = totalEntries - (avgPoints + 1) + yourEntries;
      // Draw probability (without replacement, simplified)
      yourOdds = 1 - Math.pow(1 - yourEntries / totalEntries, totalTags);
      yourOdds = Math.min(yourOdds, 1);
    }

    var yearsToDraw = yourOdds > 0 ? Math.round(1 / yourOdds) : 999;
    if (yourOdds >= 1) yearsToDraw = 1;

    var pctStr = (yourOdds * 100).toFixed(1) + '%';
    if (yourOdds >= 1) pctStr = '~100%';
    if (yourOdds < 0.001) pctStr = '<0.1%';

    document.getElementById('drawOdds').textContent = pctStr;
    document.getElementById('yearsToDraw').textContent = yourOdds > 0 ? '~' + yearsToDraw + ' years' : 'N/A';
    document.getElementById('baseOdds').textContent = (baseOdds * 100).toFixed(1) + '%';

    var multiplier = baseOdds > 0 ? (yourOdds / baseOdds) : 0;
    document.getElementById('pointAdvantage').textContent = system === 'random' ? 'None (random draw)' : multiplier.toFixed(1) + 'x base odds';

    // Build comparison table
    var tbody = document.getElementById('oddsBody');
    tbody.innerHTML = '';
    var maxShow = Math.max(yourPoints + 5, 10);
    for (var pt = 0; pt <= maxShow; pt++) {
      var odds = 0;
      if (system === 'random') {
        odds = baseOdds;
      } else if (system === 'preference') {
        var mxP = Math.max(maxShow + 3, 15);
        var pL = totalApplicants / (mxP + 1);
        var ahead = 0;
        for (var pp = mxP; pp > pt; pp--) { ahead += pL; }
        if (totalTags > ahead) {
          var rem = totalTags - ahead;
          odds = Math.min(rem / pL, 1);
        } else {
          odds = 0.001;
        }
      } else {
        var tE = totalApplicants * (avgPoints + 1);
        var yE = pt + 1;
        tE = tE - (avgPoints + 1) + yE;
        odds = 1 - Math.pow(1 - yE / tE, totalTags);
        odds = Math.min(odds, 1);
      }
      var yrs = odds > 0 ? Math.round(1 / odds) : 999;
      if (odds >= 1) yrs = 1;

      var tr = document.createElement('tr');
      if (pt === yourPoints) tr.style.fontWeight = 'bold';
      var oddsStr = (odds * 100).toFixed(1) + '%';
      if (odds >= 1) oddsStr = '~100%';
      if (odds < 0.001) oddsStr = '<0.1%';
      tr.innerHTML =
        '<td>' + pt + (pt === yourPoints ? ' (you)' : '') + '</td>' +
        '<td>' + oddsStr + '</td>' +
        '<td>~' + yrs + '</td>';
      tbody.appendChild(tr);
    }

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('.calc-card input');
  inputs.forEach(function(inp) {
    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
