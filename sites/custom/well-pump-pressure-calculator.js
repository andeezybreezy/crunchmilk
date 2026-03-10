(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  // Friction loss per 100 ft of pipe at various GPM (ft of head per 100 ft)
  var frictionTable = {
    0.75: { 5: 6.5, 10: 22, 15: 45, 20: 75, 25: 115 },
    1:    { 5: 1.8, 10: 6.2, 15: 13, 20: 22, 25: 33 },
    1.25: { 5: 0.6, 10: 2.1, 15: 4.3, 20: 7.2, 25: 11 },
    1.5:  { 5: 0.25, 10: 0.9, 15: 1.8, 20: 3.1, 25: 4.7 },
    2:    { 5: 0.08, 10: 0.28, 15: 0.58, 20: 0.98, 25: 1.5 }
  };

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function sel(id) {
    return document.getElementById(id).value;
  }

  function getFrictionLoss(diameter, gpm, pipeLength) {
    var table = frictionTable[diameter];
    if (!table) return 0;
    var gpms = Object.keys(table).map(Number).sort(function(a, b) { return a - b; });
    var lower = gpms[0], upper = gpms[gpms.length - 1];
    for (var i = 0; i < gpms.length; i++) {
      if (gpms[i] >= gpm) { upper = gpms[i]; break; }
      lower = gpms[i];
    }
    var lossPerHundred;
    if (lower === upper) {
      lossPerHundred = table[lower];
    } else {
      var frac = (gpm - lower) / (upper - lower);
      lossPerHundred = table[lower] + frac * (table[upper] - table[lower]);
    }
    return lossPerHundred * (pipeLength / 100);
  }

  function calculate() {
    var wellDepth = val('wellDepth');
    var pipeDia = parseFloat(sel('pipeDiameter'));
    var flowRate = val('flowRate');
    var elevChange = val('elevChange');
    var desiredPSI = val('desiredPSI');

    if (wellDepth <= 0 || flowRate <= 0) return;

    var pipeLength = wellDepth + elevChange + 30; // extra for horizontal runs
    var frictionLoss = getFrictionLoss(pipeDia, flowRate, pipeLength);
    var pressureHead = desiredPSI * 2.31;
    var tdh = wellDepth + elevChange + frictionLoss + pressureHead;

    // Recommend pump HP
    var hp;
    if (tdh <= 150 && flowRate <= 10) hp = '1/2 HP';
    else if (tdh <= 250 && flowRate <= 15) hp = '3/4 HP';
    else if (tdh <= 350 && flowRate <= 20) hp = '1 HP';
    else if (tdh <= 450 && flowRate <= 25) hp = '1-1/2 HP';
    else hp = '2 HP';

    // Pressure tank sizing (drawdown should >= GPM)
    var tankGal;
    if (flowRate <= 8) tankGal = 20;
    else if (flowRate <= 12) tankGal = 35;
    else if (flowRate <= 18) tankGal = 50;
    else if (flowRate <= 25) tankGal = 85;
    else tankGal = 120;

    document.getElementById('tdh').textContent = Math.round(tdh) + ' ft';
    document.getElementById('frictionLoss').textContent = frictionLoss.toFixed(1) + ' ft';
    document.getElementById('pumpHP').textContent = hp;
    document.getElementById('tankSize').textContent = tankGal + ' gallons';

    var tip = 'TDH breakdown: ' + Math.round(wellDepth) + ' ft depth + ' +
      Math.round(elevChange) + ' ft elevation + ' + frictionLoss.toFixed(1) +
      ' ft friction + ' + Math.round(pressureHead) + ' ft pressure head.';
    document.getElementById('resultTip').textContent = tip;

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  document.querySelectorAll('input[type="number"]').forEach(function(el) {
    el.addEventListener('input', calculate);
  });
  document.querySelectorAll('select').forEach(function(el) {
    el.addEventListener('change', calculate);
  });

  calculate();
})();
