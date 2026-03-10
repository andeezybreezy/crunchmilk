(function() {
  'use strict';

  var wallLength = document.getElementById('wallLength');
  var wallHeight = document.getElementById('wallHeight');
  var studSpacing = document.getElementById('studSpacing');
  var corners = document.getElementById('corners');
  var addDoorBtn = document.getElementById('addDoorBtn');
  var addWindowBtn = document.getElementById('addWindowBtn');
  var openingsList = document.getElementById('openingsList');

  var outStuds = document.getElementById('outStuds');
  var outKing = document.getElementById('outKing');
  var outJack = document.getElementById('outJack');
  var outCripple = document.getElementById('outCripple');
  var outPlates = document.getElementById('outPlates');
  var outHeaders = document.getElementById('outHeaders');
  var outTotalStuds = document.getElementById('outTotalStuds');
  var outCornerStuds = document.getElementById('outCornerStuds');
  var resultTip = document.getElementById('resultTip');

  var openings = [];
  var openingId = 0;

  function addOpening(type, w, h) {
    openings.push({ id: ++openingId, type: type, width: w, height: h });
    renderOpenings();
    calculate();
  }

  function removeOpening(id) {
    openings = openings.filter(function(o) { return o.id !== id; });
    renderOpenings();
    calculate();
  }

  function renderOpenings() {
    openingsList.innerHTML = '';
    openings.forEach(function(o) {
      var div = document.createElement('div');
      div.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:8px;padding:8px 12px;background:#f5f5f5;border-radius:8px;flex-wrap:wrap';
      div.innerHTML = '<strong style="min-width:60px">' + o.type + '</strong>' +
        '<label style="font-size:0.85rem">W: <input type="number" value="' + o.width + '" min="1" step="1" style="width:60px;padding:6px;border:1px solid #ccc;border-radius:4px" data-id="' + o.id + '" data-field="width"></label>' +
        '<label style="font-size:0.85rem">H: <input type="number" value="' + o.height + '" min="1" step="1" style="width:60px;padding:6px;border:1px solid #ccc;border-radius:4px" data-id="' + o.id + '" data-field="height"></label>' +
        '<span style="font-size:0.85rem;color:var(--text-light)">inches</span>' +
        '<button type="button" data-remove="' + o.id + '" style="margin-left:auto;background:none;border:none;color:#991b1b;cursor:pointer;font-size:1.2rem;padding:4px 8px">&times;</button>';
      openingsList.appendChild(div);
    });

    // Bind events
    openingsList.querySelectorAll('input[data-id]').forEach(function(inp) {
      inp.addEventListener('input', function() {
        var id = parseInt(inp.dataset.id, 10);
        var field = inp.dataset.field;
        var val = parseFloat(inp.value) || 0;
        openings.forEach(function(o) {
          if (o.id === id) o[field] = val;
        });
        calculate();
      });
    });
    openingsList.querySelectorAll('button[data-remove]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        removeOpening(parseInt(btn.dataset.remove, 10));
      });
    });
  }

  addDoorBtn.addEventListener('click', function() { addOpening('Door', 36, 80); });
  addWindowBtn.addEventListener('click', function() { addOpening('Window', 36, 48); });

  function headerSize(widthIn) {
    if (widthIn <= 48) return 'Dbl 2×6';
    if (widthIn <= 72) return 'Dbl 2×8';
    if (widthIn <= 96) return 'Dbl 2×10';
    if (widthIn <= 120) return 'Dbl 2×12';
    return 'LVL/Engineer';
  }

  function calculate() {
    var len = parseFloat(wallLength.value);
    var ht = parseFloat(wallHeight.value) * 12; // to inches
    var spacing = parseInt(studSpacing.value, 10);
    var cornerCount = parseInt(corners.value, 10);

    if (isNaN(len) || len <= 0) {
      outStuds.textContent = '—';
      outKing.textContent = '—';
      outJack.textContent = '—';
      outCripple.textContent = '—';
      outPlates.textContent = '—';
      outHeaders.textContent = '—';
      outTotalStuds.textContent = '—';
      outCornerStuds.textContent = '—';
      resultTip.textContent = 'Enter wall length to calculate.';
      return;
    }

    var lenIn = len * 12;

    // Regular studs along wall
    var regularStuds = Math.floor(lenIn / spacing) + 1;

    // Openings analysis
    var totalKing = 0;
    var totalJack = 0;
    var totalCripple = 0;
    var displacedStuds = 0;
    var headerList = [];

    openings.forEach(function(o) {
      totalKing += 2;
      totalJack += 2;

      // Cripple studs above header
      var cripplesAbove = Math.max(0, Math.floor(o.width / spacing) - 1);
      // For windows, also cripples below sill
      var cripplesBelow = 0;
      if (o.type === 'Window') {
        cripplesBelow = Math.max(0, Math.floor(o.width / spacing) - 1);
      }
      totalCripple += cripplesAbove + cripplesBelow;

      // Studs displaced by this opening (studs that would fall within the opening)
      var displaced = Math.max(0, Math.floor(o.width / spacing) - 1);
      displacedStuds += displaced;

      headerList.push(headerSize(o.width) + ' × ' + (o.width + 3) + '"');
    });

    // Corner studs (3 per corner/intersection)
    var cornerStuds = cornerCount * 3;

    // Adjust regular studs: subtract displaced, they are replaced by king/jack
    regularStuds = Math.max(0, regularStuds - displacedStuds);

    var totalStuds = regularStuds + totalKing + totalJack + totalCripple + cornerStuds;

    // Plates: 3 runs (1 bottom + 2 top)
    var plateLF = len * 3;

    outStuds.textContent = regularStuds;
    outKing.textContent = totalKing;
    outJack.textContent = totalJack;
    outCripple.textContent = totalCripple;
    outCornerStuds.textContent = cornerStuds + ' (' + cornerCount + ' posts)';
    outPlates.textContent = plateLF.toFixed(1) + ' LF';
    outHeaders.textContent = headerList.length > 0 ? headerList.join(', ') : 'None';
    outTotalStuds.textContent = totalStuds;

    resultTip.textContent = totalStuds + ' total studs + ' + plateLF.toFixed(0) + ' LF plates for a ' + len + ' ft wall at ' + spacing + '" OC with ' + openings.length + ' opening(s).';
  }

  wallLength.addEventListener('input', calculate);
  wallHeight.addEventListener('change', calculate);
  studSpacing.addEventListener('change', calculate);
  corners.addEventListener('change', calculate);

  calculate();
})();
