(function() {
  'use strict';

  var ingredientCount = 0;

  function toFraction(val) {
    if (val === 0) return '0';
    var whole = Math.floor(val);
    var frac = val - whole;

    var fractions = [
      [1/8, '⅛'], [1/4, '¼'], [1/3, '⅓'], [3/8, '⅜'],
      [1/2, '½'], [5/8, '⅝'], [2/3, '⅔'], [3/4, '¾'],
      [7/8, '⅞']
    ];

    if (frac < 0.0625) {
      return whole === 0 ? '~0' : String(whole);
    }

    var closest = '';
    var minDiff = 1;
    for (var i = 0; i < fractions.length; i++) {
      var diff = Math.abs(frac - fractions[i][0]);
      if (diff < minDiff) {
        minDiff = diff;
        closest = fractions[i][1];
      }
    }

    if (minDiff > 0.08) {
      return val.toFixed(2).replace(/\.?0+$/, '');
    }

    if (whole === 0) return closest;
    return whole + closest;
  }

  function addIngredientRow(name, amount, unit) {
    ingredientCount++;
    var div = document.createElement('div');
    div.className = 'ingredient-row';
    div.style.cssText = 'display:flex;gap:8px;margin-bottom:8px;align-items:center;';
    div.innerHTML =
      '<input type="text" placeholder="Ingredient" class="ing-name" value="' + (name || '') + '" style="flex:2;padding:10px;border:1px solid #d1d5db;border-radius:8px;font-size:1rem;">' +
      '<input type="number" placeholder="Amt" class="ing-amount" value="' + (amount || '') + '" step="any" inputmode="decimal" style="flex:1;padding:10px;border:1px solid #d1d5db;border-radius:8px;font-size:1rem;">' +
      '<input type="text" placeholder="Unit" class="ing-unit" value="' + (unit || '') + '" style="flex:1;padding:10px;border:1px solid #d1d5db;border-radius:8px;font-size:1rem;">' +
      '<button type="button" class="remove-row-btn" style="background:none;border:none;color:#ef4444;font-size:1.3rem;cursor:pointer;padding:4px 8px;" aria-label="Remove ingredient">&times;</button>';

    div.querySelector('.remove-row-btn').addEventListener('click', function() {
      div.remove();
    });

    document.getElementById('ingredientList').appendChild(div);
  }

  // Start with 3 empty rows
  addIngredientRow('', '', '');
  addIngredientRow('', '', '');
  addIngredientRow('', '', '');

  document.getElementById('addRowBtn').addEventListener('click', function() {
    addIngredientRow('', '', '');
  });

  function calculate() {
    var orig = parseFloat(document.getElementById('origServings').value);
    var desired = parseFloat(document.getElementById('desiredServings').value);

    if (isNaN(orig) || isNaN(desired) || orig <= 0 || desired <= 0) return;

    var factor = desired / orig;
    var rows = document.querySelectorAll('.ingredient-row');
    var output = '';
    var hasIngredients = false;

    rows.forEach(function(row) {
      var name = row.querySelector('.ing-name').value.trim();
      var amount = parseFloat(row.querySelector('.ing-amount').value);
      var unit = row.querySelector('.ing-unit').value.trim();

      if (!name && isNaN(amount)) return;

      hasIngredients = true;
      var scaled = isNaN(amount) ? '' : toFraction(amount * factor);

      output += '<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #e5e7eb;">' +
        '<span style="font-weight:600;">' + (name || 'Unnamed') + '</span>' +
        '<span>' + scaled + (unit ? ' ' + unit : '') + '</span>' +
        '</div>';
    });

    if (!hasIngredients) return;

    var factorText = factor === 1 ? 'same amount' :
      factor > 1 ? toFraction(factor) + '× larger' : toFraction(factor) + '× smaller';

    document.getElementById('scaledOutput').innerHTML = output;
    document.getElementById('resultTip').textContent = 'Scale factor: ' + factor.toFixed(2) + 'x (' + factorText + '). Adjust seasoning to taste.';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);
  document.getElementById('origServings').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  document.getElementById('desiredServings').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });

})();
