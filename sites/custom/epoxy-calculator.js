(function() {
  'use strict';

  // ── Constants ──────────────────────────────────────────────────────
  var CU_IN_TO_FL_OZ = 0.554113;
  var FL_OZ_PER_CUP  = 8;
  var FL_OZ_PER_QT   = 32;
  var FL_OZ_PER_GAL  = 128;

  // ── Presets: [label, type, dims, tip] ──────────────────────────────
  // dims: flat=[L,W,D], river=[L,W,D], round=[diameter,D]
  var presets = [
    ['Bar Top (24×48)',       'flat',  [48, 24, 0.125],  'Apply a seal coat first, then a flood coat at 1/8\".'],
    ['Coffee Table (24×48)',  'flat',  [48, 24, 0.125],  'Sand between coats with 220-grit for best adhesion.'],
    ['Kitchen Counter (25×96)', 'flat', [96, 25, 0.125], 'Work in sections for large countertops.'],
    ['Dining Table (42×72)', 'flat',   [72, 42, 0.125],  'Warm resin to 75-85°F for best self-leveling.'],
    ['River Table (36×72)',  'river',  [72, 6, 1.5],     'Use deep-pour epoxy. May require multiple pours.'],
    ['River Table (wide, 72×8)', 'river', [72, 8, 1.5],  'Do NOT use coating epoxy for deep pours.'],
    ['Coaster (4\" round)',  'round',  [4, 0.375],       'Silicone mold recommended. Demold after 24 hrs.'],
    ['Charcuterie Board (8×20)', 'flat', [20, 8, 0.125], 'Use food-safe epoxy only.'],
    ['Serving Tray (12×18)', 'flat',  [18, 12, 0.125],   'Food-safe formula required for food contact.'],
    ['Penny Floor (1 sq ft)', 'flat', [12, 12, 0.125],   'Seal coat pennies first to prevent bubbles.'],
    ['Round Table Top (36\" dia)', 'round', [36, 0.125],  'Self-leveling — ensure surface is dead level.'],
    ['Clock Face (12\" dia)',  'round', [12, 0.25],       'Embed items before the epoxy starts to gel.']
  ];

  // ── State ──────────────────────────────────────────────────────────
  var currentType  = 'flat';
  var currentRatio = 1;   // 1 = 1:1, 2 = 2:1
  var currentWaste = 10;  // percent

  // ── DOM helpers ────────────────────────────────────────────────────
  function $(id) { return document.getElementById(id); }

  function showOnly(type) {
    $('flatInputs').style.display  = type === 'flat'  ? '' : 'none';
    $('riverInputs').style.display = type === 'river' ? '' : 'none';
    $('roundInputs').style.display = type === 'round' ? '' : 'none';
  }

  // ── Project type switching ─────────────────────────────────────────
  var typeBtns = document.querySelectorAll('.type-btn');
  typeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      typeBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentType = btn.getAttribute('data-type');
      showOnly(currentType);
    });
  });

  // ── Ratio toggle ──────────────────────────────────────────────────
  var ratioBtns = document.querySelectorAll('[data-ratio]');
  ratioBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      ratioBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentRatio = parseInt(btn.getAttribute('data-ratio'), 10);
    });
  });

  // ── Waste toggle ──────────────────────────────────────────────────
  var wasteBtns = document.querySelectorAll('[data-waste]');
  wasteBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      wasteBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentWaste = parseInt(btn.getAttribute('data-waste'), 10);
    });
  });

  // ── Volume calculation (returns cubic inches) ─────────────────────
  function calcVolume() {
    var vol = 0;
    if (currentType === 'flat') {
      var l = parseFloat($('flatLength').value);
      var w = parseFloat($('flatWidth').value);
      var d = parseFloat($('flatDepth').value);
      if (isNaN(l) || isNaN(w) || isNaN(d) || l <= 0 || w <= 0 || d <= 0) return NaN;
      vol = l * w * d;
    } else if (currentType === 'river') {
      var rl = parseFloat($('riverLength').value);
      var rw = parseFloat($('riverWidth').value);
      var rd = parseFloat($('riverDepth').value);
      if (isNaN(rl) || isNaN(rw) || isNaN(rd) || rl <= 0 || rw <= 0 || rd <= 0) return NaN;
      vol = rl * rw * rd;
    } else if (currentType === 'round') {
      var dia = parseFloat($('roundDiameter').value);
      var dep = parseFloat($('roundDepth').value);
      if (isNaN(dia) || isNaN(dep) || dia <= 0 || dep <= 0) return NaN;
      var r = dia / 2;
      vol = Math.PI * r * r * dep;
    }
    return vol;
  }

  // ── Format helpers ────────────────────────────────────────────────
  function fmt(n, decimals) {
    if (typeof decimals === 'undefined') decimals = 1;
    if (n >= 100) decimals = 0;
    return n.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function convertUnits(flOz) {
    var parts = [];
    if (flOz >= FL_OZ_PER_GAL) {
      parts.push(fmt(flOz / FL_OZ_PER_GAL) + ' gal');
    }
    if (flOz >= FL_OZ_PER_QT && flOz < FL_OZ_PER_GAL * 4) {
      parts.push(fmt(flOz / FL_OZ_PER_QT) + ' qt');
    }
    if (flOz >= FL_OZ_PER_CUP) {
      parts.push(fmt(flOz / FL_OZ_PER_CUP) + ' cups');
    }
    parts.push(fmt(flOz) + ' fl oz');
    return parts.join('  ·  ');
  }

  function formatPrimary(flOz) {
    if (flOz >= FL_OZ_PER_GAL) {
      return fmt(flOz / FL_OZ_PER_GAL) + ' gallons';
    }
    if (flOz >= FL_OZ_PER_QT) {
      return fmt(flOz / FL_OZ_PER_QT) + ' quarts';
    }
    if (flOz >= FL_OZ_PER_CUP * 2) {
      return fmt(flOz / FL_OZ_PER_CUP) + ' cups';
    }
    return fmt(flOz) + ' fl oz';
  }

  // ── Main calculation ──────────────────────────────────────────────
  function calculate(customTip) {
    var cuIn = calcVolume();
    if (isNaN(cuIn)) {
      // Shake the button briefly to signal invalid input
      var btn = $('calcBtn');
      btn.style.background = '#dc2626';
      btn.textContent = 'Enter valid dimensions';
      setTimeout(function() {
        btn.style.background = '';
        btn.textContent = 'Calculate Epoxy Needed';
      }, 1500);
      return;
    }

    // Base fluid ounces
    var baseFlOz = cuIn * CU_IN_TO_FL_OZ;

    // Apply waste factor
    var totalFlOz = baseFlOz * (1 + currentWaste / 100);

    // Split by ratio
    var resinFlOz, hardenerFlOz;
    if (currentRatio === 1) {
      resinFlOz    = totalFlOz / 2;
      hardenerFlOz = totalFlOz / 2;
    } else {
      // 2:1 — resin is 2 parts, hardener is 1 part
      resinFlOz    = totalFlOz * (2 / 3);
      hardenerFlOz = totalFlOz * (1 / 3);
    }

    // Populate results
    $('totalOz').textContent = fmt(totalFlOz) + ' fl oz';
    $('totalAlt').textContent = convertUnits(totalFlOz);

    $('resinAmt').textContent = fmt(resinFlOz) + ' fl oz';
    $('hardenerAmt').textContent = fmt(hardenerFlOz) + ' fl oz';

    // Detailed breakdown
    var breakdownHTML = '<table class="breakdown-table">' +
      '<tr><td>Project volume</td><td>' + fmt(cuIn) + ' cubic inches</td></tr>' +
      '<tr><td>Base epoxy (no waste)</td><td>' + fmt(baseFlOz) + ' fl oz</td></tr>';
    if (currentWaste > 0) {
      breakdownHTML += '<tr><td>Waste factor (+ ' + currentWaste + '%)</td><td>' + fmt(totalFlOz - baseFlOz) + ' fl oz</td></tr>';
    }
    breakdownHTML += '<tr><td><strong>Total mixed epoxy</strong></td><td><strong>' + fmt(totalFlOz) + ' fl oz (' + formatPrimary(totalFlOz) + ')</strong></td></tr>' +
      '<tr><td>Resin (Part A)</td><td>' + fmt(resinFlOz) + ' fl oz (' + formatPrimary(resinFlOz) + ')</td></tr>' +
      '<tr><td>Hardener (Part B)</td><td>' + fmt(hardenerFlOz) + ' fl oz (' + formatPrimary(hardenerFlOz) + ')</td></tr>' +
      '</table>';

    $('breakdown').innerHTML = breakdownHTML;

    // Tip
    var tip = customTip || getTip(currentType, totalFlOz, cuIn);
    $('resultTip').textContent = tip;

    var resultEl = $('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ── Context-aware tips ────────────────────────────────────────────
  function getTip(type, flOz, cuIn) {
    // Figure out depth for the current project
    var depth = 0;
    if (type === 'flat')  depth = parseFloat($('flatDepth').value) || 0;
    if (type === 'river') depth = parseFloat($('riverDepth').value) || 0;
    if (type === 'round') depth = parseFloat($('roundDepth').value) || 0;

    if (depth > 0.25 && type !== 'round') {
      return 'Pour depth is over 1/4\". Use a deep-pour (slow-cure) epoxy to prevent overheating and cracking. Standard coating epoxy can exotherm at this depth.';
    }
    if (flOz > FL_OZ_PER_GAL) {
      return 'Large project — mix in batches to keep within your epoxy\'s pot life (typically 20-45 minutes). Have everything prepped before you start mixing.';
    }
    if (type === 'flat') {
      return 'For best results, apply a thin seal coat first (1/16\"), let it tack up for 4-6 hours, then apply your flood coat. This prevents bubbles from porous wood.';
    }
    if (type === 'round') {
      return 'Ensure your mold is level before pouring. Use mold release spray for easy demolding. Pop surface bubbles with a quick pass of a heat gun.';
    }
    return 'Always mix thoroughly for the full recommended time (3-5 minutes). Scrape sides and bottom of the mixing cup. Under-mixed epoxy will remain tacky and never fully cure.';
  }

  // ── Render presets ────────────────────────────────────────────────
  var presetGrid = $('presetGrid');
  presets.forEach(function(p) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-btn';

    var dimLabel = '';
    if (p[1] === 'round') {
      dimLabel = p[2][0] + '\" dia × ' + p[2][1] + '\"';
    } else {
      dimLabel = p[2][0] + '\" × ' + p[2][1] + '\" × ' + p[2][2] + '\"';
    }
    btn.innerHTML = p[0] + '<span>' + dimLabel + '</span>';

    btn.addEventListener('click', function() {
      // Switch to the correct project type
      currentType = p[1];
      typeBtns.forEach(function(b) { b.classList.remove('active'); });
      document.querySelector('[data-type="' + p[1] + '"]').classList.add('active');
      showOnly(p[1]);

      // Fill in dimensions
      if (p[1] === 'flat') {
        $('flatLength').value = p[2][0];
        $('flatWidth').value  = p[2][1];
        $('flatDepth').value  = p[2][2];
      } else if (p[1] === 'river') {
        $('riverLength').value = p[2][0];
        $('riverWidth').value  = p[2][1];
        $('riverDepth').value  = p[2][2];
      } else if (p[1] === 'round') {
        $('roundDiameter').value = p[2][0];
        $('roundDepth').value    = p[2][1];
      }

      calculate(p[3]);
    });
    presetGrid.appendChild(btn);
  });

  // ── Button click ──────────────────────────────────────────────────
  $('calcBtn').addEventListener('click', function() {
    calculate();
  });

  // ── Enter key on any input triggers calculation ───────────────────
  var allInputs = document.querySelectorAll('#dimInputs input[type="number"]');
  allInputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

  // ── Render chart ──────────────────────────────────────────────────
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    var chartData = [
      ['Bar Top Coating',        '24\" × 48\" × 1/8\"',   '~80 fl oz (2.5 qt)',     '2 thin coats recommended'],
      ['Coffee Table Top',       '24\" × 48\" × 1/8\"',   '~80 fl oz (2.5 qt)',     'Sand between coats with 220 grit'],
      ['Kitchen Countertop',     '25\" × 96\" × 1/8\"',   '~166 fl oz (1.3 gal)',   'Seal coat first, then flood coat'],
      ['Dining Table',           '42\" × 72\" × 1/8\"',   '~210 fl oz (1.6 gal)',   'Apply in sections if needed'],
      ['River Table (narrow)',   '36\" × 4\" × 1.5\"',    '~120 fl oz (0.9 gal)',   'Use deep-pour epoxy'],
      ['River Table (wide)',     '72\" × 8\" × 1.5\"',    '~478 fl oz (3.7 gal)',   'May need multiple pours'],
      ['Full Table Cast',        '36\" × 72\" × 1.5\"',   '~2,153 fl oz (16.8 gal)','Deep-pour formula required'],
      ['Coaster (single)',       '4\" dia × 3/8\"',       '~2.6 fl oz',             'Silicone mold recommended'],
      ['Coaster Set (6)',        '6 × 4\" dia × 3/8\"',   '~16 fl oz (2 cups)',     'Mix one batch for all 6'],
      ['Charcuterie Board',      '8\" × 20\" × 1/8\"',    '~11 fl oz',              'Food-safe epoxy only'],
      ['Penny Floor (per sq ft)','12\" × 12\" × 1/8\"',   '~10 fl oz per sq ft',    'Seal coat pennies first'],
      ['Tumbler (single)',       '~3\" dia × 7\"',        '~2-3 fl oz',             'Apply on turner, thin coats'],
      ['Serving Tray',           '12\" × 18\" × 1/8\"',   '~15 fl oz',              'Use food-safe formula'],
      ['Garage Floor (per sq ft)','12\" × 12\" × 1/16\"', '~5 fl oz per sq ft',     'Primer coat required']
    ];
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

})();
