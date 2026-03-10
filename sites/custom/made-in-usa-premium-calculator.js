(function() {
  'use strict';

  // Premium data: [premiumPct, importLifespanYears, domesticLifespanYears]
  var categoryData = {
    clothing:   { premium: 0.60, importLife: 2, domesticLife: 3.5, label: 'Clothing & Apparel' },
    electronics:{ premium: 1.20, importLife: 4, domesticLife: 4.5, label: 'Electronics' },
    furniture:  { premium: 0.75, importLife: 5, domesticLife: 15,  label: 'Furniture' },
    appliances: { premium: 0.45, importLife: 8, domesticLife: 14,  label: 'Home Appliances' },
    tools:      { premium: 0.35, importLife: 3, domesticLife: 20,  label: 'Tools & Hardware' },
    food:       { premium: 0.12, importLife: 1, domesticLife: 1,   label: 'Food & Groceries' },
    auto:       { premium: 0.28, importLife: 4, domesticLife: 6,   label: 'Auto Parts' },
    toys:       { premium: 0.55, importLife: 2, domesticLife: 4,   label: 'Toys & Games' }
  };

  var durabilityAdj = { none: 0, moderate: 0.5, high: 1.0 };

  function $(id) { return document.getElementById(id); }
  function fmt(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  var chartData = [
    ['Clothing & Apparel', '40\u201380%', '+30\u201350% lifespan', '15\u201340%', 'Often yes'],
    ['Electronics', '80\u2013200%', 'Minimal', '80\u2013200%', 'Rarely'],
    ['Furniture', '50\u2013100%', '+100\u2013200% lifespan', 'Better value', 'Usually yes'],
    ['Home Appliances', '30\u201360%', '+40\u201380% lifespan', '10\u201320%', 'Often yes'],
    ['Tools & Hardware', '20\u201350%', '+200\u2013500% lifespan', 'Much better value', 'Almost always'],
    ['Food & Groceries', '5\u201320%', 'Fresher', '5\u201320%', 'Personal choice'],
    ['Auto Parts', '15\u201340%', '+30\u201360% lifespan', '0\u201315%', 'Usually yes']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  $('calcBtn').addEventListener('click', function() {
    var category = $('category').value;
    var importedPrice = parseFloat($('importedPrice').value) || 0;
    var monthlySpend = parseFloat($('monthlySpend').value) || 0;
    var qualityFactor = $('qualityFactor').value;

    if (importedPrice <= 0) return;

    var cat = categoryData[category];
    var usaPrice = importedPrice * (1 + cat.premium);
    var premiumPct = cat.premium * 100;
    var monthlyExtra = monthlySpend * cat.premium;
    var annualExtra = monthlyExtra * 12;

    // Cost per year of use
    var importCostPerYear = importedPrice / cat.importLife;
    var domesticCostPerYear = usaPrice / cat.domesticLife;

    // Durability-adjusted value
    var durAdj = durabilityAdj[qualityFactor];
    var effectiveLife = cat.domesticLife * (1 + durAdj * 0.2);
    var adjustedCostPerYear = usaPrice / effectiveLife;
    var durabilityValue = adjustedCostPerYear < importCostPerYear ? 'USA better value' :
      adjustedCostPerYear < importCostPerYear * 1.15 ? 'Roughly equal' : 'Import cheaper';
    var durColor = adjustedCostPerYear < importCostPerYear ? '#059669' :
      adjustedCostPerYear < importCostPerYear * 1.15 ? '#f59e0b' : '#dc2626';

    $('rUsaPrice').textContent = fmt(usaPrice);
    $('rPremium').textContent = '+' + premiumPct.toFixed(0) + '%';
    $('rMonthlyExtra').textContent = '+' + fmt(monthlyExtra);
    $('rAnnualExtra').textContent = '+' + fmt(annualExtra);
    $('rCostPerYear').textContent = fmt(domesticCostPerYear) + '/yr';
    $('rDurability').textContent = durabilityValue;
    $('rDurability').style.color = durColor;

    var d = '';
    d += '<div style="padding:14px;background:#eef2ff;border-radius:8px;margin-bottom:12px">';
    d += '<strong>' + cat.label + ' \u2014 Cost Per Year of Use</strong>';
    d += '<div style="margin-top:8px;display:flex;gap:16px">';
    d += '<div style="flex:1;text-align:center;padding:10px;background:#fff;border-radius:6px">';
    d += '<div style="font-size:0.8rem;color:var(--text-light)">Imported</div>';
    d += '<div style="font-size:1.1rem;font-weight:700">' + fmt(importCostPerYear) + '/yr</div>';
    d += '<div style="font-size:0.75rem;color:var(--text-light)">' + cat.importLife + ' year lifespan</div>';
    d += '</div>';
    d += '<div style="flex:1;text-align:center;padding:10px;background:#fff;border-radius:6px">';
    d += '<div style="font-size:0.8rem;color:var(--text-light)">USA Made</div>';
    d += '<div style="font-size:1.1rem;font-weight:700">' + fmt(domesticCostPerYear) + '/yr</div>';
    d += '<div style="font-size:0.75rem;color:var(--text-light)">' + cat.domesticLife + ' year lifespan</div>';
    d += '</div></div></div>';

    if (domesticCostPerYear < importCostPerYear) {
      d += '<div style="padding:12px;background:#f0fdf4;border-radius:8px;margin-bottom:12px;border-left:4px solid #059669">';
      d += '<strong style="color:#059669">USA-made is the better value</strong> when factoring in lifespan. ';
      d += 'You pay ' + fmt(usaPrice - importedPrice) + ' more upfront but save ' + fmt(importCostPerYear - domesticCostPerYear) + '/year in replacement costs.';
      d += '</div>';
    } else {
      d += '<div style="padding:12px;background:#fef2f2;border-radius:8px;margin-bottom:12px;border-left:4px solid #dc2626">';
      d += '<strong>Imported is cheaper</strong> even accounting for lifespan. The USA premium of ' + premiumPct.toFixed(0) + '% is not offset by durability gains in this category.';
      d += '</div>';
    }

    d += '<div style="padding:12px;background:#fef3c7;border-radius:8px;font-size:0.85rem">';
    d += '<strong>Note:</strong> Durability data is based on averages. Individual products vary significantly. Check consumer reviews and warranty terms for specific brands.';
    d += '</div>';

    $('resultDetails').innerHTML = d;
    $('result').classList.add('visible');
    $('result').style.display = 'block';
  });
})();
