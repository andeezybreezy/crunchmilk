(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var poolSize = parseFloat(document.getElementById('poolSize').value) || 0;
    var entryFee = parseFloat(document.getElementById('entryFee').value) || 0;
    var numEntries = parseFloat(document.getElementById('numEntries').value) || 0;
    var payoutStructure = document.getElementById('payoutStructure').value;
    var skillFactor = document.getElementById('skillFactor').value;

    // Calculation logic
    var pot = poolSize * entryFee; var skillMult = {casual: 0.8, average: 1.0, knowledgeable: 1.3, expert: 1.6}; var mult = skillMult[skillFactor] || 1.0; var payouts = {winner: [1.0], top3: [0.60, 0.25, 0.15], top5: [0.40, 0.25, 0.15, 0.12, 0.08]}; var payout = payouts[payoutStructure]; var firstPrize = pot * payout[0]; var baseWinProb = numEntries / poolSize; var adjWinProb = Math.min(baseWinProb * mult, 0.95); var ev = 0; for (var i = 0; i < payout.length; i++) { var placeProb = Math.min((numEntries / poolSize) * mult * (payout.length - i) / payout.length, 0.95); ev += pot * payout[i] * placeProb; } ev -= numEntries * entryFee; document.getElementById('totalPot').textContent = dollar(pot); document.getElementById('firstPrize').textContent = dollar(firstPrize); document.getElementById('winProb').textContent = fmt(adjWinProb * 100, 1) + '%'; document.getElementById('expectedValue').textContent = (ev >= 0 ? '+' : '') + dollar(ev); document.getElementById('perfectOdds').textContent = '1 in 9.2 quintillion';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['poolSize', 'entryFee', 'numEntries', 'payoutStructure', 'skillFactor'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
