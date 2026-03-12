(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  // LVL properties: Fb=2600psi, E=1.9M psi
  // Glulam: Fb=2400psi, E=1.8M psi
  // Lumber (DF#1): Fb=1000psi, E=1.7M psi
  // Steel A992: Fy=50ksi, E=29M psi

  var lvlSizes = [
    {name:'1.75×7.25"', b:1.75,d:7.25}, {name:'1.75×9.25"', b:1.75,d:9.25},
    {name:'1.75×11.25"', b:1.75,d:11.25}, {name:'1.75×11.875"', b:1.75,d:11.875},
    {name:'3.5×9.25"', b:3.5,d:9.25}, {name:'3.5×11.25"', b:3.5,d:11.25},
    {name:'3.5×11.875"', b:3.5,d:11.875}, {name:'3.5×14"', b:3.5,d:14},
    {name:'3.5×16"', b:3.5,d:16}, {name:'3.5×18"', b:3.5,d:18},
    {name:'5.25×14"', b:5.25,d:14}, {name:'5.25×16"', b:5.25,d:16},
    {name:'5.25×18"', b:5.25,d:18}, {name:'5.25×20"', b:5.25,d:20}
  ];

  var glulamSizes = [
    {name:'3.125×9"', b:3.125,d:9}, {name:'3.125×10.5"', b:3.125,d:10.5},
    {name:'3.5×9"', b:3.5,d:9}, {name:'3.5×10.5"', b:3.5,d:10.5},
    {name:'3.5×12"', b:3.5,d:12}, {name:'5.125×9"', b:5.125,d:9},
    {name:'5.125×10.5"', b:5.125,d:10.5}, {name:'5.125×12"', b:5.125,d:12},
    {name:'5.125×13.5"', b:5.125,d:13.5}, {name:'5.125×15"', b:5.125,d:15},
    {name:'6.75×12"', b:6.75,d:12}, {name:'6.75×13.5"', b:6.75,d:13.5},
    {name:'6.75×15"', b:6.75,d:15}, {name:'6.75×16.5"', b:6.75,d:16.5}
  ];

  var steelSections = [
    {name:'W6×12', Sx:10.9, Ix:32.1}, {name:'W8×13', Sx:9.91, Ix:39.6},
    {name:'W8×18', Sx:15.2, Ix:61.9}, {name:'W8×24', Sx:20.9, Ix:82.7},
    {name:'W10×19', Sx:18.8, Ix:96.3}, {name:'W10×22', Sx:23.2, Ix:118},
    {name:'W10×26', Sx:27.9, Ix:144}, {name:'W12×26', Sx:33.4, Ix:204},
    {name:'W12×30', Sx:38.6, Ix:238}, {name:'W14×30', Sx:42, Ix:291}
  ];

  var lumberSizes = [
    {name:'(2) 2×8', b:3,d:7.25}, {name:'(2) 2×10', b:3,d:9.25},
    {name:'(2) 2×12', b:3,d:11.25}, {name:'(3) 2×10', b:4.5,d:9.25},
    {name:'(3) 2×12', b:4.5,d:11.25}, {name:'(4) 2×12', b:6,d:11.25}
  ];

  function sectionMod(b, d) { return b * d * d / 6; }
  function momentOfInertia(b, d) { return b * d * d * d / 12; }

  var spanEl = document.getElementById('beamSpan');
  var tribEl = document.getElementById('tribWidth');
  var liveEl = document.getElementById('liveLoad');
  var deadEl = document.getElementById('deadLoad');
  var typeEl = document.getElementById('beamType');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['8 ft', '660', '3.5×9.25"', '3.5×9"', 'W6×12'],
    ['10 ft', '660', '3.5×11.25"', '5.125×9"', 'W8×13'],
    ['12 ft', '660', '3.5×11.875"', '5.125×10.5"', 'W8×18'],
    ['16 ft', '660', '3.5×14"', '5.125×12"', 'W10×19'],
    ['20 ft', '660', '3.5×18"', '5.125×15"', 'W10×26'],
    ['24 ft', '660', '5.25×18"', '6.75×16.5"', 'W12×30']
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
    var span = getVal(spanEl);
    var trib = getVal(tribEl);
    var live = getVal(liveEl);
    var dead = getVal(deadEl);
    var type = typeEl.value;

    if (span <= 0 || trib <= 0) return;

    var totalPSF = live + dead;
    var wPLF = totalPSF * trib; // pounds per linear foot
    var wPLI = wPLF / 12; // pounds per linear inch
    var spanIn = span * 12;

    // Maximum moment: wL^2/8 (in-lbs)
    var Mmax = wPLI * spanIn * spanIn / 8;
    // Maximum shear: wL/2 (lbs)
    var Vmax = wPLF * span / 2;

    var beamName = '';

    if (type === 'lvl') {
      var Fb = 2600;
      var E = 1900000;
      var reqS = Mmax / Fb;
      var deflLimit = spanIn / 360;
      for (var i = 0; i < lvlSizes.length; i++) {
        var s = lvlSizes[i];
        var S = sectionMod(s.b, s.d);
        var I = momentOfInertia(s.b, s.d);
        var defl = 5 * wPLI * Math.pow(spanIn, 2) / (384 * E * I);
        if (S >= reqS && defl <= deflLimit) { beamName = s.name; break; }
      }
      if (!beamName) beamName = 'Exceeds LVL tables';
    } else if (type === 'glulam') {
      var Fb2 = 2400;
      var E2 = 1800000;
      var reqS2 = Mmax / Fb2;
      var deflLimit2 = spanIn / 360;
      for (var j = 0; j < glulamSizes.length; j++) {
        var g = glulamSizes[j];
        var Sg = sectionMod(g.b, g.d);
        var Ig = momentOfInertia(g.b, g.d);
        var deflG = 5 * wPLI * Math.pow(spanIn, 2) / (384 * E2 * Ig);
        if (Sg >= reqS2 && deflG <= deflLimit2) { beamName = g.name; break; }
      }
      if (!beamName) beamName = 'Exceeds glulam tables';
    } else if (type === 'lumber') {
      var Fb3 = 1000;
      var E3 = 1700000;
      var reqS3 = Mmax / Fb3;
      var deflLimit3 = spanIn / 360;
      for (var k = 0; k < lumberSizes.length; k++) {
        var l = lumberSizes[k];
        var Sl = sectionMod(l.b, l.d);
        var Il = momentOfInertia(l.b, l.d);
        var deflL = 5 * wPLI * Math.pow(spanIn, 2) / (384 * E3 * Il);
        if (Sl >= reqS3 && deflL <= deflLimit3) { beamName = l.name; break; }
      }
      if (!beamName) beamName = 'Use LVL or steel';
    } else if (type === 'steel') {
      // Steel: Fb = 0.66 * Fy = 33ksi = 33000 psi
      var FbSteel = 33000;
      var Esteel = 29000000;
      var reqSs = Mmax / FbSteel;
      var deflLimitS = spanIn / 360;
      for (var m = 0; m < steelSections.length; m++) {
        var st = steelSections[m];
        var deflS = 5 * wPLI * Math.pow(spanIn, 2) / (384 * Esteel * st.Ix);
        if (st.Sx >= reqSs && deflS <= deflLimitS) { beamName = st.name; break; }
      }
      if (!beamName) beamName = 'Exceeds tables — consult engineer';
    }

    var maxDefl = spanIn / 360;

    document.getElementById('rBeamSize').textContent = beamName;
    document.getElementById('rTotalLoad').textContent = fmt(totalPSF, 0) + ' psf';
    document.getElementById('rPLF').textContent = fmt(wPLF, 0) + ' plf';
    document.getElementById('rMoment').textContent = fmt(Mmax / 12, 0) + ' ft-lbs';
    document.getElementById('rShear').textContent = fmt(Vmax, 0) + ' lbs';
    document.getElementById('rDeflect').textContent = 'L/360 = ' + fmt(maxDefl, 2) + '"';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [spanEl, tribEl, liveEl, deadEl, typeEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
