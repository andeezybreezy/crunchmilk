(function() {
  'use strict';

  var FOODS = [
    { name: 'White Rice', calPerLb: 1650, costPerLb: 0.80, shelf: '25+ years', cuftPerLb: 0.025, pct: 0.28 },
    { name: 'Dried Beans', calPerLb: 1550, costPerLb: 1.20, shelf: '25+ years', cuftPerLb: 0.022, pct: 0.20 },
    { name: 'Rolled Oats', calPerLb: 1700, costPerLb: 1.50, shelf: '25+ years', cuftPerLb: 0.035, pct: 0.15 },
    { name: 'Peanut Butter', calPerLb: 2600, costPerLb: 3.00, shelf: '2-5 years', cuftPerLb: 0.018, pct: 0.12 },
    { name: 'Honey', calPerLb: 1400, costPerLb: 5.00, shelf: 'Indefinite', cuftPerLb: 0.012, pct: 0.07 },
    { name: 'Freeze-Dried Meals', calPerLb: 1600, costPerLb: 12.00, shelf: '25+ years', cuftPerLb: 0.065, pct: 0.18 }
  ];

  function calculate() {
    var people = parseInt(document.getElementById('people').value) || 4;
    var months = parseInt(document.getElementById('months').value) || 6;
    var dailyCals = parseInt(document.getElementById('dailyCals').value) || 2000;

    var days = Math.round(months * 30.44);
    var totalCals = people * days * dailyCals;

    var totalLbs = 0;
    var totalCost = 0;
    var totalSpace = 0;
    var rows = [];

    FOODS.forEach(function(food) {
      var allocCals = totalCals * food.pct;
      var lbs = allocCals / food.calPerLb;
      var cost = lbs * food.costPerLb;
      var space = lbs * food.cuftPerLb;

      totalLbs += lbs;
      totalCost += cost;
      totalSpace += space;

      rows.push({
        name: food.name,
        lbs: lbs,
        cals: allocCals,
        cost: cost,
        space: space,
        shelf: food.shelf,
        pct: Math.round(food.pct * 100)
      });
    });

    document.getElementById('totalCals').textContent = totalCals.toLocaleString();
    document.getElementById('totalWeight').textContent = Math.ceil(totalLbs).toLocaleString() + ' lbs';
    document.getElementById('totalCost').textContent = '$' + Math.round(totalCost).toLocaleString();
    document.getElementById('totalSpace').textContent = totalSpace.toFixed(1) + ' cu ft';

    var html = '<h3 style="margin-bottom:0.75rem;">Balanced Storage Plan</h3>';
    html += '<p style="font-size:0.9rem;color:#666;margin-bottom:0.75rem;">' + people + ' people \u00d7 ' + days + ' days \u00d7 ' + dailyCals.toLocaleString() + ' cal/day = ' + totalCals.toLocaleString() + ' total calories</p>';

    rows.forEach(function(r) {
      var barWidth = Math.round(r.pct * 2);
      html += '<div style="background:rgba(220,38,38,0.05);padding:0.75rem;border-radius:8px;margin-bottom:0.5rem;">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
      html += '<strong>' + r.name + '</strong>';
      html += '<span style="color:#666;font-size:0.85rem;">' + r.pct + '% of calories</span>';
      html += '</div>';
      html += '<div style="background:#e5e7eb;border-radius:4px;height:8px;margin:0.4rem 0;">';
      html += '<div style="background:#dc2626;border-radius:4px;height:8px;width:' + barWidth + '%;"></div>';
      html += '</div>';
      html += '<div style="display:flex;flex-wrap:wrap;gap:1rem;font-size:0.9rem;">';
      html += '<span><strong>' + Math.ceil(r.lbs) + ' lbs</strong></span>';
      html += '<span>' + Math.round(r.cals).toLocaleString() + ' cal</span>';
      html += '<span>$' + Math.round(r.cost).toLocaleString() + '</span>';
      html += '<span>' + r.space.toFixed(1) + ' cu ft</span>';
      html += '<span style="color:#888;">Shelf: ' + r.shelf + '</span>';
      html += '</div>';
      html += '</div>';
    });

    // Storage containers summary
    var riceBeanOatLbs = rows[0].lbs + rows[1].lbs + rows[2].lbs;
    var buckets = Math.ceil(riceBeanOatLbs / 33); // ~33 lbs per 5-gal bucket
    var fdCans = Math.ceil(rows[5].lbs / 4); // ~4 lbs per #10 can

    html += '<div style="background:rgba(220,38,38,0.10);padding:1rem;border-radius:8px;margin-top:1rem;">';
    html += '<h3 style="margin-bottom:0.5rem;">Container Summary</h3>';
    html += '5-gallon buckets (grains/beans): <strong>' + buckets + '</strong><br>';
    html += '#10 cans (freeze-dried): <strong>' + fdCans + '</strong><br>';
    html += 'Peanut butter jars (28 oz): <strong>' + Math.ceil(rows[3].lbs / 1.75) + '</strong><br>';
    html += 'Honey containers (3 lb): <strong>' + Math.ceil(rows[4].lbs / 3) + '</strong><br>';
    html += '<br><strong>Cost per person per month:</strong> $' + Math.round(totalCost / people / months).toLocaleString();
    html += '</div>';

    document.getElementById('breakdown').innerHTML = html;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
