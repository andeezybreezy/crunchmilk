(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var totalPrize = parseFloat(document.getElementById('totalPrize').value) || 0;
    var teams = parseFloat(document.getElementById('teams').value) || 0;
    var teamSize = parseFloat(document.getElementById('teamSize').value) || 0;
    var orgCut = parseFloat(document.getElementById('orgCut').value) || 0;

    // Calculation logic
    var shares = [];
    var total = 0;
    for (var i = 0; i < teams; i++) { var s = Math.pow(2, teams - 1 - i); shares.push(s); total += s; }
    var first = totalPrize * (shares[0] / total);
    var second = totalPrize * (shares[1] / total);
    var last = totalPrize * (shares[teams - 1] / total);
    var playerCut = 1 - (orgCut / 100);
    document.getElementById('firstPlace').textContent = dollar(first) + ' (team total)';
    document.getElementById('firstPlayer').textContent = dollar((first * playerCut) / teamSize) + ' per player (after ' + fmt(orgCut, 0) + '% org cut)';
    document.getElementById('secondPlace').textContent = dollar(second) + ' (team) / ' + dollar((second * playerCut) / teamSize) + ' per player';
    document.getElementById('lastPaid').textContent = fmt(teams, 0) + 'th place: ' + dollar(last);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['totalPrize', 'teams', 'teamSize', 'orgCut'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
