(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var age = parseFloat(document.getElementById('age').value) || 0;
    var gender = document.getElementById('gender').value;
    var scenario = document.getElementById('scenario').value;

    // Calculation logic
    var malePool = 16e6; var femalePool = gender === 'female' ? 16e6 : 0; var totalPool = gender === 'male' ? malePool : malePool + femalePool; var activeForce = 1.3e6; var scenarios = {limited: {needed: 500000, extra: 200000, comp: 'Similar to Gulf War scale'}, major: {needed: 1500000, extra: 800000, comp: 'Similar to Korea/Vietnam scale'}, world: {needed: 5000000, extra: 3500000, comp: 'Similar to WWII scale'}}; var s = scenarios[scenario]; var poolForGender = gender === 'male' ? malePool : femalePool; var odds = Math.min(95, (s.extra / poolForGender * 100)); var ageFactor = age <= 20 ? 1.4 : age <= 25 ? 1.2 : age <= 30 ? 0.8 : 0.5; var adjustedOdds = Math.min(95, odds * ageFactor); var lotteryMax = Math.round(366 * (adjustedOdds / 100));     document.getElementById('draftOdds').textContent = adjustedOdds.toFixed(1) + '%';
    document.getElementById('eligiblePool').textContent = (poolForGender / 1e6).toFixed(0) + ' million';
    document.getElementById('troopsNeeded').textContent = (s.extra / 1e6).toFixed(1) + ' million beyond volunteers';
    document.getElementById('ageRisk').textContent = age <= 20 ? 'Highest risk — called first' : age <= 25 ? 'High risk — primary pool' : age <= 30 ? 'Moderate risk — secondary pool' : 'Lower risk — called last';
    document.getElementById('historicalComp').textContent = s.comp;
    document.getElementById('lotteryNumber').textContent = 'Numbers 1-' + lotteryMax + ' out of 366 would be called';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['age', 'gender', 'scenario'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
