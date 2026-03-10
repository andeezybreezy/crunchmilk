(function() {
  'use strict';

  var openingEl = document.getElementById('openingWidth');
  var wallTypeEl = document.getElementById('wallType');
  var storiesEl = document.getElementById('stories');
  var roofLoadEl = document.getElementById('roofLoad');
  var wallWidthEl = document.getElementById('wallWidth');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  // Header lookup: [maxWidth, headerSize, material]
  var bearingHeaders1 = [
    [4, '(2) 2×6', 'Dimensional lumber'],
    [6, '(2) 2×8', 'Dimensional lumber'],
    [8, '(2) 2×10', 'Dimensional lumber'],
    [10, '(2) 2×12', 'Dimensional lumber'],
    [12, '3.5×9.25" LVL', 'LVL'],
    [16, '3.5×11.875" LVL', 'LVL'],
    [20, '3.5×14" LVL', 'LVL']
  ];

  var bearingHeaders2 = [
    [4, '(2) 2×8', 'Dimensional lumber'],
    [5, '(2) 2×10', 'Dimensional lumber'],
    [6, '(2) 2×12', 'Dimensional lumber'],
    [8, '3.5×9.25" LVL', 'LVL'],
    [10, '3.5×11.25" LVL', 'LVL'],
    [12, '3.5×11.875" LVL', 'LVL'],
    [16, '3.5×14" LVL', 'LVL'],
    [20, '5.25×14" LVL', 'LVL']
  ];

  // Wider buildings need bigger headers — bump up one size for building width > 32'
  function getHeader(width, stories, buildingWidth) {
    var table = stories >= 2 ? bearingHeaders2 : bearingHeaders1;
    var bumpUp = buildingWidth > 32 ? 1 : 0;

    var idx = 0;
    for (var i = 0; i < table.length; i++) {
      if (width <= table[i][0]) { idx = i; break; }
      if (i === table.length - 1) idx = i;
    }
    idx = Math.min(idx + bumpUp, table.length - 1);
    return { size: table[idx][1], material: table[idx][2] };
  }

  var chartData = [
    ['Up to 4\'', '(2) 2×6', '1 each side', 'Dimensional lumber'],
    ['4\' – 6\'', '(2) 2×8', '1 each side', 'Dimensional lumber'],
    ['6\' – 8\'', '(2) 2×10', '2 each side', 'Dimensional lumber'],
    ['8\' – 10\'', '(2) 2×12', '2 each side', 'Dimensional lumber'],
    ['10\' – 12\'', '3.5×9.25" LVL', '2 each side', 'LVL'],
    ['12\' – 16\'', '3.5×11.875" LVL', '3 each side', 'LVL']
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
    var width = getVal(openingEl);
    var wallType = wallTypeEl.value;
    var stories = parseInt(storiesEl.value);
    var buildingWidth = getVal(roofLoadEl);
    var wallW = parseInt(wallWidthEl.value);

    if (width <= 0) return;

    var headerSize, material;

    if (wallType === 'nonbearing' || stories === 0) {
      if (width <= 8) {
        headerSize = 'Flat 2×4';
        material = 'Dimensional lumber';
      } else {
        headerSize = '(2) 2×6';
        material = 'Dimensional lumber';
      }
    } else {
      var h = getHeader(width, stories, buildingWidth);
      headerSize = h.size;
      material = h.material;
    }

    // Jack studs: 1 per 4' of opening, minimum 1
    var jacks = Math.max(1, Math.ceil(width / 4));
    if (wallType === 'nonbearing') jacks = 1;

    // Cripple studs above header: based on opening width at stud spacing
    var cripples = Math.max(0, Math.ceil((width * 12) / 16) - 1);

    // Rough opening is typically opening + 2" for jamb/shimming
    var roughWidth = (width * 12) + 2;

    // Total framing: 2 king studs + jack studs + cripples
    var totalStuds = 2 + (jacks * 2) + cripples;

    document.getElementById('rHeader').textContent = headerSize;
    document.getElementById('rJacks').textContent = jacks;
    document.getElementById('rMaterial').textContent = material;
    document.getElementById('rCripples').textContent = cripples;
    document.getElementById('rRough').textContent = roughWidth + '" wide';
    document.getElementById('rTotalStuds').textContent = totalStuds;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [openingEl, wallTypeEl, storiesEl, roofLoadEl, wallWidthEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
