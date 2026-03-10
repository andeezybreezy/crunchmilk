(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  var jointEl = document.getElementById('jointType');
  var weldLenEl = document.getElementById('weldLength');
  var weldSizeEl = document.getElementById('weldSize');
  var plateEl = document.getElementById('plateThickness');
  var rodSizeEl = document.getElementById('rodSize');
  var rodTypeEl = document.getElementById('rodType');
  var wasteEl = document.getElementById('wastePctWeld');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var STEEL_DENSITY = 0.283; // lbs per cubic inch

  // Deposition efficiency by rod type
  var depositionEff = {
    '6011': 0.60,
    '6013': 0.62,
    '7018': 0.65,
    '7024': 0.70
  };

  // Approximate deposited weld metal per rod (lbs) by rod diameter
  // Based on 14" rod length, typical coating
  var depositPerRod = {
    '0.09375': 0.025,  // 3/32"
    '0.125':   0.054,  // 1/8"
    '0.15625': 0.085,  // 5/32"
    '0.1875':  0.120   // 3/16"
  };

  var chartData = [
    ['1/8"', '0.0078', '0.027', '0.5', '1'],
    ['3/16"', '0.0176', '0.060', '1.1', '1'],
    ['1/4"', '0.0313', '0.106', '2.0', '1'],
    ['5/16"', '0.0488', '0.166', '3.1', '2'],
    ['3/8"', '0.0703', '0.239', '4.5', '2-3'],
    ['1/2"', '0.125', '0.425', '7.9', '3-5']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getVal(el) { var v = parseFloat(el.value); return isNaN(v) ? 0 : v; }

  function calculate() {
    var joint = jointEl.value;
    var weldLen = getVal(weldLenEl);
    var weldSize = getVal(weldSizeEl);
    var plateThick = getVal(plateEl);
    var rodSize = rodSizeEl.value;
    var rodType = rodTypeEl.value;
    var wastePct = getVal(wasteEl) / 100;

    if (weldLen <= 0) return;

    var crossSection = 0; // square inches

    if (joint === 'fillet') {
      // Fillet weld: triangle cross-section = 0.5 * leg * leg
      crossSection = 0.5 * weldSize * weldSize;
    } else if (joint === 'butt_v') {
      // V-groove (60 degree included angle)
      // Groove area = plate thickness * (2 * plate thickness * tan(30°)) / 2
      // Plus reinforcement cap (about 1/16" x plate width)
      var grooveWidth = 2 * plateThick * Math.tan(Math.PI / 6); // tan(30°)
      crossSection = (plateThick * grooveWidth) / 2;
      // Add root gap fill (~1/16" x plate thickness)
      crossSection += 0.0625 * plateThick;
      // Add reinforcement cap (~1/16" high x groove width + 1/8")
      crossSection += 0.0625 * (grooveWidth + 0.125);
    } else if (joint === 'butt_square') {
      // Square butt: root gap (~1/16") x plate thickness + reinforcement
      var rootGap = 0.0625;
      crossSection = rootGap * plateThick;
      // Reinforcement on each side (~1/16" x plate thickness + 1/8")
      crossSection += 2 * 0.0625 * (plateThick + 0.125);
    }

    // Volume in cubic inches
    var volumeCuIn = crossSection * weldLen;

    // Weight of weld metal
    var weldMetalLbs = volumeCuIn * STEEL_DENSITY;

    // Deposition per rod
    var depPerRod = depositPerRod[rodSize] || 0.054;
    var efficiency = depositionEff[rodType] || 0.65;

    // Rods needed (including waste)
    var rodsNeeded = Math.ceil((weldMetalLbs / depPerRod) * (1 + wastePct));

    // Total electrode weight (rods including coating and stub)
    var electrodeWeight = weldMetalLbs / efficiency * (1 + wastePct);

    // Estimate number of passes
    // Max single-pass fillet is about 5/16" leg, single-pass groove fill ~3/16"
    var maxSinglePass = joint === 'fillet' ? 0.3125 : 0.1875;
    var passes;
    if (joint === 'fillet') {
      passes = weldSize <= 0.25 ? 1 : Math.ceil(crossSection / (0.5 * 0.25 * 0.25));
    } else {
      passes = Math.max(1, Math.ceil(plateThick / 0.1875) + 1); // fill passes + root + cap
    }

    document.getElementById('rRods').textContent = rodsNeeded + ' rods';
    document.getElementById('rWeight').textContent = fmt(weldMetalLbs, 3) + ' lbs';
    document.getElementById('rElectrodes').textContent = fmt(electrodeWeight, 2) + ' lbs';
    document.getElementById('rVolume').textContent = fmt(volumeCuIn, 4) + ' cu in';
    document.getElementById('rCrossSection').textContent = fmt(crossSection, 4) + ' sq in';
    document.getElementById('rPasses').textContent = passes + (passes === 1 ? ' pass' : ' passes');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [jointEl, weldLenEl, weldSizeEl, plateEl, rodSizeEl, rodTypeEl, wasteEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
