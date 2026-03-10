(function() {
  'use strict';

  // Per-person amounts at average appetite (raw weight where applicable)
  var menus = {
    burgers: {
      name: 'Burgers & Hot Dogs',
      items: [
        { name: 'Burger Patties (⅓ lb)', perPerson: 2, unit: 'patties', lbsPer: 0.333 },
        { name: 'Hot Dogs', perPerson: 1.5, unit: 'dogs', lbsPer: 0.125 },
        { name: 'Hamburger Buns', perPerson: 2, unit: 'buns' },
        { name: 'Hot Dog Buns', perPerson: 1.5, unit: 'buns' }
      ]
    },
    mixedGrill: {
      name: 'Mixed Grill',
      items: [
        { name: 'Burger Patties (⅓ lb)', perPerson: 1, unit: 'patties', lbsPer: 0.333 },
        { name: 'Hot Dogs', perPerson: 1, unit: 'dogs', lbsPer: 0.125 },
        { name: 'Chicken Pieces', perPerson: 1, unit: 'pieces', lbsPer: 0.375 },
        { name: 'Hamburger Buns', perPerson: 1, unit: 'buns' },
        { name: 'Hot Dog Buns', perPerson: 1, unit: 'buns' }
      ]
    },
    pulledPork: {
      name: 'Pulled Pork',
      items: [
        { name: 'Pork Butt (raw)', perPerson: 0.5, unit: 'lbs', lbsPer: 0.5 },
        { name: 'Slider/Sandwich Buns', perPerson: 2, unit: 'buns' }
      ]
    },
    ribs: {
      name: 'Baby Back Ribs',
      items: [
        { name: 'Baby Back Ribs', perPerson: 4, unit: 'bones', lbsPer: 0.33 },
        { name: 'Rolls', perPerson: 1.5, unit: 'rolls' }
      ]
    },
    wings: {
      name: 'Chicken Wings',
      items: [
        { name: 'Chicken Wings', perPerson: 7, unit: 'wings', lbsPer: 0.065 }
      ]
    },
    brisket: {
      name: 'Brisket',
      items: [
        { name: 'Whole Brisket (raw)', perPerson: 0.5, unit: 'lbs', lbsPer: 0.5 },
        { name: 'Sandwich Buns/Rolls', perPerson: 2, unit: 'buns' }
      ]
    },
    steaks: {
      name: 'Steaks',
      items: [
        { name: 'Steaks (8 oz each)', perPerson: 1, unit: 'steaks', lbsPer: 0.5 },
        { name: 'Baked Potatoes', perPerson: 1, unit: 'potatoes' }
      ]
    }
  };

  var sides = [
    { name: 'Coleslaw', perPerson: 0.5, unit: 'cups', buyUnit: 'lbs', buyRatio: 0.25 },
    { name: 'Baked Beans', perPerson: 0.5, unit: 'cups', buyUnit: 'cans (28 oz)', buyRatio: 0.143 },
    { name: 'Corn on the Cob', perPerson: 1, unit: 'ears', buyUnit: 'ears', buyRatio: 1 },
    { name: 'Chips / Snacks', perPerson: 0.125, unit: 'lbs', buyUnit: 'lbs', buyRatio: 0.125 },
    { name: 'Drinks (sodas/water)', perPerson: 2.5, unit: 'cans', buyUnit: 'cans', buyRatio: 2.5 },
    { name: 'Ice', perPerson: 1.5, unit: 'lbs', buyUnit: 'lbs', buyRatio: 1.5 }
  ];

  var appetiteMultiplier = { light: 0.75, average: 1.0, hearty: 1.35 };

  function calculate() {
    var guests = parseInt(document.getElementById('guests').value);
    var mealType = document.getElementById('mealType').value;
    var appetite = document.getElementById('appetite').value;
    if (isNaN(guests) || guests < 1) return;

    var mult = appetiteMultiplier[appetite];
    var menu = menus[mealType];

    // Meat / main items
    var meatHtml = '';
    var totalLbs = 0;

    menu.items.forEach(function(item) {
      var qty = Math.ceil(item.perPerson * mult * guests);
      var lbs = item.lbsPer ? (item.perPerson * mult * guests * item.lbsPer) : 0;
      totalLbs += lbs;
      var lbsStr = lbs > 0 ? ' (' + lbs.toFixed(1) + ' lbs)' : '';
      meatHtml += '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e5e7eb;">' +
        '<span>' + item.name + '</span>' +
        '<span style="font-weight:600;">' + qty + ' ' + item.unit + lbsStr + '</span>' +
        '</div>';
    });

    if (totalLbs > 0) {
      meatHtml += '<div style="display:flex;justify-content:space-between;padding:8px 0;font-weight:700;color:#dc2626;">' +
        '<span>Total Meat (raw)</span>' +
        '<span>' + totalLbs.toFixed(1) + ' lbs</span>' +
        '</div>';
    }

    document.getElementById('meatOutput').innerHTML = meatHtml;

    // Sides
    var sidesHtml = '';
    sides.forEach(function(s) {
      var qty = s.perPerson * mult * guests;
      var buyQty = s.buyRatio * mult * guests;
      sidesHtml += '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e5e7eb;">' +
        '<span>' + s.name + '</span>' +
        '<span style="font-weight:600;">' + Math.ceil(buyQty) + ' ' + s.buyUnit + '</span>' +
        '</div>';
    });

    document.getElementById('sidesOutput').innerHTML = sidesHtml;

    var tip = 'Shopping for ' + guests + ' guests (' + appetite + ' appetite). Includes ~10% buffer. ' +
      'Pulled pork/brisket shrink 40-50% when cooked.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);
  document.getElementById('guests').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });

})();
