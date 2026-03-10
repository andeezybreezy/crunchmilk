(function() {
  'use strict';

  // Hidden cost percentages by product type: [shipping, quality, inventory, IP risk, oversight]
  var hiddenCosts = {
    electronics:  { shipping: 0.10, quality: 0.05, inventory: 0.10, ip: 0.05, oversight: 0.03, domesticMult: 1.80 },
    apparel:      { shipping: 0.08, quality: 0.04, inventory: 0.08, ip: 0.02, oversight: 0.04, domesticMult: 2.80 },
    industrial:   { shipping: 0.12, quality: 0.06, inventory: 0.05, ip: 0.03, oversight: 0.03, domesticMult: 1.47 },
    furniture:    { shipping: 0.15, quality: 0.08, inventory: 0.10, ip: 0.01, oversight: 0.04, domesticMult: 1.70 },
    food:         { shipping: 0.06, quality: 0.03, inventory: 0.04, ip: 0.00, oversight: 0.02, domesticMult: 1.40 },
    medical:      { shipping: 0.08, quality: 0.10, inventory: 0.12, ip: 0.08, oversight: 0.05, domesticMult: 1.52 },
    auto:         { shipping: 0.10, quality: 0.06, inventory: 0.08, ip: 0.03, oversight: 0.03, domesticMult: 1.50 },
    plastic:      { shipping: 0.08, quality: 0.04, inventory: 0.06, ip: 0.01, oversight: 0.02, domesticMult: 1.60 }
  };

  // Country shipping cost multiplier
  var countryMult = {
    china: 1.0, vietnam: 1.05, india: 1.10, mexico: 0.40,
    taiwan: 0.95, bangladesh: 1.15, thailand: 1.05
  };

  function $(id) { return document.getElementById(id); }
  function fmt(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmtK(n) { return n >= 1000000 ? '$' + (n/1000000).toFixed(1) + 'M' : n >= 1000 ? '$' + (n/1000).toFixed(0) + 'K' : fmt(n); }

  var chartData = [
    ['Consumer Electronics', '$10.00', '+35%', '$13.50', '$18.00', '+33%'],
    ['Apparel / Textiles', '$5.00', '+30%', '$6.50', '$14.00', '+115%'],
    ['Industrial Parts', '$15.00', '+28%', '$19.20', '$22.00', '+15%'],
    ['Furniture', '$50.00', '+40%', '$70.00', '$85.00', '+21%'],
    ['Medical Devices', '$25.00', '+45%', '$36.25', '$38.00', '+5%'],
    ['Auto Parts', '$20.00', '+32%', '$26.40', '$30.00', '+14%'],
    ['Plastics/Packaging', '$2.00', '+25%', '$2.50', '$3.20', '+28%']
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
    var productType = $('productType').value;
    var offshoreUnit = parseFloat($('offshoreUnit').value) || 0;
    var annualUnits = parseFloat($('annualUnits').value) || 0;
    var sourceCountry = $('sourceCountry').value;
    var tariffRate = parseFloat($('tariffRate').value) || 0;

    if (offshoreUnit <= 0 || annualUnits <= 0) return;

    var hc = hiddenCosts[productType];
    var cMult = countryMult[sourceCountry];

    // Calculate true offshore cost
    var shippingCost = offshoreUnit * hc.shipping * cMult;
    var tariffCost = offshoreUnit * (tariffRate / 100);
    var qualityCost = offshoreUnit * hc.quality;
    var inventoryCost = offshoreUnit * hc.inventory;
    var ipCost = offshoreUnit * hc.ip;
    var oversightCost = offshoreUnit * hc.oversight;
    var totalHidden = shippingCost + tariffCost + qualityCost + inventoryCost + ipCost + oversightCost;
    var trueOffshore = offshoreUnit + totalHidden;

    // Domestic cost
    var domesticUnit = offshoreUnit * hc.domesticMult;

    // Gap
    var gap = domesticUnit - trueOffshore;
    var gapPct = (gap / trueOffshore) * 100;

    // Annual impact
    var annualImpact = gap * annualUnits;

    // Hidden costs saved by reshoring (no shipping, no tariff, reduced quality/inventory)
    var hiddenSaved = (shippingCost + tariffCost + inventoryCost * 0.6 + ipCost + oversightCost) * annualUnits;

    // Break-even tariff rate
    var costWithoutTariff = offshoreUnit + shippingCost + qualityCost + inventoryCost + ipCost + oversightCost;
    var breakEvenTariff = ((domesticUnit - costWithoutTariff) / offshoreUnit) * 100;

    $('rOffshore').textContent = fmt(trueOffshore);
    $('rDomestic').textContent = fmt(domesticUnit);
    $('rGap').textContent = (gap >= 0 ? '+' : '') + fmt(Math.abs(gap)) + ' (' + (gap >= 0 ? '+' : '') + gapPct.toFixed(1) + '%)';
    $('rGap').style.color = gap > 0 ? '#dc2626' : '#059669';
    $('rAnnual').textContent = (annualImpact >= 0 ? '+' : '-') + fmtK(Math.abs(annualImpact));
    $('rAnnual').style.color = annualImpact > 0 ? '#dc2626' : '#059669';
    $('rHidden').textContent = fmtK(hiddenSaved) + '/yr';
    $('rBreakeven').textContent = breakEvenTariff > 0 ? breakEvenTariff.toFixed(0) + '%' : 'Already competitive';
    $('rBreakeven').style.color = tariffRate >= breakEvenTariff ? '#059669' : '#f59e0b';

    var d = '';
    d += '<div style="padding:14px;background:#eef2ff;border-radius:8px;margin-bottom:12px">';
    d += '<strong>Hidden Cost Breakdown (per unit)</strong>';
    d += '<table style="width:100%;margin-top:8px;font-size:0.85rem;border-collapse:collapse">';
    d += '<tr><td>Shipping & logistics</td><td style="text-align:right">' + fmt(shippingCost) + '</td></tr>';
    d += '<tr><td>Tariff (' + tariffRate + '%)</td><td style="text-align:right">' + fmt(tariffCost) + '</td></tr>';
    d += '<tr><td>Quality/defect costs</td><td style="text-align:right">' + fmt(qualityCost) + '</td></tr>';
    d += '<tr><td>Inventory carrying</td><td style="text-align:right">' + fmt(inventoryCost) + '</td></tr>';
    d += '<tr><td>IP risk premium</td><td style="text-align:right">' + fmt(ipCost) + '</td></tr>';
    d += '<tr><td>Management/travel</td><td style="text-align:right">' + fmt(oversightCost) + '</td></tr>';
    d += '<tr style="border-top:2px solid #6366f1;font-weight:700"><td>Total hidden costs</td><td style="text-align:right">' + fmt(totalHidden) + ' (+' + ((totalHidden/offshoreUnit)*100).toFixed(0) + '%)</td></tr>';
    d += '</table></div>';

    if (gap <= 0) {
      d += '<div style="padding:12px;background:#f0fdf4;border-radius:8px;margin-bottom:12px;border-left:4px solid #059669">';
      d += '<strong style="color:#059669">Reshoring is cost-competitive!</strong> At the current ' + tariffRate + '% tariff rate, domestic manufacturing is ' + fmt(Math.abs(gap)) + '/unit cheaper when all hidden costs are included.';
      d += '</div>';
    } else if (breakEvenTariff < tariffRate + 15) {
      d += '<div style="padding:12px;background:#fef3c7;border-radius:8px;margin-bottom:12px;border-left:4px solid #f59e0b">';
      d += '<strong style="color:#92400e">Close to break-even.</strong> A tariff rate of ' + breakEvenTariff.toFixed(0) + '% would make reshoring cost-neutral. Consider non-price benefits: faster delivery, easier quality control, supply chain security.';
      d += '</div>';
    } else {
      d += '<div style="padding:12px;background:#fef2f2;border-radius:8px;margin-bottom:12px;border-left:4px solid #dc2626">';
      d += '<strong>Significant cost gap remains.</strong> Reshoring would cost +' + fmtK(Math.abs(annualImpact)) + '/year. Consider nearshoring to Mexico or investing in automation to close the gap.';
      d += '</div>';
    }

    $('resultDetails').innerHTML = d;
    $('result').classList.add('visible');
    $('result').style.display = 'block';
  });
})();
