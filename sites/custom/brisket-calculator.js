(function() {
  'use strict';

  var chartData = [
    ['8 lbs', '12-16 hrs', '8-12 hrs', '6-10 hrs', '5-8 hrs'],
    ['10 lbs', '15-20 hrs', '10-15 hrs', '7.5-12 hrs', '6-10 hrs'],
    ['12 lbs', '18-24 hrs', '12-18 hrs', '9-15 hrs', '7-12 hrs'],
    ['14 lbs', '21-28 hrs', '14-21 hrs', '10.5-17 hrs', '8-14 hrs'],
    ['16 lbs', '24-32 hrs', '16-24 hrs', '12-20 hrs', '10-16 hrs'],
    ['18 lbs', '27-36 hrs', '18-27 hrs', '13.5-22 hrs', '11-18 hrs'],
    ['20 lbs', '30-40 hrs', '20-30 hrs', '15-25 hrs', '12-20 hrs']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td><td>' + row[4] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  // Minutes per pound ranges by smoker temp: [minRate, maxRate]
  var ratesByTemp = {
    '225': [90, 120],   // 1.5-2 hrs per lb
    '250': [60, 90],    // 1-1.5 hrs per lb
    '275': [45, 75],    // 45-75 min per lb
    '300': [35, 60]     // 35-60 min per lb
  };

  // Cut multipliers (flat cooks faster, point is fattier/slower)
  var cutMultiplier = {
    'full': 1.0,
    'flat': 0.85,
    'point': 0.95
  };

  function formatHours(minutes) {
    var h = Math.floor(minutes / 60);
    var m = Math.round(minutes % 60);
    if (h === 0) return m + ' min';
    if (m === 0) return h + ' hrs';
    return h + ' hrs ' + m + ' min';
  }

  function calculate() {
    var weight = parseFloat(document.getElementById('weight').value);
    var smokerTemp = document.getElementById('smokerTemp').value;
    var cut = document.getElementById('cut').value;
    var guests = parseFloat(document.getElementById('guests').value) || 0;

    if (isNaN(weight) || weight <= 0) return;

    var rates = ratesByTemp[smokerTemp] || ratesByTemp['250'];
    var mult = cutMultiplier[cut] || 1.0;

    var minMinutes = Math.round(weight * rates[0] * mult);
    var maxMinutes = Math.round(weight * rates[1] * mult);
    var avgMinutes = Math.round((minMinutes + maxMinutes) / 2);

    // Rest time: 1 hr minimum, 2 hrs for large briskets
    var restMinutes = weight >= 14 ? 120 : 60;

    // Servings: ~0.5 lb raw per person, yields ~0.33 lb cooked
    var servingsCount = Math.floor(weight / 0.5);

    // Start time calculation: if you want to serve at 6 PM, when to start
    var totalMinutesWithRest = maxMinutes + restMinutes;
    var startHoursAhead = Math.ceil(totalMinutesWithRest / 60);

    document.getElementById('cookTime').textContent = formatHours(minMinutes) + ' – ' + formatHours(maxMinutes);
    document.getElementById('restTime').textContent = (restMinutes / 60) + '+ hours';
    document.getElementById('startBy').textContent = startHoursAhead + ' hours before serving';
    document.getElementById('servings').textContent = servingsCount + ' people';

    var notes = [];
    if (weight >= 14) {
      notes.push('Large brisket — consider wrapping at 165°F to push through the stall.');
    }
    if (smokerTemp === '225') {
      notes.push('Low & slow produces the best bark but takes the longest. Start the night before.');
    }
    if (guests > 0) {
      var neededLbs = Math.ceil(guests * 0.5);
      if (neededLbs > weight) {
        notes.push('For ' + guests + ' guests you need ~' + neededLbs + ' lbs raw. Your brisket may be ' + (neededLbs - weight) + ' lbs short.');
      } else {
        notes.push('Your ' + weight + ' lb brisket is enough for ' + guests + ' guests with leftovers.');
      }
    }

    document.getElementById('note').textContent = notes.join(' ');

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  document.getElementById('weight').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });
  document.getElementById('guests').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });

})();
