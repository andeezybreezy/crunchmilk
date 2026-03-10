(function() {
  'use strict';

  var homeVal = document.getElementById('homeVal');
  var windZone = document.getElementById('windZone');
  var construction = document.getElementById('construction');
  var roofAge = document.getElementById('roofAge');
  var deductible = document.getElementById('deductible');
  var mitigation = document.getElementById('mitigation');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  // Base rates per $1,000 of coverage by wind zone
  var baseRates = { '1': 4, '2': 9.5, '3': 20, '4': 35 };

  function calcPremium(value, zone, constr, roof, deductPct, mitig) {
    var baseRate = baseRates[zone] || 9.5;
    var deductFactor = deductPct === 2 ? 1.0 : deductPct === 5 ? 0.80 : 0.68;
    var premium = (value / 1000) * baseRate * constr * roof * deductFactor * mitig;
    return Math.round(premium);
  }

  function calculate() {
    var value = parseFloat(homeVal.value);
    var zone = windZone.value;
    var constr = parseFloat(construction.value);
    var roof = parseFloat(roofAge.value);
    var deductPct = parseInt(deductible.value, 10);
    var mitig = parseFloat(mitigation.value);

    if (isNaN(value) || value <= 0) return;

    var annual = calcPremium(value, zone, constr, roof, deductPct, mitig);
    var monthly = Math.round(annual / 12);
    var deductAmt = Math.round(value * deductPct / 100);
    var ratePer1k = (annual / (value / 1000)).toFixed(2);

    var alt5 = calcPremium(value, zone, constr, roof, 5, mitig);
    var alt10 = calcPremium(value, zone, constr, roof, 10, mitig);

    document.getElementById('rPremium').textContent = '$' + annual.toLocaleString() + '/yr';
    document.getElementById('rMonthly').textContent = '$' + monthly.toLocaleString() + '/mo';
    document.getElementById('rDeductible').textContent = '$' + deductAmt.toLocaleString() + ' (' + deductPct + '%)';
    document.getElementById('rRate').textContent = '$' + ratePer1k;
    document.getElementById('rAlt5').textContent = '$' + alt5.toLocaleString() + '/yr (save $' + (annual - alt5).toLocaleString() + ')';
    document.getElementById('rAlt10').textContent = '$' + alt10.toLocaleString() + '/yr (save $' + (annual - alt10).toLocaleString() + ')';

    var zoneLabels = { '1': 'inland', '2': 'near-coastal', '3': 'coastal', '4': 'high-velocity coastal' };
    document.getElementById('resultTip').textContent = 'Zone ' + zone + ' (' + zoneLabels[zone] + ') rate. Wind mitigation inspection could save up to 45% on premiums.';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  [homeVal, windZone, construction, roofAge, deductible, mitigation].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

  calculate();
})();
