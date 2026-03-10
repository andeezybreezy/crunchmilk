(function() {
  'use strict';

  var avgScore = document.getElementById('avgScore');
  var basisScore = document.getElementById('basisScore');
  var handicapPct = document.getElementById('handicapPct');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');
  var game1 = document.getElementById('game1');
  var game2 = document.getElementById('game2');
  var game3 = document.getElementById('game3');
  var gameResults = document.getElementById('gameResults');

  function calculate() {
    var avg = parseFloat(avgScore.value);
    var basis = parseFloat(basisScore.value);
    var pct = parseFloat(handicapPct.value) / 100;

    if (isNaN(avg) || avg < 0) return;

    var diff = basis - avg;
    var handicap = diff > 0 ? Math.floor(diff * pct) : 0;
    var adjusted = avg + handicap;

    document.getElementById('handicap').textContent = handicap + ' pins';
    document.getElementById('adjustedScore').textContent = Math.round(adjusted);
    document.getElementById('resultTip').textContent = 'Basis: ' + basis + ', ' + (pct * 100) + '% factor. (' + basis + ' - ' + avg + ') × ' + pct + ' = ' + handicap;

    // Game scores
    var games = [game1, game2, game3];
    var html = '';
    var totalScratch = 0;
    var totalAdj = 0;
    var count = 0;

    games.forEach(function(g, i) {
      var score = parseFloat(g.value);
      if (!isNaN(score) && score >= 0) {
        var adj = score + handicap;
        totalScratch += score;
        totalAdj += adj;
        count++;
        html += '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">' +
          '<span>Game ' + (i + 1) + ': ' + score + '</span>' +
          '<span style="font-weight:700">Adjusted: ' + adj + '</span></div>';
      }
    });

    if (count > 0) {
      html += '<div style="display:flex;justify-content:space-between;padding:12px 0;font-weight:700;font-size:1.1rem">' +
        '<span>Series: ' + totalScratch + ' (scratch)</span>' +
        '<span style="color:var(--primary)">Series: ' + totalAdj + ' (adjusted)</span></div>';
    }

    gameResults.innerHTML = html;
    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  [avgScore, basisScore, handicapPct, game1, game2, game3].forEach(function(el) {
    el.addEventListener('input', calculate);
    el.addEventListener('change', calculate);
  });

  calculate();
})();
