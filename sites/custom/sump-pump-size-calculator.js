(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var basementSqFt = parseFloat(document.getElementById('basementSqFt').value) || 0;
    var waterLevel = document.getElementById('waterLevel').value;
    var dischargeHeight = parseFloat(document.getElementById('dischargeHeight').value) || 0;
    var dischargeDist = parseFloat(document.getElementById('dischargeDist').value) || 0;

    // Calculation logic
    var riskMult = {'low':0.5,'moderate':1.0,'high':2.0};
    var baseGPH = basementSqFt * 1.5 * riskMult[waterLevel];
    var totalHead = dischargeHeight + (dischargeDist * 0.1);
    var headLossFactor = 1 + (totalHead * 0.03);
    var adjustedGPH = baseGPH * headLossFactor;
    var hp = adjustedGPH <= 1800 ? '1/3 HP' : (adjustedGPH <= 3000 ? '1/2 HP' : (adjustedGPH <= 4500 ? '3/4 HP' : '1 HP'));
    var backup = waterLevel === 'high' ? 'STRONGLY recommended — battery backup + water alarm' : (waterLevel === 'moderate' ? 'Recommended — battery backup sump pump' : 'Optional — consider water alarm at minimum');
    document.getElementById('gph').textContent = fmt(adjustedGPH, 0) + ' GPH at ' + fmt(totalHead, 1) + ' ft head';
    document.getElementById('hp').textContent = hp;
    document.getElementById('totalHead').textContent = fmt(totalHead, 1) + ' feet (' + fmt(dischargeHeight, 0) + ' vertical + ' + fmt(dischargeDist * 0.1, 1) + ' friction loss)';
    document.getElementById('backup').textContent = backup;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['basementSqFt', 'waterLevel', 'dischargeHeight', 'dischargeDist'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
