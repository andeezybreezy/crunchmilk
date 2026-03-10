(function() {
  'use strict';

  var region = document.getElementById('region');
  var staticLevel = document.getElementById('staticLevel');
  var householdSize = document.getElementById('householdSize');
  var irrigation = document.getElementById('irrigation');
  var droughtLevel = document.getElementById('droughtLevel');
  var drillCost = document.getElementById('drillCost');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  // Region data: typical depth multiplier, drought vulnerability
  var regionData = {
    coastal:  { baseDepth: 100, droughtDrop: [0, 5, 10, 20, 30] },
    piedmont: { baseDepth: 200, droughtDrop: [0, 8, 18, 30, 45] },
    mountain: { baseDepth: 300, droughtDrop: [0, 5, 12, 22, 35] },
    plains:   { baseDepth: 250, droughtDrop: [0, 10, 25, 40, 60] },
    desert:   { baseDepth: 400, droughtDrop: [0, 12, 30, 50, 80] }
  };

  function calculate() {
    var reg = region.value;
    var swl = parseFloat(staticLevel.value);
    var people = parseInt(householdSize.value, 10);
    var irrig = parseInt(irrigation.value, 10);
    var drought = parseInt(droughtLevel.value, 10);
    var costFt = parseFloat(drillCost.value);

    if (isNaN(swl) || isNaN(people) || people <= 0 || isNaN(costFt)) return;

    var rd = regionData[reg];

    // Daily water need: 75 gal/person indoor + irrigation
    var dailyNeed = (people * 75) + irrig;

    // Required GPM (assuming 2-hour peak pumping window)
    var gpmNeeded = Math.max(3, dailyNeed / (120)).toFixed(1);

    // Drought water table drop
    var droughtDrop = rd.droughtDrop[drought];

    // Recommended depth: static level + drought buffer + 75 ft water column + 25 ft safety margin
    var recommendedDepth = Math.ceil((swl + droughtDrop + 75 + 25) / 10) * 10;
    // Ensure at least the regional base depth
    recommendedDepth = Math.max(recommendedDepth, rd.baseDepth);

    var totalCost = recommendedDepth * costFt;
    // Add pump & equipment estimate
    var pumpCost = 3000 + (recommendedDepth > 300 ? 2000 : 0);
    var totalInstalled = totalCost + pumpCost;

    // Drought risk assessment
    var riskLevel, riskColor;
    var droughtSafetyMargin = recommendedDepth - swl - droughtDrop;
    if (drought === 0) { riskLevel = 'Normal conditions'; riskColor = '#16a34a'; }
    else if (drought <= 1) { riskLevel = 'Low — adequate margin'; riskColor = '#ca8a04'; }
    else if (drought <= 2) { riskLevel = 'Moderate — monitor water level'; riskColor = '#ea580c'; }
    else if (drought <= 3) { riskLevel = 'High — conservation recommended'; riskColor = '#dc2626'; }
    else { riskLevel = 'Extreme — restrict non-essential use'; riskColor = '#991b1b'; }

    document.getElementById('rDepth').textContent = recommendedDepth + ' feet';
    document.getElementById('rCost').textContent = '$' + totalInstalled.toLocaleString() + ' (drill + pump)';
    document.getElementById('rDailyNeed').textContent = dailyNeed.toLocaleString() + ' gallons/day';
    document.getElementById('rGPM').textContent = gpmNeeded + ' GPM min';
    document.getElementById('rDrop').textContent = droughtDrop > 0 ? droughtDrop + ' feet below normal' : 'None (normal conditions)';
    document.getElementById('rDroughtRisk').textContent = riskLevel;
    document.getElementById('rDroughtRisk').style.color = riskColor;

    var droughtLabels = ['Normal', 'D1 Moderate', 'D2 Severe', 'D3 Extreme', 'D4 Exceptional'];
    document.getElementById('resultTip').textContent = droughtLabels[drought] + ' drought: water table drops ~' + droughtDrop + 'ft. Well has ' + droughtSafetyMargin + 'ft safety margin below drought level. Drilling cost: $' + Math.round(costFt) + '/ft × ' + recommendedDepth + 'ft = $' + totalCost.toLocaleString() + ' + $' + pumpCost.toLocaleString() + ' equipment.';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  [region, staticLevel, householdSize, irrigation, droughtLevel, drillCost].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

  calculate();
})();
