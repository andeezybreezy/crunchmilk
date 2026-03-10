(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function calculate() {
    var area = val('area');
    var nPct = val('nPct');
    var pPct = val('pPct');
    var kPct = val('kPct');
    var desiredN = val('desiredN');
    var bagWeight = val('bagWeight');

    if (area <= 0 || nPct <= 0 || desiredN <= 0 || bagWeight <= 0) return;

    // lbs of product per 1,000 sq ft = desired N / (N% / 100)
    var productPer1000 = desiredN / (nPct / 100);

    // Total product for entire area
    var totalProduct = productPer1000 * (area / 1000);

    // Bags needed
    var bags = Math.ceil(totalProduct / bagWeight);

    // Actual nutrients applied per 1,000 sq ft
    var actualN = productPer1000 * (nPct / 100);
    var actualP = productPer1000 * (pPct / 100);
    var actualK = productPer1000 * (kPct / 100);

    document.getElementById('perThousand').textContent = productPer1000.toFixed(2) + ' lbs';
    document.getElementById('totalProduct').textContent = totalProduct.toFixed(1) + ' lbs';
    document.getElementById('bags').textContent = bags + ' bag' + (bags !== 1 ? 's' : '') + ' (' + bagWeight + ' lb)';
    document.getElementById('actualN').textContent = actualN.toFixed(2) + ' lbs N/1,000';
    document.getElementById('actualP').textContent = actualP.toFixed(2) + ' lbs P';
    document.getElementById('actualK').textContent = actualK.toFixed(2) + ' lbs K';

    var formula = nPct + '-' + pPct + '-' + kPct;
    document.getElementById('resultTip').textContent =
      formula + ' fertilizer · ' + area.toLocaleString() + ' sq ft · ' + desiredN + ' lb N target';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  document.querySelectorAll('input[type="number"]').forEach(function(el) {
    el.addEventListener('input', calculate);
  });

  calculate();

  // Populate chart
  var tbody = document.querySelector('.chart-table tbody');
  if (tbody) {
    var products = [
      { name: '10-10-10', n: 10, p: 10, k: 10 },
      { name: '16-4-8', n: 16, p: 4, k: 8 },
      { name: '24-0-6', n: 24, p: 0, k: 6 },
      { name: '29-0-4', n: 29, p: 0, k: 4 },
      { name: '46-0-0 (Urea)', n: 46, p: 0, k: 0 },
      { name: '15-15-15', n: 15, p: 15, k: 15 },
      { name: '6-2-0 (Milorganite)', n: 6, p: 2, k: 0 }
    ];
    products.forEach(function(prod) {
      var lbsPer1000 = 1.0 / (prod.n / 100);
      var tr = document.createElement('tr');
      [
        prod.name,
        lbsPer1000.toFixed(2) + ' lbs',
        '1.0 lb',
        (lbsPer1000 * prod.p / 100).toFixed(2) + ' lb',
        (lbsPer1000 * prod.k / 100).toFixed(2) + ' lb'
      ].forEach(function(txt) {
        var td = document.createElement('td');
        td.textContent = txt;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
})();
