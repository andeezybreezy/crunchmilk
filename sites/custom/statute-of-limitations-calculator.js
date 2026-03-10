(function() {
  'use strict';

  var states = [
    'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia',
    'Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland',
    'Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
    'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
    'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
  ];

  // Statute of limitations in years: [written_contract, oral_contract, personal_injury, property_damage, fraud, medical_malpractice]
  var solData = {
    'Alabama':       [6,6,2,6,2,2], 'Alaska':        [3,3,2,6,2,2], 'Arizona':       [6,3,2,2,3,2],
    'Arkansas':      [5,5,3,3,5,2], 'California':    [4,2,2,3,3,3], 'Colorado':      [6,6,3,2,3,2],
    'Connecticut':   [6,3,2,2,3,2], 'Delaware':      [3,3,2,2,3,2], 'Florida':       [5,4,4,4,4,2],
    'Georgia':       [6,4,2,4,4,2], 'Hawaii':        [6,6,2,2,6,2], 'Idaho':         [5,4,2,3,3,2],
    'Illinois':      [10,5,2,5,5,2],'Indiana':       [10,6,2,6,6,2],'Iowa':          [10,5,2,5,5,2],
    'Kansas':        [5,3,2,2,2,2], 'Kentucky':      [10,5,1,5,5,1],'Louisiana':     [10,10,1,1,1,1],
    'Maine':         [6,6,6,6,6,3], 'Maryland':      [3,3,3,3,3,3], 'Massachusetts': [6,6,3,3,3,3],
    'Michigan':      [6,6,3,3,6,2], 'Minnesota':     [6,6,2,6,6,4], 'Mississippi':   [3,3,3,3,3,2],
    'Missouri':      [10,5,5,5,5,2],'Montana':       [8,5,3,2,2,3], 'Nebraska':      [5,4,4,4,4,2],
    'Nevada':        [6,4,2,3,3,3], 'New Hampshire': [3,3,3,3,3,2], 'New Jersey':    [6,6,2,6,6,2],
    'New Mexico':    [6,4,3,4,4,3], 'New York':      [6,6,3,3,6,2], 'North Carolina':[3,3,3,3,3,2],
    'North Dakota':  [6,6,6,6,6,2], 'Ohio':          [8,6,2,4,4,1], 'Oklahoma':      [5,3,2,2,2,2],
    'Oregon':        [6,6,2,6,2,2], 'Pennsylvania':  [4,4,2,2,2,2], 'Rhode Island':  [10,10,3,10,3,3],
    'South Carolina':[3,3,3,3,3,3], 'South Dakota':  [6,6,3,6,6,2], 'Tennessee':     [6,6,1,3,3,1],
    'Texas':         [4,4,2,2,4,2], 'Utah':          [6,4,4,3,3,2], 'Vermont':       [6,6,3,3,6,3],
    'Virginia':      [5,3,2,5,2,2], 'Washington':    [6,3,3,3,3,3], 'West Virginia': [10,5,2,2,2,2],
    'Wisconsin':     [6,6,3,6,6,3], 'Wyoming':       [10,8,4,4,4,2]
  };

  var typeIndex = {
    'written_contract': 0, 'oral_contract': 1, 'personal_injury': 2,
    'property_damage': 3, 'fraud': 4, 'medical_malpractice': 5
  };

  var typeLabels = {
    'written_contract': 'Written Contract', 'oral_contract': 'Oral Contract',
    'personal_injury': 'Personal Injury', 'property_damage': 'Property Damage',
    'fraud': 'Fraud', 'medical_malpractice': 'Medical Malpractice'
  };

  var sel = document.getElementById('solState');
  states.forEach(function(s) {
    var o = document.createElement('option');
    o.value = s; o.textContent = s;
    sel.appendChild(o);
  });

  // Populate chart
  var chartData = [
    ['California','4','2','2','3','3'],
    ['Texas','4','4','2','2','4'],
    ['New York','6','6','3','3','6'],
    ['Florida','5','4','4','4','4'],
    ['Illinois','10','5','2','5','5'],
    ['Pennsylvania','4','4','2','2','2'],
    ['Ohio','8','6','2','4','4'],
    ['Georgia','6','4','2','4','4'],
    ['Michigan','6','6','3','3','6'],
    ['Virginia','5','3','2','5','2']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var state = document.getElementById('solState').value;
    var caseType = document.getElementById('caseType').value;
    var dateStr = document.getElementById('incidentDate').value;

    if (!state) return;

    var data = solData[state];
    if (!data) return;

    var idx = typeIndex[caseType];
    var years = data[idx];

    document.getElementById('solYears').textContent = years + ' year' + (years !== 1 ? 's' : '');

    if (dateStr) {
      var incident = new Date(dateStr + 'T00:00:00');
      var deadlineDate = new Date(incident);
      deadlineDate.setFullYear(deadlineDate.getFullYear() + years);

      var opts = { year: 'numeric', month: 'long', day: 'numeric' };
      document.getElementById('deadline').textContent = deadlineDate.toLocaleDateString('en-US', opts);

      var now = new Date();
      var diff = deadlineDate.getTime() - now.getTime();
      var daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

      if (daysLeft > 0) {
        var monthsLeft = Math.floor(daysLeft / 30.44);
        var yrsLeft = Math.floor(monthsLeft / 12);
        var moLeft = monthsLeft % 12;
        var remaining = yrsLeft > 0 ? yrsLeft + 'y ' + moLeft + 'mo' : daysLeft + ' days';
        document.getElementById('timeRemaining').textContent = remaining;
        document.getElementById('filingStatus').textContent = 'Open — file before deadline';
        document.getElementById('filingStatus').style.color = '#16a34a';
      } else {
        document.getElementById('timeRemaining').textContent = 'Expired';
        document.getElementById('filingStatus').textContent = 'Likely expired — consult attorney';
        document.getElementById('filingStatus').style.color = '#dc2626';
      }
    } else {
      document.getElementById('deadline').textContent = 'Enter date above';
      document.getElementById('timeRemaining').textContent = '—';
      document.getElementById('filingStatus').textContent = '—';
      document.getElementById('filingStatus').style.color = '';
    }

    var tip = typeLabels[caseType] + ' claims in ' + state + ' must be filed within ' + years + ' year' + (years !== 1 ? 's' : '') + '. ';
    tip += 'Exceptions may apply (discovery rule, tolling for minors, defendant absence). Always consult an attorney.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
