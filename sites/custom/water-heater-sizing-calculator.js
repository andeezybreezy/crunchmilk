(function() {
  'use strict';

  // Flow rates (GPM) for peak demand calculation
  var fixtures = {
    shower: 2.0,
    faucet: 1.0,
    dishwasher: 1.5,
    washer: 2.0,
    tub: 4.0
  };

  // Standard tank sizes
  var gasTanks = [30, 40, 50, 75];
  var electricTanks = [40, 50, 65, 80];

  var bathrooms = document.getElementById('bathrooms');
  var occupants = document.getElementById('occupants');
  var usage = document.getElementById('usage');
  var fuelType = document.getElementById('fuelType');
  var calcBtn = document.getElementById('calcBtn');
  var rTank = document.getElementById('rTank');
  var rFHR = document.getElementById('rFHR');
  var rTankless = document.getElementById('rTankless');
  var rRecommend = document.getElementById('rRecommend');
  var resultDetails = document.getElementById('resultDetails');

  function calculate() {
    var baths = parseFloat(bathrooms.value);
    var people = parseInt(occupants.value, 10);
    var usageLvl = usage.value;
    var fuel = fuelType.value;

    // Peak demand calculation (gallons in first hour)
    // Base: gallons per person per peak hour
    var gallonsPerPerson = { low: 10, medium: 14, high: 18 };
    var peakDemand = people * gallonsPerPerson[usageLvl];

    // Add bathroom factor (more bathrooms = more simultaneous use)
    peakDemand += Math.max(0, baths - 1) * 8;

    // Usage multiplier
    var usageMult = { low: 0.85, medium: 1.0, high: 1.2 };
    peakDemand *= usageMult[usageLvl];

    peakDemand = Math.round(peakDemand);

    // Tank sizing
    var tanks = fuel === 'gas' ? gasTanks : electricTanks;
    var tankSize = tanks[tanks.length - 1];
    for (var i = 0; i < tanks.length; i++) {
      // FHR is roughly: gas = tank × 1.4, electric = tank × 0.9
      var fhr = fuel === 'gas' ? tanks[i] * 1.4 : tanks[i] * 0.9;
      if (fhr >= peakDemand) {
        tankSize = tanks[i];
        break;
      }
    }

    var fhr = fuel === 'gas' ? Math.round(tankSize * 1.4) : Math.round(tankSize * 0.9);

    // Tankless sizing (GPM)
    // Simultaneous fixtures based on bathrooms
    var simultaneousShowers = Math.min(Math.ceil(baths), people);
    var simultaneousFaucets = Math.min(1, Math.floor(baths));
    var peakGPM = (simultaneousShowers * fixtures.shower) + (simultaneousFaucets * fixtures.faucet);

    // Adjust for usage
    if (usageLvl === 'low') peakGPM *= 0.8;
    if (usageLvl === 'high') peakGPM *= 1.1;

    peakGPM = Math.round(peakGPM * 10) / 10;

    // Recommendation
    var recommend;
    if (people <= 2 && baths <= 1.5) {
      recommend = 'Tank (economical)';
    } else if (people >= 5 || baths >= 3.5) {
      recommend = 'Tankless (unlimited supply)';
    } else if (usageLvl === 'high') {
      recommend = 'Tankless (high usage)';
    } else {
      recommend = fuel === 'gas' ? 'Either option works' : 'Tank (unless upgrading electric)';
    }

    rTank.textContent = tankSize + ' gallon';
    rFHR.textContent = fhr + ' gal/hr';
    rTankless.textContent = peakGPM + ' GPM';
    rRecommend.textContent = recommend;

    var html = '<p style="margin:0 0 8px"><strong>Peak demand:</strong> ~' + peakDemand + ' gallons in first hour</p>';
    html += '<p style="margin:0 0 8px"><strong>Simultaneous use:</strong> Up to ' + simultaneousShowers + ' shower(s) + ' + simultaneousFaucets + ' faucet(s)</p>';

    // Tank details
    html += '<p style="margin:0 0 12px;font-weight:600;border-bottom:1px solid #e5e7eb;padding-bottom:4px">Tank Water Heater</p>';
    html += '<p style="margin:0 0 8px"><strong>Recommended:</strong> ' + tankSize + '-gallon ' + (fuel === 'gas' ? 'gas' : 'electric') + '</p>';
    html += '<p style="margin:0 0 8px"><strong>First Hour Rating:</strong> ' + fhr + ' gallons</p>';

    var tankCost = fuel === 'gas' ? [800, 1500] : [600, 1200];
    html += '<p style="margin:0 0 8px"><strong>Installed cost:</strong> $' + tankCost[0] + '–$' + tankCost[1] + '</p>';
    html += '<p style="margin:0 0 8px"><strong>Lifespan:</strong> 10-15 years</p>';

    // Tankless details
    html += '<p style="margin:0 0 12px;margin-top:16px;font-weight:600;border-bottom:1px solid #e5e7eb;padding-bottom:4px">Tankless Water Heater</p>';
    html += '<p style="margin:0 0 8px"><strong>Required flow:</strong> ' + peakGPM + ' GPM at 60°F rise</p>';

    var tanklessBTU;
    if (fuel === 'gas') {
      tanklessBTU = Math.round(peakGPM * 25000); // rough: 25K BTU per GPM at 60°F rise
      html += '<p style="margin:0 0 8px"><strong>Gas tankless:</strong> ~' + (tanklessBTU / 1000).toFixed(0) + 'K BTU unit</p>';
      html += '<p style="margin:0 0 8px"><strong>Installed cost:</strong> $2,500–$4,500</p>';
    } else {
      var kw = Math.round(peakGPM * 7.5); // rough: 7.5 kW per GPM at 60°F rise
      html += '<p style="margin:0 0 8px"><strong>Electric tankless:</strong> ~' + kw + ' kW unit</p>';
      html += '<p style="margin:0 0 8px"><strong>Installed cost:</strong> $2,000–$3,500 (may need panel upgrade)</p>';
    }

    html += '<p style="margin:0"><strong>Lifespan:</strong> 20+ years</p>';

    resultDetails.innerHTML = html;
    document.getElementById('result').classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);

  [bathrooms, occupants, usage, fuelType].forEach(function(el) {
    el.addEventListener('change', calculate);
  });

})();
