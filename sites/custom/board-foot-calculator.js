(function() {
  'use strict';

  // ── State ──
  var lumberList = [];
  var listIdCounter = 0;

  // ── DOM refs ──
  var thicknessSelect = document.getElementById('thicknessSelect');
  var thicknessCustom = document.getElementById('thicknessCustom');
  var boardWidth = document.getElementById('boardWidth');
  var lengthSelect = document.getElementById('lengthSelect');
  var boardLength = document.getElementById('boardLength');
  var quantity = document.getElementById('quantity');
  var pricePerBF = document.getElementById('pricePerBF');
  var addToListBtn = document.getElementById('addToListBtn');
  var clearListBtn = document.getElementById('clearListBtn');
  var bfPerPiece = document.getElementById('bfPerPiece');
  var bfTotal = document.getElementById('bfTotal');
  var totalCost = document.getElementById('totalCost');
  var costItem = document.getElementById('costItem');
  var resultFormula = document.getElementById('resultFormula');
  var lumberListCard = document.getElementById('lumberListCard');
  var lumberListBody = document.getElementById('lumberListBody');
  var grandTotalBF = document.getElementById('grandTotalBF');
  var grandTotalCost = document.getElementById('grandTotalCost');
  var grandTotalCostWrap = document.getElementById('grandTotalCostWrap');

  // ── Presets ──
  // [label, sublabel, thickness, width, length, price]
  var dimensionalPresets = [
    ['1×6×8',  '4.00 BF',  1,  6, 8, null],
    ['1×8×8',  '5.33 BF',  1,  8, 8, null],
    ['1×12×8', '8.00 BF',  1, 12, 8, null],
    ['2×4×8',  '5.33 BF',  2,  4, 8, null],
    ['2×6×8',  '8.00 BF',  2,  6, 8, null],
    ['2×8×8',  '10.67 BF', 2,  8, 8, null],
    ['2×10×8', '13.33 BF', 2, 10, 8, null],
    ['2×12×8', '16.00 BF', 2, 12, 8, null]
  ];

  var hardwoodPresets = [
    ['4/4 Walnut',  '6\"×8\' — $12/BF', 1,    6, 8, 12],
    ['8/4 Walnut',  '6\"×8\' — $14/BF', 2,    6, 8, 14],
    ['4/4 Maple',   '6\"×8\' — $7/BF',  1,    6, 8, 7],
    ['8/4 Cherry',  '6\"×8\' — $10/BF', 2,    6, 8, 10]
  ];

  // ── Quarter notation map ──
  var quarterMap = {
    '4/4': 1, '5/4': 1.25, '6/4': 1.5, '8/4': 2,
    '10/4': 2.5, '12/4': 3, '16/4': 4
  };

  // ── Parse thickness ──
  function getThickness() {
    if (thicknessSelect.value === '') {
      // Custom input
      var val = thicknessCustom.value.trim();
      // Check quarter notation typed manually
      if (quarterMap[val] !== undefined) return quarterMap[val];
      var num = parseFloat(val);
      return isNaN(num) || num <= 0 ? NaN : num;
    }
    return parseFloat(thicknessSelect.value);
  }

  function getWidth() {
    var v = parseFloat(boardWidth.value);
    return isNaN(v) || v <= 0 ? NaN : v;
  }

  function getLength() {
    var v = parseFloat(boardLength.value);
    return isNaN(v) || v <= 0 ? NaN : v;
  }

  function getQuantity() {
    var v = parseInt(quantity.value, 10);
    return isNaN(v) || v < 1 ? 1 : v;
  }

  function getPrice() {
    var v = parseFloat(pricePerBF.value);
    return isNaN(v) || v < 0 ? null : v;
  }

  // ── Calculate ──
  function calcBoardFeet(t, w, l) {
    return t * w * l / 12;
  }

  function formatBF(n) {
    return n.toFixed(2);
  }

  function formatCurrency(n) {
    return '$' + n.toFixed(2);
  }

  // ── Format thickness for display ──
  function thicknessLabel(t) {
    // Check if it matches a quarter size
    for (var key in quarterMap) {
      if (quarterMap[key] === t) return key + ' (' + t + '")';
    }
    return t + '"';
  }

  // ── Live update ──
  function updateResult() {
    var t = getThickness();
    var w = getWidth();
    var l = getLength();
    var q = getQuantity();
    var price = getPrice();

    if (isNaN(t) || isNaN(w) || isNaN(l)) {
      bfPerPiece.textContent = '—';
      bfTotal.textContent = '—';
      resultFormula.textContent = 'Enter dimensions above';
      costItem.style.display = 'none';
      return;
    }

    var bf = calcBoardFeet(t, w, l);
    var totalBf = bf * q;

    bfPerPiece.textContent = formatBF(bf);
    bfTotal.textContent = formatBF(totalBf);

    // Formula display
    var formula = t + '" × ' + w + '" × ' + l + '\' ÷ 12 = ' + formatBF(bf) + ' BF';
    if (q > 1) {
      formula += ' × ' + q + ' pieces = ' + formatBF(totalBf) + ' BF';
    }

    if (price !== null && price > 0) {
      var cost = totalBf * price;
      totalCost.textContent = formatCurrency(cost);
      costItem.style.display = '';
      formula += ' — Cost: ' + formatCurrency(cost);
    } else {
      costItem.style.display = 'none';
    }

    resultFormula.textContent = formula;
  }

  // ── Thickness select/custom toggle ──
  thicknessSelect.addEventListener('change', function() {
    if (thicknessSelect.value === '') {
      thicknessCustom.style.display = '';
      thicknessCustom.focus();
    } else {
      thicknessCustom.style.display = 'none';
      thicknessCustom.value = '';
    }
    updateResult();
  });

  thicknessCustom.addEventListener('input', updateResult);

  // ── Length select/input sync ──
  lengthSelect.addEventListener('change', function() {
    if (lengthSelect.value === 'custom') {
      boardLength.value = '';
      boardLength.focus();
    } else {
      boardLength.value = lengthSelect.value;
    }
    updateResult();
  });

  boardLength.addEventListener('input', function() {
    // Sync select if it matches a preset
    var val = boardLength.value;
    var opts = lengthSelect.options;
    var matched = false;
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].value === val) {
        lengthSelect.value = val;
        matched = true;
        break;
      }
    }
    if (!matched) {
      lengthSelect.value = 'custom';
    }
    updateResult();
  });

  // ── Live input listeners ──
  boardWidth.addEventListener('input', updateResult);
  quantity.addEventListener('input', updateResult);
  pricePerBF.addEventListener('input', updateResult);

  // ── Lumber list ──
  function renderList() {
    lumberListBody.innerHTML = '';

    if (lumberList.length === 0) {
      lumberListCard.style.display = 'none';
      return;
    }

    lumberListCard.style.display = '';

    var grandBF = 0;
    var grandCost = 0;
    var hasCost = false;

    lumberList.forEach(function(item) {
      grandBF += item.totalBF;
      if (item.cost !== null) {
        grandCost += item.cost;
        hasCost = true;
      }

      var tr = document.createElement('tr');
      var dims = item.thicknessDisplay + ' × ' + item.width + '" × ' + item.length + '\'';
      var costStr = item.cost !== null ? formatCurrency(item.cost) : '—';
      tr.innerHTML = '<td>' + dims + '</td>' +
        '<td>' + item.qty + '</td>' +
        '<td>' + formatBF(item.bfEach) + '</td>' +
        '<td>' + formatBF(item.totalBF) + '</td>' +
        '<td>' + costStr + '</td>' +
        '<td><button type="button" class="remove-item-btn" data-id="' + item.id + '" style="background:none;border:none;color:#991b1b;cursor:pointer;font-size:1.1rem;padding:4px 8px" title="Remove item">&times;</button></td>';
      lumberListBody.appendChild(tr);
    });

    grandTotalBF.textContent = formatBF(grandBF);

    if (hasCost) {
      grandTotalCostWrap.style.display = '';
      grandTotalCost.textContent = formatCurrency(grandCost);
    } else {
      grandTotalCostWrap.style.display = 'none';
    }

    // Attach remove handlers
    var removeBtns = lumberListBody.querySelectorAll('.remove-item-btn');
    removeBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = parseInt(btn.dataset.id, 10);
        lumberList = lumberList.filter(function(item) { return item.id !== id; });
        renderList();
      });
    });
  }

  addToListBtn.addEventListener('click', function() {
    var t = getThickness();
    var w = getWidth();
    var l = getLength();
    var q = getQuantity();
    var price = getPrice();

    if (isNaN(t) || isNaN(w) || isNaN(l)) return;

    var bf = calcBoardFeet(t, w, l);
    var totalBf = bf * q;
    var cost = (price !== null && price > 0) ? totalBf * price : null;

    lumberList.push({
      id: ++listIdCounter,
      thickness: t,
      thicknessDisplay: thicknessLabel(t),
      width: w,
      length: l,
      qty: q,
      bfEach: bf,
      totalBF: totalBf,
      pricePerBF: price,
      cost: cost
    });

    renderList();
    lumberListCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  clearListBtn.addEventListener('click', function() {
    lumberList = [];
    renderList();
  });

  // ── Presets ──
  function renderPresets(presets, containerId) {
    var container = document.getElementById(containerId);
    presets.forEach(function(p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'preset-btn';
      btn.innerHTML = p[0] + '<span>' + p[1] + '</span>';
      btn.addEventListener('click', function() {
        // Set thickness
        var tVal = String(p[2]);
        var matched = false;
        for (var i = 0; i < thicknessSelect.options.length; i++) {
          if (thicknessSelect.options[i].value === tVal) {
            thicknessSelect.value = tVal;
            thicknessCustom.style.display = 'none';
            thicknessCustom.value = '';
            matched = true;
            break;
          }
        }
        if (!matched) {
          thicknessSelect.value = '';
          thicknessCustom.style.display = '';
          thicknessCustom.value = tVal;
        }

        // Set width
        boardWidth.value = p[3];

        // Set length
        var lVal = String(p[4]);
        var lMatched = false;
        for (var j = 0; j < lengthSelect.options.length; j++) {
          if (lengthSelect.options[j].value === lVal) {
            lengthSelect.value = lVal;
            lMatched = true;
            break;
          }
        }
        if (!lMatched) {
          lengthSelect.value = 'custom';
        }
        boardLength.value = p[4];

        // Set price
        if (p[5] !== null) {
          pricePerBF.value = p[5];
        } else {
          pricePerBF.value = '';
        }

        quantity.value = 1;
        updateResult();
      });
      container.appendChild(btn);
    });
  }

  renderPresets(dimensionalPresets, 'presetDimensional');
  renderPresets(hardwoodPresets, 'presetHardwood');

  // ── Initial calculation ──
  updateResult();

})();
