(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  // C:N ratios and density (lbs per gallon approx)
  var materials = {
    grass:     { cn: 20,  density: 2.5, label: 'Grass clippings' },
    food:      { cn: 15,  density: 4.0, label: 'Food scraps' },
    coffee:    { cn: 20,  density: 5.0, label: 'Coffee grounds' },
    manure:    { cn: 15,  density: 5.0, label: 'Fresh manure' },
    weeds:     { cn: 25,  density: 2.0, label: 'Fresh weeds' },
    leaves:    { cn: 60,  density: 0.5, label: 'Dry leaves' },
    cardboard: { cn: 350, density: 0.8, label: 'Cardboard' },
    straw:     { cn: 80,  density: 0.4, label: 'Straw' },
    woodchips: { cn: 400, density: 1.5, label: 'Wood chips' },
    newspaper: { cn: 175, density: 0.6, label: 'Newspaper' },
    sawdust:   { cn: 325, density: 1.2, label: 'Sawdust' }
  };

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function sel(id) {
    return document.getElementById(id).value;
  }

  function calculate() {
    var greenType = sel('greenType');
    var greenAmt = val('greenAmount');
    var brownType = sel('brownType');
    var brownAmt = val('brownAmount');

    if (greenAmt <= 0 && brownAmt <= 0) return;

    var green = materials[greenType];
    var brown = materials[brownType];

    // Weight of each material
    var greenLbs = greenAmt * green.density;
    var brownLbs = brownAmt * brown.density;
    var totalLbs = greenLbs + brownLbs;

    if (totalLbs <= 0) return;

    // Weighted C:N ratio
    // Each material has C:N ratio. Carbon = CN * N, so proportion of C = CN/(CN+1) approx
    // Simplified: weighted CN = (greenLbs * greenCN + brownLbs * brownCN) / totalLbs
    var weightedCN = (greenLbs * green.cn + brownLbs * brown.cn) / totalLbs;

    var totalGallons = greenAmt + brownAmt;
    var cubicFeet = totalGallons / 7.48;

    document.getElementById('cnRatio').textContent = weightedCN.toFixed(1) + ':1';

    // Recommendation
    var rec;
    if (weightedCN >= 25 && weightedCN <= 30) {
      rec = 'Excellent balance!';
      document.getElementById('cnRatio').style.color = '#16a34a';
    } else if (weightedCN > 30 && weightedCN <= 40) {
      var greenNeeded = Math.ceil((brownLbs * brown.cn - 27.5 * totalLbs) / (27.5 - green.cn) / green.density);
      rec = 'Add ~' + Math.abs(greenNeeded) + ' gal more greens';
      document.getElementById('cnRatio').style.color = '#d97706';
    } else if (weightedCN > 40) {
      var greenNeeded2 = Math.ceil((brownLbs * brown.cn - 27.5 * brownLbs) / (27.5 - green.cn) / green.density);
      rec = 'Too carbon-heavy — add ~' + Math.max(1, greenNeeded2) + ' gal greens';
      document.getElementById('cnRatio').style.color = '#dc2626';
    } else if (weightedCN < 25 && weightedCN >= 20) {
      var brownNeeded = Math.ceil((27.5 * totalLbs - greenLbs * green.cn - brownLbs * brown.cn) / brown.cn / brown.density);
      rec = 'Add ~' + Math.max(1, brownNeeded) + ' gal more browns';
      document.getElementById('cnRatio').style.color = '#d97706';
    } else {
      var brownNeeded2 = Math.ceil((27.5 * greenLbs - greenLbs * green.cn) / (brown.cn - 27.5) / brown.density);
      rec = 'Too nitrogen-heavy — add ~' + Math.max(1, brownNeeded2) + ' gal browns';
      document.getElementById('cnRatio').style.color = '#dc2626';
    }

    document.getElementById('recommendation').textContent = rec;
    document.getElementById('pileVolume').textContent = totalGallons.toFixed(1) + ' gal (' + cubicFeet.toFixed(1) + ' cu ft)';

    var minCuFt = 27; // 3x3x3
    var tip = green.label + ' (' + greenAmt + ' gal) + ' + brown.label + ' (' + brownAmt + ' gal). ';
    if (cubicFeet < minCuFt) {
      tip += 'Pile is below the 27 cu ft minimum for hot composting — add more material.';
    } else {
      tip += 'Pile is large enough for active hot composting. Turn weekly and keep moist.';
    }
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
