(function() {
  'use strict';

  var tariffRates = {
    electronics: { china: 54, eu: 20, mexico: 25, canada: 25, other: 10 },
    clothing:    { china: 67, eu: 20, mexico: 25, canada: 25, other: 12 },
    auto:        { china: 79, eu: 25, mexico: 25, canada: 25, other: 25 },
    steel:       { china: 79, eu: 25, mexico: 25, canada: 25, other: 25 },
    food:        { china: 54, eu: 20, mexico: 25, canada: 25, other: 5 },
    furniture:   { china: 54, eu: 20, mexico: 25, canada: 25, other: 8 },
    machinery:   { china: 79, eu: 20, mexico: 25, canada: 25, other: 10 }
  };

  var preTariffRates = {
    electronics: { china: 25, eu: 3, mexico: 0, canada: 0, other: 3 },
    clothing:    { china: 25, eu: 12, mexico: 0, canada: 0, other: 12 },
    auto:        { china: 27.5, eu: 2.5, mexico: 0, canada: 0, other: 2.5 },
    steel:       { china: 25, eu: 0, mexico: 0, canada: 0, other: 0 },
    food:        { china: 25, eu: 5, mexico: 0, canada: 0, other: 5 },
    furniture:   { china: 25, eu: 3, mexico: 0, canada: 0, other: 3 },
    machinery:   { china: 25, eu: 3, mexico: 0, canada: 0, other: 3 }
  };

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function fmtD(n) {
    var sign = n < 0 ? '-' : '';
    return sign + '$' + fmt(Math.abs(n), 0).replace(/\..*/, '');
  }

  var catEl = document.getElementById('productCategory');
  var countryEl = document.getElementById('countryOrigin');
  var valueEl = document.getElementById('productValue');
  var unitsEl = document.getElementById('unitCount');
  var rateEl = document.getElementById('tariffRate');
  var preRateEl = document.getElementById('preTariffRate');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function updateRates() {
    var cat = catEl.value;
    var country = countryEl.value;
    if (tariffRates[cat] && tariffRates[cat][country]) {
      rateEl.value = tariffRates[cat][country];
      preRateEl.value = preTariffRates[cat][country];
    }
  }

  catEl.addEventListener('change', updateRates);
  countryEl.addEventListener('change', updateRates);
  updateRates();

  var chartData = [
    ['Electronics', '54%', '20%', '25%', '25%', '10%'],
    ['Clothing', '67%', '20%', '25%', '25%', '12%'],
    ['Auto Parts', '79%', '25%', '25%', '25%', '25%'],
    ['Steel/Aluminum', '79%', '25%', '25%', '25%', '25%'],
    ['Food/Ag', '54%', '20%', '25%', '25%', '5%'],
    ['Furniture', '54%', '20%', '25%', '25%', '8%'],
    ['Machinery', '79%', '20%', '25%', '25%', '10%']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getVal(el) { var v = parseFloat(el.value); return isNaN(v) ? 0 : v; }

  function calculate() {
    var value = getVal(valueEl);
    var units = getVal(unitsEl) || 1;
    var rate = getVal(rateEl) / 100;
    var preRate = getVal(preRateEl) / 100;

    if (value <= 0) return;

    var tariffAmt = value * rate;
    var preTariffAmt = value * preRate;
    var shipping = value * 0.05;
    var landed = value + tariffAmt + shipping;
    var preLanded = value + preTariffAmt + shipping;
    var perUnitIncrease = (tariffAmt - preTariffAmt) / units;
    var passThrough = 0.7;
    var consumerImpact = ((tariffAmt - preTariffAmt) * passThrough / units);
    var pctIncrease = preLanded > 0 ? ((landed - preLanded) / preLanded) * 100 : 0;

    document.getElementById('rTariffAmt').textContent = fmtD(tariffAmt);
    document.getElementById('rLanded').textContent = fmtD(landed);
    document.getElementById('rPerUnit').textContent = '+' + fmtD(perUnitIncrease) + '/unit';
    document.getElementById('rConsumer').textContent = '+' + fmtD(consumerImpact) + '/unit';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">';

    d += '<div style="padding:14px;background:#fef2f2;border-radius:8px;border-left:4px solid #dc2626">';
    d += '<strong style="color:#dc2626">Before (Pre-2025)</strong><br>';
    d += 'Tariff rate: ' + fmt(preRate * 100, 1) + '%<br>';
    d += 'Tariff amount: ' + fmtD(preTariffAmt) + '<br>';
    d += 'Landed cost: ' + fmtD(preLanded) + '<br>';
    d += 'Per unit: ' + fmtD(preLanded / units);
    d += '</div>';

    d += '<div style="padding:14px;background:#fef2f2;border-radius:8px;border-left:4px solid #991b1b">';
    d += '<strong style="color:#991b1b">After (2025-2026)</strong><br>';
    d += 'Tariff rate: ' + fmt(rate * 100, 1) + '%<br>';
    d += 'Tariff amount: ' + fmtD(tariffAmt) + '<br>';
    d += 'Landed cost: ' + fmtD(landed) + '<br>';
    d += 'Per unit: ' + fmtD(landed / units);
    d += '</div>';

    d += '</div>';

    d += '<div style="padding:14px;background:#f9fafb;border-radius:8px;font-size:0.9rem">';
    d += '<strong>Impact Summary</strong><br>';
    d += 'Additional tariff cost: <strong style="color:#dc2626">+' + fmtD(tariffAmt - preTariffAmt) + '</strong><br>';
    d += 'Landed cost increase: <strong>' + fmt(pctIncrease, 1) + '%</strong><br>';
    d += 'Estimated consumer price increase: <strong>+' + fmtD(consumerImpact) + '/unit</strong> (assumes 70% pass-through)<br>';
    if (units > 1) {
      d += 'Total additional cost across ' + fmt(units, 0) + ' units: <strong style="color:#dc2626">+' + fmtD(tariffAmt - preTariffAmt) + '</strong>';
    }
    d += '</div>';

    document.getElementById('resultDetails').innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [valueEl, unitsEl, rateEl, preRateEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
