(function() {
  'use strict';

  function $(id) { return document.getElementById(id); }
  function fmt(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  var chartData = [
    ['California', '32\u00a2/kWh', '5\u20138\u00a2/kWh', 'NEM 3.0 (reduced)', 'Grandfathered NEM 2.0 better'],
    ['Texas', '13\u00a2/kWh', 'Varies by retailer', 'Market-based', 'Shop for best buyback'],
    ['Florida', '14\u00a2/kWh', '14\u00a2/kWh', 'Full retail 1:1', 'Good while it lasts'],
    ['New York', '22\u00a2/kWh', 'VDER credits', 'Value-based', 'Complex but decent'],
    ['Arizona', '14\u00a2/kWh', '8\u201310\u00a2/kWh', 'Reduced', 'Less generous than before'],
    ['Massachusetts', '28\u00a2/kWh', '28\u00a2/kWh', 'Full retail 1:1', 'Excellent for solar']
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
    var solarSize = parseFloat($('solarSize').value) || 0;
    var sunHours = parseFloat($('sunHours').value) || 0;
    var monthlyUsage = parseFloat($('monthlyUsage').value) || 0;
    var retailRate = parseFloat($('retailRate').value) || 0;
    var exportRate = parseFloat($('exportRate').value) || 0;
    var selfConsume = parseFloat($('selfConsume').value) || 0;

    if (solarSize <= 0 || sunHours <= 0 || monthlyUsage <= 0) return;

    // Monthly production = kW * peak sun hours * 30 days * 0.80 efficiency
    var monthlyProduction = solarSize * sunHours * 30 * 0.80;

    // Self-consumed portion
    var selfConsumedKwh = monthlyProduction * (selfConsume / 100);

    // Exported portion
    var exportedKwh = monthlyProduction - selfConsumedKwh;

    // Savings from self-consumption (offset at retail rate)
    var selfUseSavings = selfConsumedKwh * (retailRate / 100);

    // Export credits
    var exportCredits = exportedKwh * (exportRate / 100);

    // Total monthly savings
    var totalMonthly = selfUseSavings + exportCredits;
    var annualSavings = totalMonthly * 12;

    // Bill without solar
    var billWithout = monthlyUsage * (retailRate / 100);

    // Remaining grid usage
    var remainingGrid = Math.max(0, monthlyUsage - selfConsumedKwh);
    var gridCost = remainingGrid * (retailRate / 100);
    var netBill = gridCost - exportCredits;
    if (netBill < 0) netBill = 0;

    $('rProduction').textContent = monthlyProduction.toFixed(0) + ' kWh';
    $('rExport').textContent = exportedKwh.toFixed(0) + ' kWh';
    $('rSelfSave').textContent = fmt(selfUseSavings) + '/mo';
    $('rExportCredit').textContent = fmt(exportCredits) + '/mo';
    $('rTotalMonthly').textContent = fmt(totalMonthly) + '/mo';
    $('rTotalMonthly').style.color = '#059669';
    $('rAnnual').textContent = fmt(annualSavings) + '/yr';
    $('rAnnual').style.color = '#059669';

    var d = '';

    // Production vs usage comparison
    var prodPct = (monthlyProduction / monthlyUsage * 100).toFixed(0);
    d += '<div style="padding:14px;background:#eef2ff;border-radius:8px;margin-bottom:12px">';
    d += '<strong>Solar Production vs Usage</strong>';
    d += '<div style="margin-top:8px">';
    d += '<div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:4px">';
    d += '<span>Production: ' + monthlyProduction.toFixed(0) + ' kWh/mo</span>';
    d += '<span>Usage: ' + monthlyUsage.toFixed(0) + ' kWh/mo</span></div>';
    d += '<div style="width:100%;height:24px;background:#e5e7eb;border-radius:4px;position:relative">';
    var barW = Math.min(100, parseFloat(prodPct));
    d += '<div style="width:' + barW + '%;height:100%;background:linear-gradient(90deg,#eab308,#f59e0b);border-radius:4px;display:flex;align-items:center;justify-content:center;color:white;font-size:0.75rem;font-weight:700">' + prodPct + '% offset</div>';
    d += '</div></div></div>';

    // Bill breakdown
    d += '<div style="padding:14px;background:#f0fdf4;border-radius:8px;margin-bottom:12px">';
    d += '<strong>Monthly Bill Breakdown</strong>';
    d += '<div style="margin-top:8px;font-size:0.9rem;line-height:1.7">';
    d += 'Bill without solar: ' + fmt(billWithout) + '<br>';
    d += 'Self-use savings: -' + fmt(selfUseSavings) + '<br>';
    d += 'Export credits: -' + fmt(exportCredits) + '<br>';
    d += '<strong>Estimated new bill: ' + fmt(netBill) + '</strong>';
    d += '</div></div>';

    // Value of exports
    if (exportRate < retailRate * 0.7) {
      d += '<div style="padding:12px;background:#fef3c7;border-radius:8px;margin-bottom:12px;font-size:0.85rem">';
      d += '<strong>Battery opportunity:</strong> Your export rate (' + exportRate + '\u00a2) is much lower than retail (' + retailRate + '\u00a2). A home battery could store exports for evening self-use, saving an additional ~' + fmt((retailRate - exportRate) / 100 * exportedKwh * 0.7) + '/month by arbitraging the rate difference.';
      d += '</div>';
    }

    // 25-year projection
    var year25Savings = annualSavings * 25 * 1.15; // 3% annual rate increase average
    d += '<div style="padding:12px;background:#f9fafb;border-radius:8px;font-size:0.85rem">';
    d += '<strong>25-year estimated savings:</strong> ~' + fmt(year25Savings) + ' (assuming 3% annual rate increases). Actual savings increase over time as electricity rates rise while solar production is free.';
    d += '</div>';

    $('resultDetails').innerHTML = d;
    $('result').classList.add('visible');
    $('result').style.display = 'block';
  });
})();
