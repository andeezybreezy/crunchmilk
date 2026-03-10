(function() {
  'use strict';

  var chartData = [
    ['White Sandwich', '60-65%', '2%', '1-2% (yeast)', '3-5%'],
    ['French Baguette', '65-68%', '2%', '0.5-1% (yeast)', '0%'],
    ['Ciabatta', '75-80%', '2%', '0.5-1% (yeast)', '2-3%'],
    ['Sourdough Boule', '70-75%', '2%', '20-25% (starter)', '0%'],
    ['Focaccia', '75-85%', '2%', '1% (yeast)', '5-8%'],
    ['Brioche', '50-55%', '2%', '2-3% (yeast)', '40-60%'],
    ['Challah', '45-50%', '1.5%', '2% (yeast)', '8-12%'],
    ['Whole Wheat', '68-75%', '2%', '1.5% (yeast)', '2-3%'],
    ['Rye Bread', '65-70%', '1.8%', '1% (yeast)', '1-2%'],
    ['Pizza Dough', '60-65%', '2%', '0.5-1% (yeast)', '2-3%']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td><td>' + row[4] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var flour = parseFloat(document.getElementById('flour').value);
    var water = parseFloat(document.getElementById('water').value) || 0;
    var salt = parseFloat(document.getElementById('salt').value) || 0;
    var yeast = parseFloat(document.getElementById('yeast').value) || 0;
    var sugar = parseFloat(document.getElementById('sugar').value) || 0;
    var fat = parseFloat(document.getElementById('fat').value) || 0;
    var scaleToRaw = document.getElementById('scaleTo').value;
    var scaleTo = scaleToRaw ? parseFloat(scaleToRaw) : null;

    if (isNaN(flour) || flour <= 0) return;

    // Baker's percentage: ingredient / flour * 100
    var waterPct = (water / flour) * 100;
    var saltPct = (salt / flour) * 100;
    var yeastPct = (yeast / flour) * 100;
    var sugarPct = (sugar / flour) * 100;
    var fatPct = (fat / flour) * 100;

    var totalWeight = flour + water + salt + yeast + sugar + fat;

    document.getElementById('hydration').textContent = waterPct.toFixed(1) + '%';
    document.getElementById('totalWeight').textContent = Math.round(totalWeight) + ' g';

    // Build breakdown table
    var ingredients = [
      ['Flour', flour, 100],
      ['Water', water, waterPct],
      ['Salt', salt, saltPct],
      ['Yeast / Starter', yeast, yeastPct]
    ];
    if (sugar > 0) ingredients.push(['Sugar', sugar, sugarPct]);
    if (fat > 0) ingredients.push(['Fat / Butter', fat, fatPct]);

    var scaleFactor = scaleTo ? (scaleTo / flour) : null;
    var header = '<table style="width:100%;border-collapse:collapse;margin-top:0.5rem;"><thead><tr>' +
      '<th style="text-align:left;padding:6px;border-bottom:2px solid #ddd;">Ingredient</th>' +
      '<th style="text-align:right;padding:6px;border-bottom:2px solid #ddd;">Weight (g)</th>' +
      '<th style="text-align:right;padding:6px;border-bottom:2px solid #ddd;">Baker\'s %</th>' +
      (scaleFactor ? '<th style="text-align:right;padding:6px;border-bottom:2px solid #ddd;">Scaled (g)</th>' : '') +
      '</tr></thead><tbody>';

    var rows = '';
    var scaledTotal = 0;
    ingredients.forEach(function(ing) {
      var scaled = scaleFactor ? Math.round(ing[1] * scaleFactor) : 0;
      scaledTotal += scaled;
      rows += '<tr>' +
        '<td style="padding:6px;border-bottom:1px solid #eee;">' + ing[0] + '</td>' +
        '<td style="text-align:right;padding:6px;border-bottom:1px solid #eee;">' + Math.round(ing[1]) + 'g</td>' +
        '<td style="text-align:right;padding:6px;border-bottom:1px solid #eee;">' + ing[2].toFixed(1) + '%</td>' +
        (scaleFactor ? '<td style="text-align:right;padding:6px;border-bottom:1px solid #eee;">' + scaled + 'g</td>' : '') +
        '</tr>';
    });

    // Total row
    rows += '<tr style="font-weight:bold;">' +
      '<td style="padding:6px;">Total</td>' +
      '<td style="text-align:right;padding:6px;">' + Math.round(totalWeight) + 'g</td>' +
      '<td style="text-align:right;padding:6px;">—</td>' +
      (scaleFactor ? '<td style="text-align:right;padding:6px;">' + scaledTotal + 'g</td>' : '') +
      '</tr>';

    document.getElementById('breakdownTable').innerHTML = header + rows + '</tbody></table>';

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  var inputs = ['flour', 'water', 'salt', 'yeast', 'sugar', 'fat', 'scaleTo'];
  inputs.forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

})();
