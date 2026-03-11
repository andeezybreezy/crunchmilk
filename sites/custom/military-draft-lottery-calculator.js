(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var age = parseFloat(document.getElementById('age').value) || 0;
    var gender = document.getElementById('gender').value;
    var scenario = document.getElementById('scenario').value;

    // Calculation logic
    var malePool = 16e6; var femalePool = v.gender === 'female' ? 16e6 : 0; var totalPool = v.gender === 'male' ? malePool : malePool + femalePool; var activeForce = 1.3e6; var scenarios = {limited: {needed: 500000, extra: 200000, comp: 'Similar to Gulf War scale'}, major: {needed: 1500000, extra: 800000, comp: 'Similar to Korea/Vietnam scale'}, world: {needed: 5000000, extra: 3500000, comp: 'Similar to WWII scale'}}; var s = scenarios[v.scenario]; var poolForGender = v.gender === 'male' ? malePool : femalePool; var odds = Math.min(95, (s.extra / poolForGender * 100)); var ageFactor = v.age <= 20 ? 1.4 : v.age <= 25 ? 1.2 : v.age <= 30 ? 0.8 : 0.5; var adjustedOdds = Math.min(95, odds * ageFactor); var lotteryMax = Math.round(366 * (adjustedOdds / 100)); return {draftOdds: adjustedOdds.toFixed(1) + '%', eligiblePool: (poolForGender / 1e6).toFixed(0) + ' million', troopsNeeded: (s.extra / 1e6).toFixed(1) + ' million beyond volunteers', ageRisk: v.age <= 20 ? 'Highest risk — called first' : v.age <= 25 ? 'High risk — primary pool' : v.age <= 30 ? 'Moderate risk — secondary pool' : 'Lower risk — called last', historicalComp: s.comp, lotteryNumber: 'Numbers 1-' + lotteryMax + ' out of 366 would be called'};

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
