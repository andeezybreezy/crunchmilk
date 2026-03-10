(function() {
  'use strict';

  // importShare: % of retail price that is import cost, passThrough: % of tariff passed to consumer
  var categories = {
    electronics: { importShare: 0.45, passThrough: 0.90, label: 'Electronics' },
    clothing:    { importShare: 0.28, passThrough: 0.70, label: 'Clothing & Shoes' },
    appliances:  { importShare: 0.50, passThrough: 0.82, label: 'Home Appliances' },
    auto:        { importShare: 0.33, passThrough: 0.80, label: 'Automobiles & Parts' },
    food:        { importShare: 0.20, passThrough: 0.95, label: 'Food & Beverages' },
    furniture:   { importShare: 0.42, passThrough: 0.78, label: 'Furniture & Home Goods' },
    toys:        { importShare: 0.38, passThrough: 0.85, label: 'Toys & Games' },
    steel:       { importShare: 0.60, passThrough: 0.95, label: 'Steel & Aluminum Products' }
  };

  function $(id) { return document.getElementById(id); }
  function fmt(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  var chartData = [
    ['Electronics', '40\u201350%', '85\u201395%', '+3.5\u20134.5%', '+8.5\u201312%'],
    ['Clothing & Shoes', '20\u201335%', '60\u201380%', '+1.5\u20132.5%', '+3\u20137%'],
    ['Home Appliances', '40\u201360%', '75\u201390%', '+3\u20135%', '+7.5\u201313.5%'],
    ['Automobiles', '25\u201340%', '70\u201390%', '+2\u20133.5%', '+4.5\u20139%'],
    ['Food & Beverages', '15\u201325%', '90\u2013100%', '+1.5\u20132.5%', '+3.5\u20136%'],
    ['Furniture', '35\u201350%', '70\u201385%', '+2.5\u20134%', '+6\u201310.5%'],
    ['Steel Products', '50\u201370%', '90\u2013100%', '+4.5\u20137%', '+11\u201317.5%']
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
    var productCat = $('productCat').value;
    var currentPrice = parseFloat($('currentPrice').value) || 0;
    var tariffOld = parseFloat($('tariffOld').value) || 0;
    var tariffNew = parseFloat($('tariffNew').value) || 0;
    var annualSpend = parseFloat($('annualSpend').value) || 0;

    if (currentPrice <= 0) return;

    var cat = categories[productCat];
    var tariffDelta = tariffNew - tariffOld;

    // Import cost portion of the retail price
    var importCost = currentPrice * cat.importShare;

    // Price increase = import cost × tariff increase × pass-through rate
    // But we need to account for the fact that current price already includes old tariff
    var preTariffImportCost = importCost / (1 + tariffOld / 100 * cat.passThrough * cat.importShare);
    var newTariffCost = preTariffImportCost * (tariffDelta / 100) * cat.passThrough;
    var priceIncrease = currentPrice * cat.importShare * (tariffDelta / 100) * cat.passThrough;

    var newPrice = currentPrice + priceIncrease;
    var pctRise = (priceIncrease / currentPrice) * 100;
    var annualCost = annualSpend > 0 ? annualSpend * (pctRise / 100) : 0;

    $('rNewPrice').textContent = fmt(newPrice);
    $('rIncrease').textContent = (priceIncrease >= 0 ? '+' : '') + fmt(priceIncrease);
    $('rIncrease').style.color = priceIncrease > 0 ? '#dc2626' : '#059669';
    $('rPctRise').textContent = (pctRise >= 0 ? '+' : '') + pctRise.toFixed(1) + '%';
    $('rPctRise').style.color = pctRise > 0 ? '#dc2626' : '#059669';
    $('rAnnualCost').textContent = annualCost > 0 ? '+' + fmt(annualCost) + '/yr' : '\u2014';
    $('rAnnualCost').style.color = '#dc2626';
    $('rPassThrough').textContent = (cat.passThrough * 100).toFixed(0) + '%';
    $('rImportShare').textContent = (cat.importShare * 100).toFixed(0) + '%';

    var d = '';
    d += '<div style="padding:14px;background:#eef2ff;border-radius:8px;margin-bottom:12px">';
    d += '<strong>How the Price Increase Breaks Down</strong>';
    d += '<div style="margin-top:8px;font-size:0.9rem;line-height:1.7">';
    d += 'Current price: ' + fmt(currentPrice) + '<br>';
    d += 'Import cost share (' + (cat.importShare * 100).toFixed(0) + '%): ' + fmt(importCost) + '<br>';
    d += 'Tariff change: ' + tariffOld.toFixed(1) + '% \u2192 ' + tariffNew.toFixed(1) + '% (+' + tariffDelta.toFixed(1) + ' pts)<br>';
    d += 'Pass-through rate: ' + (cat.passThrough * 100).toFixed(0) + '%<br>';
    d += 'Consumer price increase: ' + fmt(priceIncrease);
    d += '</div></div>';

    // Context comparison
    d += '<div style="padding:14px;background:#f9fafb;border-radius:8px;margin-bottom:12px">';
    d += '<strong>Household Impact Context</strong>';
    d += '<div style="margin-top:8px;font-size:0.9rem">';
    if (annualSpend > 0) {
      d += 'At ' + fmt(annualSpend) + '/year spending in ' + cat.label + ':<br>';
      d += 'Annual tariff cost to you: <strong style="color:#dc2626">' + fmt(annualCost) + '</strong><br>';
      d += 'Monthly increase: ' + fmt(annualCost / 12);
    } else {
      d += 'Enter your annual spending in this category to see your total household impact.';
    }
    d += '</div></div>';

    if (tariffDelta > 0) {
      d += '<div style="padding:12px;background:#fef3c7;border-radius:8px;font-size:0.85rem">';
      d += '<strong>Ways to reduce impact:</strong> Buy domestic alternatives, shop before tariffs take effect, choose brands from non-tariffed countries, buy used/refurbished, or wait for supply chains to adjust (6-12 months).';
      d += '</div>';
    }

    $('resultDetails').innerHTML = d;
    $('result').classList.add('visible');
    $('result').style.display = 'block';
  });
})();
