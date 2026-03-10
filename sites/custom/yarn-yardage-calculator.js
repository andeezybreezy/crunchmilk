(function() {
  'use strict';

  // Yardage estimates: [project][size] = base yards at worsted weight
  var baseYardage = {
    scarf:   { small: 150, medium: 250, large: 400 },
    blanket: { small: 900, medium: 1700, large: 3200 },
    sweater: { small: 800, medium: 1400, large: 2000 },
    hat:     { small: 100, medium: 150, large: 200 },
    socks:   { small: 200, medium: 300, large: 400 },
    shawl:   { small: 250, medium: 400, large: 600 },
    cowl:    { small: 100, medium: 175, large: 250 }
  };

  // Multiplier by yarn weight relative to worsted
  var weightMultiplier = {
    lace: 0.7,
    fingering: 0.85,
    sport: 0.9,
    dk: 0.95,
    worsted: 1.0,
    bulky: 1.15,
    superbulky: 1.35
  };

  // Approximate yards per pound by weight
  var yardsPerLb = {
    lace: 2400,
    fingering: 1600,
    sport: 1200,
    dk: 1000,
    worsted: 800,
    bulky: 500,
    superbulky: 300
  };

  function calculate() {
    var project = document.getElementById('projectType').value;
    var size = document.getElementById('projectSize').value;
    var weight = document.getElementById('yarnWeight').value;
    var skeinYd = parseFloat(document.getElementById('skeinYardage').value);

    if (isNaN(skeinYd) || skeinYd <= 0) return;

    var base = baseYardage[project][size];
    var multiplier = weightMultiplier[weight];
    var totalYards = Math.round(base * multiplier);

    var skeins = Math.ceil(totalYards / skeinYd);
    var meters = Math.round(totalYards * 0.9144);
    var weightOz = ((totalYards / yardsPerLb[weight]) * 16).toFixed(1);
    var weightG = (weightOz * 28.3495).toFixed(0);

    document.getElementById('totalYards').textContent = totalYards.toLocaleString() + ' yd';
    document.getElementById('skeinsNeeded').textContent = skeins + (skeins === 1 ? ' skein' : ' skeins');
    document.getElementById('totalMeters').textContent = meters.toLocaleString() + ' m';
    document.getElementById('totalWeight').textContent = weightOz + ' oz (' + weightG + ' g)';

    var tip = 'Buy ' + (skeins + 1) + ' skeins to be safe — dye lots vary between purchases. Cables and textured stitches may need 10-20% more.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  document.getElementById('skeinYardage').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });
})();
