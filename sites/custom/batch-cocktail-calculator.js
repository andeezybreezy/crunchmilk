(function() {
  'use strict';

  var recipes = {
    margarita: [
      { name: 'Tequila', oz: 2 },
      { name: 'Cointreau / Triple Sec', oz: 1 },
      { name: 'Fresh Lime Juice', oz: 1 },
      { name: 'Agave Syrup', oz: 0.5 }
    ],
    oldfashioned: [
      { name: 'Bourbon / Rye', oz: 2 },
      { name: 'Simple Syrup', oz: 0.25 },
      { name: 'Angostura Bitters (dashes→oz)', oz: 0.08 }
    ],
    negroni: [
      { name: 'Gin', oz: 1 },
      { name: 'Campari', oz: 1 },
      { name: 'Sweet Vermouth', oz: 1 }
    ],
    mojito: [
      { name: 'White Rum', oz: 2 },
      { name: 'Fresh Lime Juice', oz: 1 },
      { name: 'Simple Syrup', oz: 0.75 },
      { name: 'Soda Water (add at serving)', oz: 2 }
    ],
    cosmopolitan: [
      { name: 'Vodka (citrus)', oz: 1.5 },
      { name: 'Cointreau', oz: 1 },
      { name: 'Cranberry Juice', oz: 1 },
      { name: 'Fresh Lime Juice', oz: 0.5 }
    ],
    whiskeysour: [
      { name: 'Bourbon', oz: 2 },
      { name: 'Fresh Lemon Juice', oz: 0.75 },
      { name: 'Simple Syrup', oz: 0.75 }
    ],
    daiquiri: [
      { name: 'White Rum', oz: 2 },
      { name: 'Fresh Lime Juice', oz: 1 },
      { name: 'Simple Syrup', oz: 0.75 }
    ],
    paloma: [
      { name: 'Tequila', oz: 2 },
      { name: 'Fresh Lime Juice', oz: 0.5 },
      { name: 'Grapefruit Soda (add at serving)', oz: 3 }
    ]
  };

  var ingredientCount = 0;

  function addIngredientRow(name, oz) {
    ingredientCount++;
    var div = document.createElement('div');
    div.className = 'ingredient-row';
    div.style.cssText = 'display:flex;gap:8px;margin-bottom:8px;align-items:center;';
    div.innerHTML =
      '<input type="text" placeholder="Ingredient" class="ing-name" value="' + (name || '') + '" style="flex:2;padding:10px;border:1px solid #d1d5db;border-radius:8px;font-size:1rem;">' +
      '<input type="number" placeholder="oz" class="ing-oz" value="' + (oz || '') + '" step="0.25" min="0" inputmode="decimal" style="flex:1;padding:10px;border:1px solid #d1d5db;border-radius:8px;font-size:1rem;">' +
      '<button type="button" class="remove-row-btn" style="background:none;border:none;color:#ef4444;font-size:1.3rem;cursor:pointer;padding:4px 8px;" aria-label="Remove ingredient">&times;</button>';
    div.querySelector('.remove-row-btn').addEventListener('click', function() { div.remove(); });
    document.getElementById('ingredientList').appendChild(div);
  }

  function clearIngredients() {
    document.getElementById('ingredientList').innerHTML = '';
    ingredientCount = 0;
  }

  function loadRecipe(key) {
    clearIngredients();
    if (key === 'custom') {
      addIngredientRow('', '');
      addIngredientRow('', '');
      addIngredientRow('', '');
      return;
    }
    var recipe = recipes[key];
    recipe.forEach(function(item) {
      addIngredientRow(item.name, item.oz);
    });
  }

  // Start with empty rows
  addIngredientRow('', '');
  addIngredientRow('', '');
  addIngredientRow('', '');

  document.getElementById('recipeSelect').addEventListener('change', function() {
    loadRecipe(this.value);
  });

  document.getElementById('addRowBtn').addEventListener('click', function() {
    addIngredientRow('', '');
  });

  function fmtOz(oz) {
    if (oz < 1) return oz.toFixed(2) + ' oz';
    return oz.toFixed(1) + ' oz';
  }

  function calculate() {
    var servings = parseInt(document.getElementById('servings').value);
    var dilution = parseFloat(document.getElementById('dilution').value);
    if (isNaN(servings) || servings < 1) return;

    var rows = document.querySelectorAll('.ingredient-row');
    var items = [];
    var totalPerDrink = 0;

    rows.forEach(function(row) {
      var name = row.querySelector('.ing-name').value.trim();
      var oz = parseFloat(row.querySelector('.ing-oz').value);
      if (!name || isNaN(oz) || oz <= 0) return;
      items.push({ name: name, oz: oz });
      totalPerDrink += oz;
    });

    if (items.length === 0) return;

    var waterPerDrink = totalPerDrink * dilution;
    var totalPerDrinkWithDilution = totalPerDrink + waterPerDrink;

    var html = '';
    items.forEach(function(item) {
      var totalOz = item.oz * servings;
      var cups = totalOz / 8;
      var bottles = totalOz / 25.4;
      html += '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e5e7eb;flex-wrap:wrap;">' +
        '<span style="font-weight:600;min-width:140px;">' + item.name + '</span>' +
        '<span>' + fmtOz(item.oz) + '/drink</span>' +
        '<span style="font-weight:700;">' + totalOz.toFixed(1) + ' oz</span>' +
        '<span style="color:#666;">' + cups.toFixed(1) + ' cups</span>' +
        (bottles >= 0.3 ? '<span style="color:#666;">' + bottles.toFixed(1) + ' bottles</span>' : '<span></span>') +
        '</div>';
    });

    if (dilution > 0) {
      var totalWater = waterPerDrink * servings;
      html += '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e5e7eb;color:#0369a1;">' +
        '<span style="font-weight:600;">Water (dilution ' + (dilution * 100) + '%)</span>' +
        '<span>' + waterPerDrink.toFixed(2) + ' oz/drink</span>' +
        '<span style="font-weight:700;">' + totalWater.toFixed(1) + ' oz</span>' +
        '<span>' + (totalWater / 8).toFixed(1) + ' cups</span>' +
        '<span></span>' +
        '</div>';
    }

    document.getElementById('batchOutput').innerHTML = html;

    var grandTotal = totalPerDrinkWithDilution * servings;
    document.getElementById('totalOutput').innerHTML =
      '<div style="padding:12px;background:#f3f4f6;border-radius:8px;">' +
      '<div style="display:flex;justify-content:space-between;font-size:1.1rem;">' +
      '<span style="font-weight:700;">Total Batch Volume</span>' +
      '<span style="font-weight:700;">' + grandTotal.toFixed(1) + ' oz (' + (grandTotal / 8).toFixed(1) + ' cups / ' + (grandTotal / 33.814).toFixed(2) + ' L)</span>' +
      '</div>' +
      '<div style="font-size:0.85rem;color:#666;margin-top:4px;">' + servings + ' servings × ' + totalPerDrinkWithDilution.toFixed(1) + ' oz per drink (incl. dilution)</div>' +
      '</div>';

    document.getElementById('resultTip').textContent =
      'Mix spirits, syrups, and juice ahead of time. Add carbonated ingredients (soda, sparkling wine) at serving time. Serve over fresh ice.';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);
  document.getElementById('servings').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });

})();
