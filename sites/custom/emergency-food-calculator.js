(function() {
  'use strict';

  // Food types: name, cal/lb, cost/lb, shelf life, cu ft per lb (approx), allocation %
  var FOODS = [
    { name: 'White Rice', calPerLb: 1650, costPerLb: 0.80, shelf: '25+ years', cuftPerLb: 0.025, pct: 0.30 },
    { name: 'Dried Beans', calPerLb: 1550, costPerLb: 1.20, shelf: '25+ years', cuftPerLb: 0.022, pct: 0.20 },
    { name: 'Rolled Oats', calPerLb: 1700, costPerLb: 1.50, shelf: '25+ years', cuftPerLb: 0.035, pct: 0.15 },
    { name: 'Peanut Butter', calPerLb: 2600, costPerLb: 3.00, shelf: '2-5 years', cuftPerLb: 0.018, pct: 0.10 },
    { name: 'Honey', calPerLb: 1400, costPerLb: 5.00, shelf: 'Indefinite', cuftPerLb: 0.012, pct: 0.05 },
    { name: 'Freeze-Dried Meals (#10 cans)', calPerLb: 1600, costPerLb: 12.00, shelf: '25+ years', cuftPerLb: 0.065, pct: 0.10 },
    { name: 'Pasta', calPerLb: 1680, costPerLb: 1.00, shelf: '25+ years', cuftPerLb: 0.040, pct: 0.10 }
  ];

  function calculate() {
    var people = parseInt(document.getElementById('household').value) || 4;
    var months = parseFloat(document.getElementById('duration').value) || 1;
    var calPerDay = parseInt(document.getElementById('calories').value) || 2000;

    var days = Math.round(months * 30.44);
    var totalCals = people * days * calPerDay;

    document.getElementById('totalCals').textContent = totalCals.toLocaleString();
    document.getElementById('totalDays').textContent = days;

    var html = '<h3 style="margin-bottom:0.75rem;">Balanced Food Storage Plan</h3>';
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
        pct: food.pct * 100
      });
    });

    rows.forEach(function(r) {
      html += '<div style="background:rgba(220,38,38,0.05);padding:0.75rem;border-radius:8px;margin-bottom:0.5rem;">';
      html += '<strong>' + r.name + '</strong> (' + r.pct + '% of calories)<br>';
      html += 'Amount: <strong>' + Math.ceil(r.lbs) + ' lbs</strong> | ';
      html += 'Calories: ' + Math.round(r.cals).toLocaleString() + ' | ';
      html += 'Cost: $' + r.cost.toFixed(0) + '<br>';
      html += 'Space: ' + r.space.toFixed(1) + ' cu ft | ';
      html += 'Shelf life: ' + r.shelf;
      html += '</div>';
    });

    // Number of #10 cans (for freeze-dried: ~4 lbs per can)
    var fdRow = rows.find(function(r) { return r.name.indexOf('Freeze') !== -1; });
    var num10Cans = fdRow ? Math.ceil(fdRow.lbs / 4) : 0;

    html += '<div style="background:rgba(220,38,38,0.10);padding:1rem;border-radius:8px;margin-top:1rem;">';
    html += '<h3 style="margin-bottom:0.5rem;">Summary</h3>';
    html += 'Total food weight: <strong>' + Math.ceil(totalLbs) + ' lbs</strong><br>';
    html += 'Estimated cost: <strong>$' + Math.round(totalCost).toLocaleString() + '</strong><br>';
    html += 'Storage space needed: <strong>' + totalSpace.toFixed(1) + ' cu ft</strong><br>';
    html += '#10 cans (freeze-dried): <strong>' + num10Cans + ' cans</strong><br>';
    html += '5-gallon buckets (rice/beans/oats): <strong>' + Math.ceil((rows[0].lbs + rows[1].lbs + rows[2].lbs) / 33) + ' buckets</strong>';
    html += '</div>';

    document.getElementById('foodPlan').innerHTML = html;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
