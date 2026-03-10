(function() {
  'use strict';

  // IRC span table data: spans in inches
  // Format: spanData[species][grade][joistSize][spacing]
  var spanData = {
    df: { // Douglas Fir-Larch
      ss: { '2x6': {12:138,16:126,24:110}, '2x8': {12:182,16:166,24:145}, '2x10': {12:232,16:212,24:185}, '2x12': {12:282,16:258,24:225} },
      '1': { '2x6': {12:132,16:120,24:100}, '2x8': {12:174,16:158,24:132}, '2x10': {12:222,16:195,24:165}, '2x12': {12:270,16:234,24:197} },
      '2': { '2x6': {12:126,16:109,24:91}, '2x8': {12:166,16:144,24:120}, '2x10': {12:213,16:185,24:156}, '2x12': {12:259,16:224,24:185} },
      '3': { '2x6': {12:102,16:88,24:73}, '2x8': {12:134,16:116,24:97}, '2x10': {12:171,16:148,24:123}, '2x12': {12:208,16:180,24:149} }
    },
    sp: { // Southern Pine
      ss: { '2x6': {12:138,16:126,24:110}, '2x8': {12:182,16:166,24:145}, '2x10': {12:232,16:212,24:185}, '2x12': {12:282,16:258,24:225} },
      '1': { '2x6': {12:132,16:120,24:105}, '2x8': {12:174,16:158,24:138}, '2x10': {12:222,16:203,24:168}, '2x12': {12:270,16:242,24:200} },
      '2': { '2x6': {12:128,16:116,24:96}, '2x8': {12:169,16:148,24:123}, '2x10': {12:215,16:188,24:156}, '2x12': {12:262,16:228,24:188} },
      '3': { '2x6': {12:104,16:90,24:75}, '2x8': {12:137,16:119,24:99}, '2x10': {12:175,16:152,24:126}, '2x12': {12:213,16:184,24:153} }
    },
    hem: { // Hem-Fir
      ss: { '2x6': {12:132,16:120,24:105}, '2x8': {12:174,16:158,24:138}, '2x10': {12:222,16:203,24:177}, '2x12': {12:270,16:246,24:215} },
      '1': { '2x6': {12:126,16:115,24:100}, '2x8': {12:166,16:151,24:132}, '2x10': {12:212,16:193,24:159}, '2x12': {12:258,16:230,24:190} },
      '2': { '2x6': {12:120,16:104,24:86}, '2x8': {12:158,16:137,24:114}, '2x10': {12:202,16:175,24:145}, '2x12': {12:246,16:213,24:176} },
      '3': { '2x6': {12:96,16:83,24:69}, '2x8': {12:126,16:110,24:91}, '2x10': {12:162,16:140,24:116}, '2x12': {12:197,16:170,24:141} }
    },
    spf: { // Spruce-Pine-Fir
      ss: { '2x6': {12:126,16:115,24:100}, '2x8': {12:166,16:151,24:132}, '2x10': {12:212,16:193,24:169}, '2x12': {12:258,16:235,24:205} },
      '1': { '2x6': {12:120,16:110,24:96}, '2x8': {12:158,16:144,24:126}, '2x10': {12:202,16:184,24:152}, '2x12': {12:246,16:220,24:182} },
      '2': { '2x6': {12:120,16:104,24:86}, '2x8': {12:158,16:137,24:114}, '2x10': {12:202,16:175,24:145}, '2x12': {12:246,16:213,24:176} },
      '3': { '2x6': {12:96,16:83,24:69}, '2x8': {12:126,16:110,24:91}, '2x10': {12:162,16:140,24:116}, '2x12': {12:197,16:170,24:141} }
    }
  };

  function inToFtIn(inches) {
    var ft = Math.floor(inches / 12);
    var inn = Math.round(inches % 12);
    if (inn === 12) { ft++; inn = 0; }
    return ft + "'" + inn + '"';
  }

  var sizeEl = document.getElementById('joistSize');
  var speciesEl = document.getElementById('species');
  var gradeEl = document.getElementById('grade');
  var spacingEl = document.getElementById('spacing');
  var liveEl = document.getElementById('liveLoad');
  var actualEl = document.getElementById('actualSpan');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['2×6', '10\'-6"', '9\'-1"', '7\'-7"'],
    ['2×8', '13\'-10"', '12\'-0"', '10\'-2"'],
    ['2×10', '17\'-9"', '15\'-5"', '13\'-0"'],
    ['2×12', '21\'-7"', '18\'-8"', '15\'-5"']
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
    var size = sizeEl.value;
    var species = speciesEl.value;
    var grade = gradeEl.value;
    var spacing = spacingEl.value;
    var liveLoad = parseInt(liveEl.value);
    var actualSpan = getVal(actualEl);

    var speciesData = spanData[species];
    if (!speciesData || !speciesData[grade] || !speciesData[grade][size]) return;

    var maxSpanIn = speciesData[grade][size][parseInt(spacing)];
    if (!maxSpanIn) return;

    // Adjust for 30psf sleeping rooms (add ~15%)
    if (liveLoad === 30) {
      maxSpanIn = Math.round(maxSpanIn * 1.15);
    }

    var maxSpanFt = maxSpanIn / 12;
    var deadLoad = 10;
    var totalLoad = liveLoad + deadLoad;
    var deflectionLimit = maxSpanIn / 360;

    document.getElementById('rMaxSpan').textContent = inToFtIn(maxSpanIn) + ' (' + maxSpanFt.toFixed(1) + ' ft)';
    document.getElementById('rDead').textContent = deadLoad + ' psf';
    document.getElementById('rTotal').textContent = totalLoad + ' psf';
    document.getElementById('rDeflection').textContent = 'L/360 = ' + deflectionLimit.toFixed(2) + '"';

    // Status check against actual span
    if (actualSpan > 0) {
      var actualIn = actualSpan * 12;
      if (actualIn <= maxSpanIn) {
        document.getElementById('rStatus').innerHTML = '<span style="color:#16a34a">&#10004; OK</span>';
      } else {
        document.getElementById('rStatus').innerHTML = '<span style="color:#dc2626">&#10008; Exceeds max</span>';
      }
    } else {
      document.getElementById('rStatus').textContent = 'Enter span to check';
    }

    // Recommend smallest adequate joist
    var sizes = ['2x6', '2x8', '2x10', '2x12'];
    var recommended = size;
    if (actualSpan > 0) {
      var actualIn2 = actualSpan * 12;
      for (var i = 0; i < sizes.length; i++) {
        var s = sizes[i];
        if (speciesData[grade][s] && speciesData[grade][s][parseInt(spacing)] >= actualIn2) {
          recommended = s;
          break;
        }
        if (i === sizes.length - 1) recommended = 'LVL/I-Joist needed';
      }
    }
    document.getElementById('rRecommend').textContent = recommended.replace('x', '×');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [sizeEl, speciesEl, gradeEl, spacingEl, liveEl, actualEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
