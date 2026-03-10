(function() {
  'use strict';

  // Per-person lbs: [bonein, boneless] for main dish
  var perPersonAmounts = {
    beef:    { bonein: 0.875, boneless: 0.625 },
    pork:    { bonein: 0.875, boneless: 0.625 },
    chicken: { bonein: 0.875, boneless: 0.625 },
    ribs:    { bonein: 1.25,  boneless: 0.75  },
    lamb:    { bonein: 0.875, boneless: 0.625 },
    fish:    { bonein: 0.75,  boneless: 0.5   }
  };

  var presets = [
    { name: 'BBQ Party (20 ppl)', meat: 'pork', bone: 'boneless', guests: 20, meal: 'main', tip: 'Mix of pulled pork and ribs works great. Add 20% for big eaters.' },
    { name: 'Dinner Party (8 ppl)', meat: 'beef', bone: 'boneless', guests: 8, meal: 'main', tip: 'Steaks or roast beef. Great with 2-3 side dishes.' },
    { name: 'Taco Night (12 ppl)', meat: 'beef', bone: 'boneless', guests: 12, meal: 'mixed', tip: 'Ground beef or chicken. Plenty of toppings = less meat needed.' },
    { name: 'Burger Cookout (15 ppl)', meat: 'beef', bone: 'boneless', guests: 15, meal: 'main', tip: 'Plan 2 patties per person. Don\'t forget buns and toppings.' },
    { name: 'Rib Fest (10 ppl)', meat: 'ribs', bone: 'bonein', guests: 10, meal: 'main', tip: 'Baby back ribs: 3-4 per person. Spare ribs: 2-3 per person.' },
    { name: 'Fish Dinner (6 ppl)', meat: 'fish', bone: 'boneless', guests: 6, meal: 'main', tip: 'One 6-8 oz fillet per person. Don\'t overcook!' }
  ];

  var presetGrid = document.getElementById('presetGrid');
  presets.forEach(function(p) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-btn';
    btn.innerHTML = p.name + '<span>' + p.meat + ', ' + p.guests + ' guests</span>';
    btn.addEventListener('click', function() {
      document.getElementById('meatType').value = p.meat;
      document.getElementById('boneType').value = p.bone;
      document.getElementById('guestCount').value = p.guests;
      document.getElementById('mealType').value = p.meal;
      calculate(p.tip);
    });
    presetGrid.appendChild(btn);
  });

  function calculate(customTip) {
    var meatType = document.getElementById('meatType').value;
    var boneType = document.getElementById('boneType').value;
    var guests = parseInt(document.getElementById('guestCount').value);
    var mealType = document.getElementById('mealType').value;
    var pricePerLb = parseFloat(document.getElementById('pricePerLb').value);

    if (isNaN(guests) || guests <= 0) return;

    var amounts = perPersonAmounts[meatType];
    var perPerson = amounts[boneType === 'bonein' ? 'bonein' : 'boneless'];

    // Reduce for mixed menu
    if (mealType === 'mixed') {
      perPerson *= 0.7;
    }

    var totalLbs = perPerson * guests;
    // Round up to nearest 0.5
    totalLbs = Math.ceil(totalLbs * 2) / 2;

    document.getElementById('totalMeat').textContent = totalLbs.toFixed(1) + ' lbs';
    document.getElementById('perPerson').innerHTML = perPerson.toFixed(2) + ' lbs <span style="font-size:0.8rem;color:#666;">(' + (perPerson * 16).toFixed(0) + ' oz)</span>';

    var costHtml = '';
    if (!isNaN(pricePerLb) && pricePerLb > 0) {
      var totalCost = totalLbs * pricePerLb;
      var costPerPerson = totalCost / guests;
      costHtml = '<div style="display:grid;gap:4px;">';
      costHtml += '<div style="display:flex;justify-content:space-between;padding:10px;border-bottom:1px solid #e5e7eb;">' +
        '<span style="font-weight:600;">Estimated Total Cost</span><span>$' + totalCost.toFixed(2) + '</span></div>';
      costHtml += '<div style="display:flex;justify-content:space-between;padding:10px;border-bottom:1px solid #e5e7eb;">' +
        '<span style="font-weight:600;">Cost Per Person</span><span>$' + costPerPerson.toFixed(2) + '</span></div>';
      costHtml += '</div>';
    }
    document.getElementById('costEstimate').innerHTML = costHtml;

    var tip = customTip || 'These amounts are raw (pre-cooked) weight. Meat shrinks 25-30% during cooking.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', function() { calculate(); });
  document.getElementById('guestCount').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });

})();
