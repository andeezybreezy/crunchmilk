(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var totalPoints = parseFloat(document.getElementById('totalPoints').value) || 0;
    var buildType = document.getElementById('buildType').value;
    var strength = parseFloat(document.getElementById('strength').value) || 0;
    var dexterity = parseFloat(document.getElementById('dexterity').value) || 0;
    var intelligence = parseFloat(document.getElementById('intelligence').value) || 0;
    var vitality = parseFloat(document.getElementById('vitality').value) || 0;

    // Calculation logic
    var buildBonus = {'DPS (Damage)': {str: 1.3, dex: 1.2, int: 0.8, vit: 0.7}, 'Tank (Defense)': {str: 0.9, dex: 0.7, int: 0.6, vit: 1.8}, 'Healer (Support)': {str: 0.5, dex: 0.7, int: 1.5, vit: 1.3}, 'Balanced': {str: 1, dex: 1, int: 1, vit: 1}, 'Glass Cannon': {str: 1.5, dex: 1.3, int: 1.5, vit: 0.3}}; var bonus = buildBonus[buildType] || buildBonus['Balanced']; var wStr = strength * bonus.str; var wDex = dexterity * bonus.dex; var wInt = intelligence * bonus.int; var wVit = vitality * bonus.vit; var total = wStr + wDex + wInt + wVit; var strPoints = Math.round(totalPoints * (wStr / total)); var dexPoints = Math.round(totalPoints * (wDex / total)); var intPoints = Math.round(totalPoints * (wInt / total)); var vitPoints = totalPoints - strPoints - dexPoints - intPoints; var maxStat = Math.max(strPoints, dexPoints, intPoints, vitPoints); var buildRating = maxStat > totalPoints * 0.5 ? 'Highly Specialized' : maxStat > totalPoints * 0.35 ? 'Focused' : 'Well-Rounded'; return {strPoints: fmt(strPoints, 0), dexPoints: fmt(dexPoints, 0), intPoints: fmt(intPoints, 0), vitPoints: fmt(vitPoints, 0), buildRating: buildRating};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['totalPoints', 'buildType', 'strength', 'dexterity', 'intelligence', 'vitality'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
