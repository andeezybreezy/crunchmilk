(function() {
  'use strict';

  var vegType = document.getElementById('vegType');
  var slopeGrade = document.getElementById('slopeGrade');
  var climateZone = document.getElementById('climateZone');
  var defSpace = document.getElementById('defSpace');
  var roofType = document.getElementById('roofType');
  var accessRoad = document.getElementById('accessRoad');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function calculate() {
    var veg = parseInt(vegType.value, 10);
    var slope = parseInt(slopeGrade.value, 10);
    var climate = parseInt(climateZone.value, 10);
    var space = parseFloat(defSpace.value);
    var roof = parseInt(roofType.value, 10);
    var road = parseInt(accessRoad.value, 10);

    if (isNaN(space)) return;

    // Normalize vegetation score (1-5 -> 0-100)
    var vegScore = ((veg - 1) / 4) * 100;
    // Slope (1-5 -> 0-100)
    var slopeScore = ((slope - 1) / 4) * 100;
    // Climate (1-4 -> 0-100)
    var climateScore = ((climate - 1) / 3) * 100;
    // Defensible space: 0 ft = 100 risk, 100+ ft = 0 risk
    var spaceScore = Math.max(0, 100 - (space / 100) * 100);
    // Roof (1-4 -> 0-100)
    var roofScore = ((roof - 1) / 3) * 100;
    // Road (1-4 -> 0-100)
    var roadScore = ((road - 1) / 3) * 100;

    // Weighted composite
    var totalScore = Math.round(
      vegScore * 0.30 +
      slopeScore * 0.20 +
      climateScore * 0.15 +
      spaceScore * 0.15 +
      roofScore * 0.10 +
      roadScore * 0.10
    );

    totalScore = Math.min(100, Math.max(0, totalScore));

    var level, levelColor;
    if (totalScore < 30) { level = 'Low'; levelColor = '#16a34a'; }
    else if (totalScore < 50) { level = 'Moderate'; levelColor = '#ca8a04'; }
    else if (totalScore < 70) { level = 'High'; levelColor = '#ea580c'; }
    else { level = 'Extreme'; levelColor = '#dc2626'; }

    var vegLabels = ['Low', 'Low-Moderate', 'Moderate', 'High', 'Extreme'];
    var slopeLabels = ['Minimal', 'Low', 'Moderate', 'High', 'Extreme'];

    document.getElementById('rScore').textContent = totalScore + ' / 100';
    document.getElementById('rScore').style.color = levelColor;
    document.getElementById('rLevel').textContent = level;
    document.getElementById('rLevel').style.color = levelColor;
    document.getElementById('rVeg').textContent = vegLabels[veg - 1] + ' (' + Math.round(vegScore) + '/100)';
    document.getElementById('rTerrain').textContent = slopeLabels[slope - 1] + ' (' + Math.round(slopeScore) + '/100)';

    var structScore = Math.round((roofScore + spaceScore) / 2);
    document.getElementById('rStruct').textContent = structScore + '/100 vulnerability';

    var insuranceImpact;
    if (totalScore < 30) insuranceImpact = 'Standard rates likely';
    else if (totalScore < 50) insuranceImpact = '+10-30% premium surcharge';
    else if (totalScore < 70) insuranceImpact = '+50-200% premium or limited options';
    else insuranceImpact = 'FAIR Plan may be required';

    document.getElementById('rInsurance').textContent = insuranceImpact;

    var tips = [];
    if (space < 100) tips.push('Increase defensible space to 100ft');
    if (roof > 2) tips.push('Upgrade to Class A roofing');
    if (veg >= 4) tips.push('Thin vegetation and remove dead brush');
    document.getElementById('resultTip').textContent = tips.length > 0
      ? 'Top actions: ' + tips.join('; ')
      : 'Good defensible position. Maintain vegetation clearance annually.';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  [vegType, slopeGrade, climateZone, defSpace, roofType, accessRoad].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

  calculate();
})();
