(function() {
  'use strict';

  // State max fees per notarization (in-person)
  var stateFees = {
    'Alabama': 5, 'Alaska': 5, 'Arizona': 10, 'Arkansas': 5, 'California': 15,
    'Colorado': 5, 'Connecticut': 5, 'Delaware': 5, 'Florida': 10, 'Georgia': 2,
    'Hawaii': 5, 'Idaho': 5, 'Illinois': 5, 'Indiana': 5, 'Iowa': 5,
    'Kansas': 5, 'Kentucky': 5, 'Louisiana': 5, 'Maine': 5, 'Maryland': 4,
    'Massachusetts': 5, 'Michigan': 10, 'Minnesota': 5, 'Mississippi': 5, 'Missouri': 5,
    'Montana': 10, 'Nebraska': 5, 'Nevada': 15, 'New Hampshire': 10, 'New Jersey': 2.50,
    'New Mexico': 5, 'New York': 2, 'North Carolina': 5, 'North Dakota': 5, 'Ohio': 5,
    'Oklahoma': 5, 'Oregon': 5, 'Pennsylvania': 5, 'Rhode Island': 5, 'South Carolina': 5,
    'South Dakota': 5, 'Tennessee': 5, 'Texas': 6, 'Utah': 5, 'Vermont': 10,
    'Virginia': 5, 'Washington': 10, 'West Virginia': 5, 'Wisconsin': 5, 'Wyoming': 5
  };

  var stateNames = Object.keys(stateFees).sort();
  var sel = document.getElementById('nfState');
  stateNames.forEach(function(s) {
    var o = document.createElement('option');
    o.value = s; o.textContent = s;
    sel.appendChild(o);
  });

  function fmt(n) {
    return '$' + n.toFixed(2);
  }

  function calculate() {
    var state = document.getElementById('nfState').value;
    var numSigs = parseInt(document.getElementById('numSigs').value, 10) || 1;
    var notaryType = document.getElementById('notaryType').value;

    if (!state) return;

    var perFee = stateFees[state] || 5;
    var travelFee = 0;

    if (notaryType === 'ron') {
      perFee = 25;
    } else if (notaryType === 'mobile') {
      travelFee = 75; // typical travel fee
    }

    var notaryTotal = perFee * numSigs;
    var grandTotal = notaryTotal + travelFee;

    document.getElementById('perFee').textContent = fmt(perFee);
    document.getElementById('notaryTotal').textContent = fmt(notaryTotal) + ' (' + numSigs + ' signature' + (numSigs !== 1 ? 's' : '') + ')';
    document.getElementById('travelFee').textContent = travelFee > 0 ? fmt(travelFee) : 'N/A';
    document.getElementById('grandTotal').textContent = fmt(grandTotal);

    var tip = '';
    if (notaryType === 'inperson') {
      tip = 'State max fee for ' + state + ': ' + fmt(stateFees[state]) + ' per notarization. Many banks offer free notary services to account holders.';
    } else if (notaryType === 'ron') {
      tip = 'RON rate is typically $25 per notarization regardless of state. Requires identity verification and secure video call.';
    } else {
      tip = 'Mobile notary travel fee varies by distance and time of day ($25-$150+). The $75 shown is a typical estimate.';
    }
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
