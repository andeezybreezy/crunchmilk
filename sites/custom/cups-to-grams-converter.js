(function() {
  'use strict';

  // Grams per cup for each ingredient
  var ingredients = {
    allPurposeFlour: { gpc: 120, name: 'All-Purpose Flour' },
    breadFlour:      { gpc: 127, name: 'Bread Flour' },
    cakeFlour:       { gpc: 114, name: 'Cake Flour' },
    wholeWheatFlour: { gpc: 128, name: 'Whole Wheat Flour' },
    almondFlour:     { gpc: 96,  name: 'Almond Flour' },
    coconutFlour:    { gpc: 128, name: 'Coconut Flour' },
    cornstarch:      { gpc: 128, name: 'Cornstarch' },
    whiteSugar:      { gpc: 200, name: 'Granulated Sugar' },
    brownSugar:      { gpc: 213, name: 'Brown Sugar (packed)' },
    powderedSugar:   { gpc: 120, name: 'Powdered Sugar' },
    honey:           { gpc: 340, name: 'Honey', liquid: true },
    mapleSyrup:      { gpc: 312, name: 'Maple Syrup', liquid: true },
    molasses:        { gpc: 328, name: 'Molasses', liquid: true },
    butter:          { gpc: 227, name: 'Butter' },
    vegetableOil:    { gpc: 218, name: 'Vegetable Oil', liquid: true },
    coconutOil:      { gpc: 218, name: 'Coconut Oil' },
    shortening:      { gpc: 205, name: 'Shortening' },
    milk:            { gpc: 244, name: 'Milk', liquid: true },
    heavyCream:      { gpc: 238, name: 'Heavy Cream', liquid: true },
    sourCream:       { gpc: 230, name: 'Sour Cream' },
    yogurt:          { gpc: 245, name: 'Yogurt' },
    creamCheese:     { gpc: 232, name: 'Cream Cheese' },
    water:           { gpc: 237, name: 'Water', liquid: true },
    cocoa:           { gpc: 86,  name: 'Cocoa Powder' },
    oats:            { gpc: 90,  name: 'Rolled Oats' },
    rice:            { gpc: 185, name: 'Rice (uncooked)' },
    peanutButter:    { gpc: 258, name: 'Peanut Butter' },
    chocolateChips:  { gpc: 170, name: 'Chocolate Chips' },
    raisins:         { gpc: 145, name: 'Raisins' },
    walnuts:         { gpc: 120, name: 'Walnuts (chopped)' },
    salt:            { gpc: 288, name: 'Table Salt' },
    bakingPowder:    { gpc: 230, name: 'Baking Powder' },
    bakingSoda:      { gpc: 288, name: 'Baking Soda' }
  };

  var volUnit = 'cups';
  var toggleBtns = document.querySelectorAll('.unit-toggle button');
  toggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      toggleBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      volUnit = btn.dataset.unit;
    });
  });

  function toCups(amount, u) {
    if (u === 'cups') return amount;
    if (u === 'tbsp') return amount / 16;
    if (u === 'tsp') return amount / 48;
    return amount;
  }

  function calculate() {
    var amount = parseFloat(document.getElementById('amount').value);
    var ingKey = document.getElementById('ingredient').value;
    if (isNaN(amount) || amount <= 0) return;

    var ing = ingredients[ingKey];
    var cups = toCups(amount, volUnit);
    var grams = cups * ing.gpc;
    var oz = grams / 28.3495;

    document.getElementById('gramsResult').innerHTML = grams.toFixed(1) + 'g' +
      '<div style="font-size:0.85rem;color:#666;">' + ing.name + '</div>';
    document.getElementById('ozResult').innerHTML = oz.toFixed(2) + ' oz' +
      '<div style="font-size:0.85rem;color:#666;">' + (oz / 16).toFixed(3) + ' lbs</div>';

    if (ing.liquid) {
      var ml = cups * 236.6;
      document.getElementById('mlResult').innerHTML =
        '<div style="padding:8px;background:#f3f4f6;border-radius:8px;font-size:0.95rem;">' +
        '<strong>Volume:</strong> ' + ml.toFixed(0) + ' ml (' + (ml / 29.5735).toFixed(1) + ' fl oz)' +
        '</div>';
    } else {
      document.getElementById('mlResult').innerHTML = '';
    }

    // Show in all units
    var tbsp = cups * 16;
    var tsp = cups * 48;
    document.getElementById('resultTip').textContent =
      amount + ' ' + volUnit + ' ' + ing.name + ' = ' + grams.toFixed(1) + 'g. ' +
      '(' + cups.toFixed(2) + ' cups = ' + tbsp.toFixed(1) + ' tbsp = ' + tsp.toFixed(0) + ' tsp)';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);
  document.getElementById('amount').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  document.getElementById('ingredient').addEventListener('change', function() {
    if (document.getElementById('amount').value) calculate();
  });

})();
