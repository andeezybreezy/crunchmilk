(function() {
  'use strict';

  var chartData = [
    ['Burgers (1/3 lb patties)', '20', '40', '60', '100'],
    ['Hot Dogs', '15', '30', '45', '75'],
    ['Chicken Pieces', '10', '20', '30', '50'],
    ['Buns (total)', '30', '60', '90', '150'],
    ['Coleslaw', '5 lbs', '10 lbs', '15 lbs', '25 lbs'],
    ['Potato Salad', '5 lbs', '10 lbs', '15 lbs', '25 lbs'],
    ['Baked Beans', '4 lbs', '8 lbs', '12 lbs', '20 lbs'],
    ['Drinks (cans/bottles)', '30', '60', '90', '150'],
    ['Ice', '10 lbs', '20 lbs', '30 lbs', '50 lbs'],
    ['Condiments (ketchup)', '1 bottle', '2 bottles', '3 bottles', '5 bottles']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td><td>' + row[4] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  // Appetite multipliers
  var appetiteMultipliers = { light: 0.75, average: 1.0, heavy: 1.35 };

  // Duration drink multipliers
  var durationMultipliers = { short: 0.7, medium: 1.0, long: 1.5 };

  function calculate() {
    var guests = parseFloat(document.getElementById('guests').value);
    var duration = document.getElementById('duration').value;
    var appetite = document.getElementById('appetite').value;
    var meatMix = document.getElementById('meatMix').value;

    if (isNaN(guests) || guests <= 0) return;

    var appMult = appetiteMultipliers[appetite];
    var durMult = durationMultipliers[duration];

    var items = [];

    // Meat calculations depend on style
    if (meatMix === 'mixed') {
      // Mixed: burgers + dogs + chicken
      var burgers = Math.ceil(guests * 1.5 * appMult);
      var dogs = Math.ceil(guests * 1.0 * appMult);
      var chickenPcs = Math.ceil(guests * 0.75 * appMult);
      var buns = Math.ceil((burgers + dogs) * 1.1); // 10% extra
      var totalMeatLbs = ((burgers * 0.33) + (dogs * 0.125) + (chickenPcs * 0.5)).toFixed(1);

      items.push('Burger patties (1/3 lb): ' + burgers);
      items.push('Hot dogs: ' + dogs);
      items.push('Chicken pieces: ' + chickenPcs);
      items.push('Buns (burger + dog): ' + buns);
      items.push('Total raw meat: ~' + totalMeatLbs + ' lbs');
    } else if (meatMix === 'burgers') {
      var burgersOnly = Math.ceil(guests * 2.0 * appMult);
      var dogsOnly = Math.ceil(guests * 1.5 * appMult);
      var bunsOnly = Math.ceil((burgersOnly + dogsOnly) * 1.1);
      var meatLbs = ((burgersOnly * 0.33) + (dogsOnly * 0.125)).toFixed(1);

      items.push('Burger patties (1/3 lb): ' + burgersOnly);
      items.push('Hot dogs: ' + dogsOnly);
      items.push('Buns (total): ' + bunsOnly);
      items.push('Total raw meat: ~' + meatLbs + ' lbs');
    } else {
      // BBQ meats: pulled pork, ribs, brisket
      var pulledPorkLbs = Math.ceil(guests * 0.5 * appMult); // raw weight
      var ribRacks = Math.ceil(guests / 3 * appMult); // 1 rack per 3 people
      var brisketLbs = Math.ceil(guests * 0.5 * appMult); // raw weight
      var sandwichBuns = Math.ceil(guests * 1.5);

      items.push('Pulled pork (raw): ' + pulledPorkLbs + ' lbs');
      items.push('Rib racks (spare ribs): ' + ribRacks);
      items.push('Brisket (raw): ' + brisketLbs + ' lbs');
      items.push('Sandwich buns: ' + sandwichBuns);
      items.push('Total raw meat: ~' + (pulledPorkLbs + brisketLbs + (ribRacks * 3)) + ' lbs');
    }

    // Sides: ~0.5 lbs per person per side, 3 sides
    var sideLbs = Math.ceil(guests * 0.5 * appMult);
    items.push('---');
    items.push('Coleslaw: ' + sideLbs + ' lbs');
    items.push('Potato salad: ' + sideLbs + ' lbs');
    items.push('Baked beans: ' + Math.ceil(sideLbs * 0.75) + ' lbs');
    items.push('Corn on the cob: ' + Math.ceil(guests * 1.2) + ' ears');
    items.push('Chips: ' + Math.ceil(guests / 5) + ' bags');

    // Drinks
    var drinks = Math.ceil(guests * 2.5 * durMult);
    var iceLbs = Math.ceil(guests * 1.0 * durMult);
    items.push('---');
    items.push('Drinks (beer/soda/water): ' + drinks + ' cans/bottles');
    items.push('Ice: ' + iceLbs + ' lbs');
    items.push('Ketchup: ' + Math.ceil(guests / 10) + ' bottle(s)');
    items.push('Mustard: ' + Math.ceil(guests / 15) + ' bottle(s)');
    items.push('BBQ sauce: ' + Math.ceil(guests / 10) + ' bottle(s)');

    // Plates/napkins
    items.push('---');
    items.push('Plates: ' + Math.ceil(guests * 2) + ' (people grab extras)');
    items.push('Napkins: ' + Math.ceil(guests * 4));
    items.push('Cups: ' + Math.ceil(guests * 3));

    // Display summary
    var totalMeatDisplay = meatMix === 'bbqmeat'
      ? (pulledPorkLbs + brisketLbs + (ribRacks * 3)) + ' lbs'
      : totalMeatLbs + ' lbs';

    document.getElementById('totalMeat').textContent = totalMeatDisplay || '—';
    document.getElementById('totalSides').textContent = (sideLbs * 2 + Math.ceil(sideLbs * 0.75)) + ' lbs total';
    document.getElementById('totalDrinks').textContent = drinks + ' drinks';
    document.getElementById('totalIce').textContent = iceLbs + ' lbs';

    // Build detail list
    var html = '<div style="margin-top:0.5rem;">';
    items.forEach(function(item) {
      if (item === '---') {
        html += '<hr style="margin:0.5rem 0;border:none;border-top:1px solid #eee;">';
      } else {
        html += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:0.95rem;">';
        var parts = item.split(': ');
        html += '<span>' + parts[0] + '</span><strong>' + parts[1] + '</strong>';
        html += '</div>';
      }
    });
    html += '</div>';
    document.getElementById('detailList').innerHTML = html;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  document.getElementById('guests').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });

})();
