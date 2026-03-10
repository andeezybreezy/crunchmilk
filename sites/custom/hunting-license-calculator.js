(function() {
  'use strict';

  var states = [
    'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia',
    'Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland',
    'Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
    'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
    'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
  ];

  // [res_hunting, nonres_hunting, res_fishing, nonres_fishing, res_combo, res_deer, nonres_deer, res_turkey, nonres_turkey, res_waterfowl, nonres_waterfowl]
  var fees = {
    'Alabama':      [17,315,13,53,27,33,385,16,100,11,11],
    'Alaska':       [25,160,25,145,48,30,800,10,60,5,5],
    'Arizona':      [37,160,37,55,57,45,300,22,85,7,7],
    'Arkansas':     [10,350,11,50,19,25,250,10,60,7,7],
    'California':   [53,183,52,142,90,33,300,24,55,10,10],
    'Colorado':     [35,379,35,97,58,43,414,21,101,5,5],
    'Connecticut':  [19,91,22,55,32,19,91,8,40,15,15],
    'Delaware':     [22,110,12,40,30,20,80,10,40,6,6],
    'Florida':      [17,152,17,47,33,5,152,5,125,3,3],
    'Georgia':      [15,170,15,50,25,20,250,15,80,5,5],
    'Hawaii':       [10,105,5,25,15,0,0,0,0,0,0],
    'Idaho':        [14,155,26,98,33,32,402,20,80,10,10],
    'Illinois':     [12,57,15,32,24,15,120,15,57,5,5],
    'Indiana':      [17,80,17,35,25,24,150,15,80,7,7],
    'Iowa':         [19,131,19,49,33,28,252,22,100,8,8],
    'Kansas':       [25,97,25,50,43,40,340,20,60,8,8],
    'Kentucky':     [27,195,20,55,40,35,275,30,65,5,5],
    'Louisiana':    [15,300,10,60,23,25,300,12,80,6,6],
    'Maine':        [26,115,25,64,43,30,115,20,70,8,8],
    'Maryland':     [25,130,21,55,38,17,150,15,60,9,9],
    'Massachusetts':[28,65,28,38,47,5,65,5,32,5,5],
    'Michigan':     [11,151,26,76,36,20,200,15,80,11,11],
    'Minnesota':    [22,153,22,45,35,30,180,23,80,8,8],
    'Mississippi':  [15,300,8,40,20,25,300,10,70,5,5],
    'Missouri':     [12,225,12,42,22,11,225,17,95,5,5],
    'Montana':      [18,260,20,86,33,25,540,15,145,10,10],
    'Nebraska':     [18,111,26,67,38,30,241,25,125,5,5],
    'Nevada':       [33,142,33,80,54,30,240,15,60,10,10],
    'New Hampshire':[13,103,25,53,33,12,103,12,50,5,5],
    'New Jersey':   [27,138,23,51,43,28,160,22,90,5,5],
    'New Mexico':   [15,290,15,56,25,32,310,20,100,5,5],
    'New York':     [22,100,25,50,40,22,100,10,65,5,5],
    'North Carolina':[20,80,15,40,30,24,250,10,55,5,5],
    'North Dakota': [20,107,18,45,30,30,220,15,80,7,7],
    'Ohio':         [19,127,19,40,31,24,147,23,90,11,11],
    'Oklahoma':     [25,225,20,55,42,26,276,16,90,8,8],
    'Oregon':       [30,168,33,98,56,32,418,25,90,9,9],
    'Pennsylvania': [21,101,23,53,39,22,102,22,102,5,5],
    'Rhode Island': [18,40,18,35,33,7,28,5,18,5,5],
    'South Carolina':[12,200,10,35,21,12,200,10,75,5,5],
    'South Dakota': [28,117,28,64,48,40,284,20,75,5,5],
    'Tennessee':    [28,226,28,50,44,31,226,20,75,8,8],
    'Texas':        [25,315,30,58,47,11,315,15,126,7,7],
    'Utah':         [26,65,26,75,42,40,263,30,65,8,8],
    'Vermont':      [28,102,28,54,50,28,102,8,25,8,8],
    'Virginia':     [23,110,23,47,39,23,230,20,80,6,6],
    'Washington':   [37,180,30,85,55,42,397,26,85,8,8],
    'West Virginia':[19,119,19,37,29,30,178,15,60,5,5],
    'Wisconsin':    [20,160,20,50,35,24,160,15,60,7,7],
    'Wyoming':      [22,285,14,92,28,46,352,20,90,8,8]
  };

  var typeIndex = {
    'hunting':    [0,1],
    'fishing':    [2,3],
    'combo':      [4,4],
    'deer':       [5,6],
    'turkey':     [7,8],
    'waterfowl':  [9,10]
  };

  var typeLabels = {
    'hunting': 'Hunting License',
    'fishing': 'Fishing License',
    'combo': 'Hunting + Fishing Combo',
    'deer': 'Deer Tag',
    'turkey': 'Turkey Tag',
    'waterfowl': 'Waterfowl Stamp'
  };

  var sel = document.getElementById('hlState');
  states.forEach(function(s) {
    var o = document.createElement('option');
    o.value = s; o.textContent = s;
    sel.appendChild(o);
  });

  var chartData = [
    ['Texas','$25','$315','$30','$58','$47'],
    ['Colorado','$35','$379','$35','$97','$58'],
    ['Montana','$18','$260','$20','$86','$33'],
    ['Wisconsin','$20','$160','$20','$50','$35'],
    ['Georgia','$15','$170','$15','$50','$25'],
    ['Pennsylvania','$21','$101','$23','$53','$39'],
    ['Michigan','$11','$151','$26','$76','$36'],
    ['Missouri','$12','$225','$12','$42','$22'],
    ['Alabama','$17','$315','$13','$53','$27'],
    ['Oregon','$30','$168','$33','$98','$56']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function fmt(n) { return '$' + Math.round(n).toLocaleString(); }

  function calculate() {
    var state = document.getElementById('hlState').value;
    var residency = document.getElementById('residency').value;
    var licType = document.getElementById('licenseType').value;

    if (!state) return;

    var data = fees[state];
    if (!data) return;

    var indices = typeIndex[licType];
    var isResident = residency === 'resident';
    var fee = data[isResident ? indices[0] : indices[1]];

    // For combo, non-resident just gets both individual
    if (licType === 'combo' && !isResident) {
      fee = data[1] + data[3]; // nonres hunt + nonres fish
    }

    var duckStamp = 0;
    if (licType === 'waterfowl') {
      duckStamp = 25;
    }
    var total = fee + duckStamp;

    document.getElementById('licenseFee').textContent = fmt(fee);
    document.getElementById('licenseLabel').textContent = typeLabels[licType] + ' (' + (isResident ? 'Resident' : 'Non-Resident') + ')';
    document.getElementById('duckStamp').textContent = licType === 'waterfowl' ? '$25 (required)' : 'N/A';
    document.getElementById('totalCost').textContent = fmt(total);

    var tip = (isResident ? 'Resident' : 'Non-resident') + ' ' + typeLabels[licType].toLowerCase() + ' in ' + state + ': ' + fmt(fee) + '. ';
    if (!isResident) {
      var resFee = data[indices[0]];
      tip += 'Residents pay ' + fmt(resFee) + ' — non-residents pay ' + fmt(fee - resFee) + ' more. ';
    }
    tip += 'Additional stamps or permits may be required. Check state wildlife agency for current prices.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
