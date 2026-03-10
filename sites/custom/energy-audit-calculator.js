(function() {
  'use strict';

  var upgrades = [
    { id: 'airSeal',    name: 'Air Sealing',                savePct: 0.10, costLow: 300,  costHigh: 1500,  taxCredit: 0.30 },
    { id: 'attic',      name: 'Attic Insulation',           savePct: 0.12, costLow: 1500, costHigh: 3000,  taxCredit: 0.30 },
    { id: 'walls',      name: 'Wall Insulation',            savePct: 0.08, costLow: 2000, costHigh: 5000,  taxCredit: 0.30 },
    { id: 'thermostat', name: 'Smart Thermostat',           savePct: 0.10, costLow: 150,  costHigh: 300,   taxCredit: 0 },
    { id: 'heatpump',   name: 'Heat Pump HVAC',             savePct: 0.25, costLow: 5000, costHigh: 15000, taxCredit: 0.30 },
    { id: 'windows',    name: 'Energy Star Windows',        savePct: 0.06, costLow: 8000, costHigh: 15000, taxCredit: 0.30 },
    { id: 'led',        name: 'LED Lighting (whole home)',  savePct: 0.04, costLow: 100,  costHigh: 400,   taxCredit: 0 },
    { id: 'hpwh',       name: 'Heat Pump Water Heater',     savePct: 0.08, costLow: 2000, costHigh: 4000,  taxCredit: 0.30 },
    { id: 'duct',       name: 'Duct Sealing & Insulation',  savePct: 0.08, costLow: 500,  costHigh: 2000,  taxCredit: 0.30 }
  ];

  var ageMultiplier = { new: 0.5, mid: 0.8, old: 1.1, veryOld: 1.4 };
  var climateMultiplier = { hot: 1.1, mixed: 1.0, cold: 1.2 };

  function $(id) { return document.getElementById(id); }
  function fmt(n) { return '$' + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  // Build upgrade checklist
  var listEl = $('upgradeList');
  upgrades.forEach(function(u) {
    var div = document.createElement('div');
    div.style.cssText = 'padding:4px 0;display:flex;align-items:center;gap:8px;font-size:0.9rem';
    var cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = 'upg_' + u.id;
    var label = document.createElement('label');
    label.htmlFor = 'upg_' + u.id;
    label.textContent = u.name + ' (' + fmt(u.costLow) + '\u2013' + fmt(u.costHigh) + ')';
    label.style.cursor = 'pointer';
    div.appendChild(cb);
    div.appendChild(label);
    listEl.appendChild(div);
  });

  var chartData = [
    ['Air Sealing', '$300\u20131,500', '$120\u2013360', '1\u20133 years', '30% (25C)'],
    ['Attic Insulation', '$1,500\u20133,000', '$240\u2013480', '3\u20136 years', '30% (25C)'],
    ['Smart Thermostat', '$150\u2013300', '$180\u2013290', '<1 year', 'Utility rebates'],
    ['Heat Pump HVAC', '$5,000\u201315,000', '$500\u20131,000', '5\u201310 years', '30% up to $2,000'],
    ['Energy Star Windows', '$8,000\u201315,000', '$200\u2013400', '20\u201330 years', '30% (25C)'],
    ['LED Lighting (whole home)', '$100\u2013400', '$75\u2013150', '<1 year', 'None'],
    ['Heat Pump Water Heater', '$2,000\u20134,000', '$200\u2013400', '5\u201310 years', '30% up to $2,000']
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
    var annualBill = parseFloat($('annualBill').value) || 0;
    var homeSize = parseFloat($('homeSize').value) || 0;
    var homeAge = $('homeAge').value;
    var climate = $('climate').value;

    if (annualBill <= 0) return;

    var ageMult = ageMultiplier[homeAge];
    var climMult = climateMultiplier[climate];
    var sizeFactor = Math.max(0.8, Math.min(1.3, homeSize / 2000));

    // Calculate savings from selected upgrades (diminishing returns)
    var totalSavePct = 0;
    var totalCostLow = 0;
    var totalCostHigh = 0;
    var totalTaxCredit = 0;
    var selectedUpgrades = [];

    upgrades.forEach(function(u) {
      var cb = document.getElementById('upg_' + u.id);
      if (cb && cb.checked) {
        var adjSave = u.savePct * ageMult * climMult * sizeFactor;
        // Diminishing returns: each additional upgrade saves from remaining
        var effectiveSave = adjSave * (1 - totalSavePct * 0.5);
        totalSavePct += effectiveSave;
        totalCostLow += u.costLow;
        totalCostHigh += u.costHigh;
        var creditAmt = u.taxCredit > 0 ? ((u.costLow + u.costHigh) / 2) * u.taxCredit : 0;
        totalTaxCredit += creditAmt;
        selectedUpgrades.push({
          name: u.name,
          savings: annualBill * effectiveSave,
          costLow: u.costLow,
          costHigh: u.costHigh,
          credit: creditAmt
        });
      }
    });

    if (selectedUpgrades.length === 0) {
      $('rSavings').textContent = 'Select upgrades';
      $('result').classList.add('visible');
      $('result').style.display = 'block';
      return;
    }

    totalSavePct = Math.min(totalSavePct, 0.55);
    var annualSavings = annualBill * totalSavePct;
    var avgCost = (totalCostLow + totalCostHigh) / 2;
    var netCost = avgCost - totalTaxCredit;
    var payback = annualSavings > 0 ? netCost / annualSavings : 999;
    var tenYearNet = (annualSavings * 10) - netCost;
    var newBill = annualBill - annualSavings;

    $('rSavings').textContent = fmt(annualSavings) + '/yr';
    $('rSavings').style.color = '#059669';
    $('rPctReduction').textContent = (totalSavePct * 100).toFixed(0) + '%';
    $('rCost').textContent = fmt(totalCostLow) + '\u2013' + fmt(totalCostHigh);
    $('rPayback').textContent = payback < 1 ? 'Under 1 year' : payback.toFixed(1) + ' years';
    $('rPayback').style.color = payback < 5 ? '#059669' : payback < 10 ? '#f59e0b' : '#dc2626';
    $('rTenYear').textContent = fmt(tenYearNet);
    $('rTenYear').style.color = tenYearNet >= 0 ? '#059669' : '#dc2626';
    $('rNewBill').textContent = fmt(newBill);

    var d = '';
    d += '<div style="padding:14px;background:#eef2ff;border-radius:8px;margin-bottom:12px">';
    d += '<strong>Upgrade Breakdown</strong>';
    d += '<table style="width:100%;margin-top:8px;font-size:0.85rem;border-collapse:collapse">';
    d += '<tr style="border-bottom:1px solid #e5e7eb"><th style="text-align:left;padding:4px">Upgrade</th><th style="text-align:right;padding:4px">Annual Savings</th><th style="text-align:right;padding:4px">Cost</th></tr>';
    selectedUpgrades.forEach(function(u) {
      d += '<tr><td style="padding:4px">' + u.name + '</td>';
      d += '<td style="text-align:right;padding:4px;color:#059669">' + fmt(u.savings) + '</td>';
      d += '<td style="text-align:right;padding:4px">' + fmt(u.costLow) + '\u2013' + fmt(u.costHigh) + '</td></tr>';
    });
    d += '</table></div>';

    if (totalTaxCredit > 0) {
      d += '<div style="padding:14px;background:#f0fdf4;border-radius:8px;margin-bottom:12px">';
      d += '<strong style="color:#059669">Tax Credits & Incentives</strong>';
      d += '<div style="margin-top:8px;font-size:0.9rem">';
      d += 'Estimated 25C federal tax credit: <strong>' + fmt(totalTaxCredit) + '</strong><br>';
      d += 'Net cost after credits: ' + fmt(netCost) + '<br>';
      d += 'Effective payback with credits: ' + (netCost / annualSavings).toFixed(1) + ' years';
      d += '</div></div>';
    }

    d += '<div style="padding:12px;background:#fef3c7;border-radius:8px;font-size:0.85rem">';
    d += '<strong>Note:</strong> Savings estimates are based on DOE and ENERGY STAR data adjusted for your home age, climate, and size. Actual savings depend on your specific home conditions. A professional energy audit ($200-600) can identify your best opportunities with precision.';
    d += '</div>';

    $('resultDetails').innerHTML = d;
    $('result').classList.add('visible');
    $('result').style.display = 'block';
  });
})();
