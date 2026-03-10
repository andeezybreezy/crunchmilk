(function() {
  'use strict';

  var ITEMS = {
    water: [
      { name: 'Water bottles (1L each)', perPersonDay: 3.78, weightEach: 2.2, unit: 'bottles' },
      { name: 'Water purification tablets', perPerson: 1, weight: 0.1, unit: 'pack', minDuration: 1 },
      { name: 'Portable water filter', perGroup: 1, weight: 0.75, unit: 'filter', minDuration: 3 }
    ],
    food: [
      { name: 'Energy/granola bars', perPersonDay: 4, weightEach: 0.15, unit: 'bars' },
      { name: 'Freeze-dried meals', perPersonDay: 2, weightEach: 0.35, unit: 'pouches', minDuration: 3 },
      { name: 'Jerky/dried meat', perPersonDay: 1, weightEach: 0.2, unit: 'packs' },
      { name: 'Trail mix bags', perPersonDay: 1, weightEach: 0.25, unit: 'bags' }
    ],
    shelter: [
      { name: 'Emergency mylar blanket', perPerson: 1, weight: 0.2, unit: 'ea' },
      { name: 'Tarp (8x10)', perGroup: 1, weight: 1.5, unit: 'tarp' },
      { name: 'Paracord (50 ft)', perGroup: 1, weight: 0.5, unit: 'hank' },
      { name: 'Sleeping bag (compact)', perPerson: 1, weight: 2.0, unit: 'ea', minDuration: 3 }
    ],
    fire: [
      { name: 'Lighter', perPerson: 1, weight: 0.1, unit: 'ea' },
      { name: 'Ferro rod', perGroup: 1, weight: 0.2, unit: 'ea' },
      { name: 'Waterproof matches', perGroup: 1, weight: 0.15, unit: 'box' },
      { name: 'Tinder (cotton balls/vaseline)', perGroup: 1, weight: 0.1, unit: 'bag' }
    ],
    firstAid: [
      { name: 'First aid kit', perGroup: 1, weight: 1.0, unit: 'kit' },
      { name: 'Medications (personal)', perPerson: 1, weight: 0.25, unit: 'bag' },
      { name: 'Tourniquet', perGroup: 1, weight: 0.2, unit: 'ea' },
      { name: 'Moleskin / blister kit', perGroup: 1, weight: 0.1, unit: 'pack' }
    ],
    tools: [
      { name: 'Fixed-blade knife', perGroup: 1, weight: 0.75, unit: 'ea' },
      { name: 'Multi-tool', perPerson: 1, weight: 0.5, unit: 'ea' },
      { name: 'Flashlight/headlamp', perPerson: 1, weight: 0.4, unit: 'ea' },
      { name: 'Duct tape (small roll)', perGroup: 1, weight: 0.25, unit: 'roll' },
      { name: 'Compass', perGroup: 1, weight: 0.15, unit: 'ea' },
      { name: 'Whistle', perPerson: 1, weight: 0.05, unit: 'ea' }
    ]
  };

  var CLIMATE_EXTRAS = {
    hot: [
      { name: 'Extra water (1L per person per day)', perPersonDay: 1, weightEach: 2.2, unit: 'bottles' },
      { name: 'Electrolyte packets', perPersonDay: 2, weightEach: 0.02, unit: 'packets' },
      { name: 'Sun hat / bandana', perPerson: 1, weight: 0.15, unit: 'ea' },
      { name: 'Sunscreen', perGroup: 1, weight: 0.3, unit: 'bottle' }
    ],
    cold: [
      { name: 'Insulated base layer', perPerson: 1, weight: 0.75, unit: 'set' },
      { name: 'Warm hat and gloves', perPerson: 1, weight: 0.3, unit: 'set' },
      { name: 'Hand warmers (pairs)', perPersonDay: 2, weightEach: 0.1, unit: 'pairs' },
      { name: 'Heavier sleeping bag', perPerson: 1, weight: 1.5, unit: 'ea', note: 'adds to base sleeping bag' }
    ],
    temperate: []
  };

  function calculate() {
    var people = parseInt(document.getElementById('people').value) || 2;
    var days = parseInt(document.getElementById('duration').value) || 3;
    var climate = document.getElementById('climate').value;
    var bodyWeight = parseInt(document.getElementById('bodyWeight').value) || 170;

    var totalWeight = 0;
    var html = '';

    function processCategory(title, items) {
      var catWeight = 0;
      var lines = [];

      items.forEach(function(item) {
        if (item.minDuration && days < item.minDuration) return;

        var qty = 0;
        var w = 0;

        if (item.perPersonDay) {
          qty = Math.ceil(item.perPersonDay * people * days);
          w = qty * (item.weightEach || 0);
        } else if (item.perPerson) {
          qty = item.perPerson * people;
          w = qty * (item.weight || 0);
        } else if (item.perGroup) {
          qty = item.perGroup;
          w = qty * (item.weight || 0);
        }

        catWeight += w;
        lines.push('\u2610 ' + item.name + ' \u2014 Qty: ' + qty + ' ' + item.unit + ' (' + w.toFixed(1) + ' lbs)');
      });

      totalWeight += catWeight;
      html += '<div style="margin-bottom:1rem;">';
      html += '<strong>' + title + '</strong> (' + catWeight.toFixed(1) + ' lbs)<br>';
      html += lines.join('<br>');
      html += '</div>';
    }

    processCategory('Water', ITEMS.water);
    processCategory('Food', ITEMS.food);
    processCategory('Shelter', ITEMS.shelter);
    processCategory('Fire', ITEMS.fire);
    processCategory('First Aid', ITEMS.firstAid);
    processCategory('Tools', ITEMS.tools);

    if (CLIMATE_EXTRAS[climate] && CLIMATE_EXTRAS[climate].length > 0) {
      processCategory('Climate Gear (' + climate.charAt(0).toUpperCase() + climate.slice(1) + ')', CLIMATE_EXTRAS[climate]);
    }

    var perPerson = totalWeight / people;
    var targetLow = bodyWeight * 0.15;
    var targetHigh = bodyWeight * 0.25;

    document.getElementById('totalWeight').textContent = totalWeight.toFixed(1) + ' lbs';
    document.getElementById('perPerson').textContent = perPerson.toFixed(1) + ' lbs';
    document.getElementById('targetRange').textContent = targetLow.toFixed(0) + ' – ' + targetHigh.toFixed(0) + ' lbs';

    var statusEl = document.getElementById('weightStatus');
    if (perPerson <= targetHigh) {
      statusEl.textContent = 'Good — within target';
      statusEl.style.color = '#16a34a';
    } else if (perPerson <= targetHigh * 1.25) {
      statusEl.textContent = 'Heavy — consider trimming';
      statusEl.style.color = '#f59e0b';
    } else {
      statusEl.textContent = 'Too heavy — add water filter, reduce carried water';
      statusEl.style.color = '#dc2626';
    }

    document.getElementById('checklist').innerHTML = html;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
