(function() {
  'use strict';

  var states = [
    'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia',
    'Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland',
    'Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
    'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
    'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
  ];

  // States with non-standard premium rates
  var stateRates = {
    'California': 0.10, 'Colorado': 0.15, 'Florida': 0.10, 'Georgia': 0.12,
    'Illinois': 0.10, 'Kentucky': 0.10, 'Louisiana': 0.12, 'Massachusetts': 0.10,
    'Minnesota': 0.10, 'Nebraska': 0.10, 'New York': 0.10, 'Oregon': 0.10,
    'Texas': 0.10, 'Virginia': 0.10, 'Washington': 0.10, 'Wisconsin': 0.10
  };
  var defaultRate = 0.10;

  var sel = document.getElementById('bbState');
  states.forEach(function(s) {
    var o = document.createElement('option');
    o.value = s; o.textContent = s;
    sel.appendChild(o);
  });

  function fmt(n) {
    return '$' + Math.round(n).toLocaleString();
  }

  function calculate() {
    var bail = parseFloat(document.getElementById('bailAmount').value);
    var state = document.getElementById('bbState').value;

    if (isNaN(bail) || bail <= 0) return;

    var rate = stateRates[state] || defaultRate;
    var premium = bail * rate;

    document.getElementById('bondPremium').textContent = fmt(premium);
    document.getElementById('premiumRate').textContent = (rate * 100) + '%';
    document.getElementById('cashBail').textContent = fmt(bail);
    document.getElementById('cashRefund').textContent = fmt(bail) + '*';
    document.getElementById('netBond').textContent = fmt(premium) + ' (non-refundable)';
    document.getElementById('netCash').textContent = '$0 if compliant*';

    var tip = '*Cash bail is refunded minus small administrative fees when the defendant makes all court appearances and the case concludes. Bond premium is never refunded.';
    if (bail >= 50000) {
      tip += ' For bail over $50,000, collateral is typically required for a bond.';
    }
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
