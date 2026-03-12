(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var yield_kt = parseFloat(document.getElementById('yield_kt').value) || 0;
    var burst = document.getElementById('burst').value;
    var distance = parseFloat(document.getElementById('distance').value) || 0;

    // Calculation logic
    var y = yield_kt; var scale = Math.pow(y, 1/3); var fireballR = 0.0 ; if(burst === 'airburst') { fireballR = 0.024 * scale; } else { fireballR = 0.028 * scale; } var severeR = burst === 'airburst' ? 0.14 * scale : 0.12 * scale; var moderateR = burst === 'airburst' ? 0.42 * scale : 0.36 * scale; var lightR = burst === 'airburst' ? 1.15 * scale : 1.0 * scale; var thermalR = burst === 'airburst' ? 1.4 * scale : 1.1 * scale; var falloutStr = burst === 'surface' ? 'SEVERE — surface burst produces heavy radioactive fallout extending 50-200+ miles downwind' : 'Moderate — airburst produces significantly less fallout than surface burst'; var survivalStr = ''; var recStr = ''; if(distance <= fireballR) { survivalStr = 'FATAL — Inside fireball. No survival possible.'; recStr = 'No protective measures can help at this range.'; } else if(distance <= severeR) { survivalStr = 'FATAL — Severe blast zone. Near-total destruction of all structures.'; recStr = 'Reinforced underground shelter is the only chance of survival.'; } else if(distance <= moderateR) { survivalStr = 'VERY DANGEROUS — Moderate blast damage. Most buildings severely damaged or collapsed.'; recStr = 'Seek reinforced concrete shelter immediately. Stay below ground if possible.'; } else if(distance <= lightR) { survivalStr = 'DANGEROUS — Windows shattered, light structural damage, injuries from debris likely.'; recStr = 'Take cover immediately. Move to interior rooms away from windows. Shelter in place for 24-72 hours.'; } else if(distance <= thermalR) { survivalStr = 'HAZARDOUS — Thermal burns possible with direct exposure. Flash blindness risk.'; recStr = 'Do not look at the flash. Take shelter indoors. Monitor for fallout if surface burst.'; } else if(distance <= thermalR * 2) { survivalStr = 'MODERATE RISK — Minor injuries possible. Fallout is the primary concern.'; recStr = 'Shelter indoors for at least 24 hours. Close windows and doors. Seal gaps if possible.'; } else { survivalStr = 'SURVIVABLE — Outside primary damage zones. Fallout remains a risk for surface bursts.'; recStr = 'Stay informed via emergency broadcasts. Shelter if fallout is heading your direction. Have 72-hour supply kit.'; } document.getElementById('fireball').textContent = fmt(fireballR, 2) + ' miles (' + fmt(fireballR * 5280, 0) + ' ft)'; document.getElementById('severe').textContent = fmt(severeR, 2) + ' miles — total destruction of all structures'; document.getElementById('moderate').textContent = fmt(moderateR, 2) + ' miles — most buildings destroyed or heavily damaged'; document.getElementById('light').textContent = fmt(lightR, 2) + ' miles — windows broken, minor structural damage'; document.getElementById('thermal').textContent = fmt(thermalR, 2) + ' miles — exposed skin receives 3rd-degree burns'; document.getElementById('survival').textContent = survivalStr; document.getElementById('fallout').textContent = falloutStr; document.getElementById('recommendation').textContent = recStr;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['yield_kt', 'burst', 'distance'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
