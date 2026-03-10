(function() {
  'use strict';

  // [maxClaim, filingFeeLow, filingFeeHigh, attorneysAllowed, courtName]
  var stateData = {
    'Alabama': [6000, 50, 300, 'Yes', 'Small Claims Court / District Court'],
    'Alaska': [10000, 50, 100, 'Yes', 'Small Claims Court'],
    'Arizona': [3500, 20, 70, 'Yes', 'Justice Court'],
    'Arkansas': [5000, 30, 65, 'Yes', 'Small Claims Division'],
    'California': [10000, 30, 75, 'No', 'Small Claims Court'],
    'Colorado': [7500, 31, 55, 'No (generally)', 'County Court — Small Claims'],
    'Connecticut': [5000, 40, 95, 'Yes', 'Small Claims Court'],
    'Delaware': [25000, 35, 50, 'Yes', 'Justice of the Peace Court'],
    'Florida': [8000, 55, 300, 'Yes', 'Small Claims Court'],
    'Georgia': [15000, 45, 60, 'Yes', 'Magistrate Court'],
    'Hawaii': [5000, 35, 35, 'Yes', 'Small Claims Court'],
    'Idaho': [5000, 50, 69, 'No', 'Small Claims Dept. of Magistrate Court'],
    'Illinois': [10000, 20, 75, 'Yes', 'Small Claims Court'],
    'Indiana': [8000, 35, 82, 'Yes', 'Small Claims Court'],
    'Iowa': [6500, 20, 95, 'Yes', 'Small Claims Court'],
    'Kansas': [4000, 45, 75, 'No', 'Small Claims Court'],
    'Kentucky': [2500, 20, 35, 'No', 'Small Claims Division of District Court'],
    'Louisiana': [5000, 35, 100, 'Yes', 'Small Claims Division — City Court / Justice of Peace'],
    'Maine': [6000, 50, 80, 'Yes', 'Small Claims Court'],
    'Maryland': [5000, 34, 80, 'Yes', 'District Court — Small Claims'],
    'Massachusetts': [7000, 30, 50, 'Yes', 'Small Claims Session — District/BMC Court'],
    'Michigan': [6500, 30, 70, 'No', 'Small Claims Division of District Court'],
    'Minnesota': [15000, 50, 75, 'Yes', 'Conciliation Court'],
    'Mississippi': [3500, 31, 50, 'Yes', 'Justice Court'],
    'Missouri': [5000, 20, 50, 'Yes', 'Small Claims Court'],
    'Montana': [7000, 30, 50, 'No', 'Small Claims Court — Justice Court'],
    'Nebraska': [3600, 26, 50, 'No (generally)', 'Small Claims Court — County Court'],
    'Nevada': [10000, 55, 100, 'Yes', 'Small Claims — Justice Court'],
    'New Hampshire': [10000, 55, 55, 'Yes', 'Small Claims — District Court'],
    'New Jersey': [5000, 15, 50, 'Yes', 'Small Claims Section — Special Civil Part'],
    'New Mexico': [10000, 25, 75, 'Yes', 'Metropolitan Court / Magistrate Court'],
    'New York': [5000, 15, 20, 'No', 'Small Claims Court'],
    'North Carolina': [10000, 46, 96, 'Yes', 'Small Claims Court — District Court'],
    'North Dakota': [15000, 20, 75, 'Yes', 'Small Claims Court'],
    'Ohio': [6000, 25, 60, 'Yes', 'Small Claims Division — Municipal Court'],
    'Oklahoma': [10000, 40, 84, 'Yes', 'Small Claims Court'],
    'Oregon': [10000, 35, 52, 'No', 'Small Claims Court — Circuit/Justice Court'],
    'Pennsylvania': [12000, 45, 125, 'Yes', 'Magisterial District Court'],
    'Rhode Island': [2500, 20, 40, 'Yes', 'Small Claims Court — District Court'],
    'South Carolina': [7500, 25, 80, 'Yes', 'Magistrate Court'],
    'South Dakota': [12000, 30, 50, 'Yes', 'Small Claims Court'],
    'Tennessee': [25000, 20, 50, 'Yes', 'Court of General Sessions'],
    'Texas': [20000, 31, 54, 'Yes', 'Justice Court — Small Claims'],
    'Utah': [11000, 60, 185, 'Yes', 'Small Claims Court — Justice Court'],
    'Vermont': [5000, 50, 75, 'Yes', 'Small Claims Court — Superior Court'],
    'Virginia': [5000, 46, 62, 'Yes', 'Small Claims — General District Court'],
    'Washington': [10000, 14, 50, 'No', 'Small Claims Dept. — District Court'],
    'West Virginia': [10000, 15, 50, 'Yes', 'Magistrate Court'],
    'Wisconsin': [10000, 40, 95, 'Yes', 'Small Claims — Circuit Court'],
    'Wyoming': [6000, 10, 70, 'Yes', 'Small Claims — Circuit Court']
  };

  var stateNames = Object.keys(stateData).sort();
  var sel = document.getElementById('scState');
  stateNames.forEach(function(s) {
    var o = document.createElement('option');
    o.value = s; o.textContent = s;
    sel.appendChild(o);
  });

  function fmt(n) {
    return '$' + n.toLocaleString();
  }

  function calculate() {
    var state = document.getElementById('scState').value;
    if (!state || !stateData[state]) return;

    var d = stateData[state];
    var maxClaim = d[0];
    var feeLow = d[1];
    var feeHigh = d[2];
    var attorneys = d[3];
    var courtName = d[4];

    var claimAmount = parseFloat(document.getElementById('claimAmount').value);

    document.getElementById('maxClaim').textContent = fmt(maxClaim);
    document.getElementById('filingFee').textContent = fmt(feeLow) + (feeLow !== feeHigh ? ' – ' + fmt(feeHigh) : '');
    document.getElementById('attorneys').textContent = attorneys;
    document.getElementById('courtName').textContent = courtName;

    var tip = '';
    if (!isNaN(claimAmount) && claimAmount > 0) {
      if (claimAmount <= maxClaim) {
        tip = 'Your claim of ' + fmt(claimAmount) + ' is within ' + state + '\'s small claims limit. You can file in ' + courtName + '.';
      } else {
        tip = 'Your claim of ' + fmt(claimAmount) + ' exceeds ' + state + '\'s small claims limit of ' + fmt(maxClaim) + '. You would need to file in a higher court or reduce your claim.';
      }
    } else {
      tip = state + ' allows claims up to ' + fmt(maxClaim) + ' in small claims court.';
    }
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
