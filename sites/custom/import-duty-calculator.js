(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function fmtDollars(n) {
    var sign = n < 0 ? '-' : '';
    return sign + '$' + fmt(Math.abs(n), 0).replace(/\..*/, '');
  }

  function fmtPct(n) { return fmt(n, 1) + '%'; }

  // Base duty rates by product category (percentage)
  var dutyRates = {
    electronics_consumer: 2.6,
    electronics_components: 1.5,
    clothing_cotton: 16.5,
    clothing_wool: 20,
    footwear: 12,
    furniture: 3.2,
    auto_parts: 3,
    steel: 2,
    aluminum: 3,
    plastics: 4,
    machinery: 2,
    toys: 0,
    food_processed: 6.5,
    beverages: 3,
    alcohol: 8,
    cosmetics: 4.5,
    pharmaceuticals: 0,
    textiles_raw: 10,
    ceramics: 8,
    tools: 4,
    batteries: 3.4,
    solar_panels: 2.5,
    chemicals: 5,
    paper: 0,
    jewelry: 6.5,
    sporting_goods: 4,
    musical: 5,
    medical_devices: 0,
    lumber: 3,
    agricultural: 5
  };

  // Tariff surcharges by country (percentage added on top)
  var countrySurcharges = {
    china: 20,
    eu: 2,
    japan: 0,
    south_korea: 0,
    taiwan: 0,
    vietnam: 2,
    india: 5,
    mexico: 0,
    canada: 0,
    uk: 0,
    thailand: 1,
    indonesia: 2,
    malaysia: 0,
    bangladesh: 2,
    other: 2
  };

  // Some product-specific China surcharges override the general rate
  var chinaSurchargeOverrides = {
    steel: 25,
    aluminum: 25,
    auto_parts: 25,
    solar_panels: 15,
    electronics_consumer: 10,
    electronics_components: 7.5,
    machinery: 25,
    batteries: 25,
    furniture: 25,
    clothing_cotton: 7.5,
    clothing_wool: 7.5,
    textiles_raw: 7.5,
    toys: 7.5,
    ceramics: 25,
    tools: 25,
    plastics: 25,
    chemicals: 25
  };

  var productType = document.getElementById('productType');
  var countryOrigin = document.getElementById('countryOrigin');
  var declaredValue = document.getElementById('declaredValue');
  var shippingCost = document.getElementById('shippingCost');
  var quantity = document.getElementById('quantity');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['Consumer Electronics', '0-3.9%', '7.5-25%', '7.5-28.9%', '0-3.9%'],
    ['Clothing (Cotton)', '12-20%', '7.5%', '19.5-27.5%', '12-20%'],
    ['Footwear', '8-20%', '15%', '23-35%', '8-20%'],
    ['Auto Parts', '2.5-4%', '25%', '27.5-29%', '2.5-4%'],
    ['Steel Products', '0-3%', '25%', '25-28%', '0-3%'],
    ['Furniture', '0-5%', '25%', '25-30%', '0-5%']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td><td>' + row[4] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getVal(el) {
    var v = parseFloat(el.value);
    return isNaN(v) ? 0 : v;
  }

  function calculate() {
    var product = productType.value;
    var country = countryOrigin.value;
    var value = getVal(declaredValue);
    var shipping = getVal(shippingCost);
    var qty = Math.max(getVal(quantity), 1);

    if (value <= 0) return;

    var dutiableValue = value + shipping;
    var baseDutyRate = dutyRates[product] || 3;

    var surchargeRate = countrySurcharges[country] || 0;
    if (country === 'china' && chinaSurchargeOverrides[product] !== undefined) {
      surchargeRate = chinaSurchargeOverrides[product];
    }

    var baseDuty = dutiableValue * (baseDutyRate / 100);
    var surcharge = dutiableValue * (surchargeRate / 100);
    var totalDuty = baseDuty + surcharge;

    // Processing fees
    var mpf = Math.min(Math.max(dutiableValue * 0.003464, 31.67), 614.35);
    var hmf = shipping > 0 ? dutiableValue * 0.00125 : 0;

    var totalLanded = value + shipping + totalDuty + mpf + hmf;
    var costIncrease = ((totalLanded - value) / value) * 100;
    var perUnit = totalLanded / qty;

    document.getElementById('rDuty').textContent = fmtDollars(baseDuty);
    document.getElementById('rSurcharge').textContent = fmtDollars(surcharge);
    document.getElementById('rSurcharge').style.color = surcharge > 0 ? '#dc2626' : '';
    document.getElementById('rTotalDuty').textContent = fmtDollars(totalDuty);
    document.getElementById('rTotalDuty').style.color = '#dc2626';
    document.getElementById('rLanded').textContent = fmtDollars(totalLanded);
    document.getElementById('rIncrease').textContent = '+' + fmtPct(costIncrease);
    document.getElementById('rIncrease').style.color = '#dc2626';
    document.getElementById('rPerUnit').textContent = fmtDollars(perUnit);

    var countryName = countryOrigin.options[countryOrigin.selectedIndex].text;
    var productName = productType.options[productType.selectedIndex].text;

    var d = '';
    d += '<div style="padding:12px;background:#fef2f2;border-radius:8px;font-size:0.9rem;margin-bottom:12px">';
    d += '<strong>Cost Breakdown: ' + productName + ' from ' + countryName + '</strong><br>';
    d += 'Declared value: ' + fmtDollars(value) + '<br>';
    d += 'Shipping: ' + fmtDollars(shipping) + '<br>';
    d += 'Dutiable value: ' + fmtDollars(dutiableValue) + '<br>';
    d += '<hr style="border:none;border-top:1px solid #fca5a5;margin:8px 0">';
    d += 'Base duty (' + fmtPct(baseDutyRate) + '): ' + fmtDollars(baseDuty) + '<br>';
    if (surcharge > 0) {
      d += '<span style="color:#dc2626">Tariff surcharge (' + fmtPct(surchargeRate) + '): ' + fmtDollars(surcharge) + '</span><br>';
    }
    d += 'Processing fee (MPF): ' + fmtDollars(mpf) + '<br>';
    if (hmf > 0) d += 'Harbor maintenance fee: ' + fmtDollars(hmf) + '<br>';
    d += '<hr style="border:none;border-top:1px solid #fca5a5;margin:8px 0">';
    d += '<strong>Total landed cost: ' + fmtDollars(totalLanded) + '</strong>';
    if (qty > 1) d += ' (' + fmtDollars(perUnit) + ' per unit)';
    d += '</div>';

    if (surchargeRate > 0) {
      d += '<div style="padding:12px;background:#fefce8;border-radius:8px;font-size:0.85rem">';
      d += '<strong>Note:</strong> ' + countryName + ' imports carry a ' + fmtPct(surchargeRate) + ' tariff surcharge on this category. ';
      d += 'This adds ' + fmtDollars(surcharge) + ' to your costs. ';
      d += 'Consider sourcing from countries with lower or zero surcharges (Japan, South Korea, Canada, Mexico under USMCA).';
      d += '</div>';
    }

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

  var inputs = [productType, countryOrigin, declaredValue, shippingCost, quantity];
  inputs.forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
