(function() {
  'use strict';

  var chartData = [
    ['Chicken breasts (1 lb)', '12-24 hrs', '30-60 min', '5-8 min'],
    ['Whole chicken (4 lbs)', '24 hrs', '2 hrs', '20-30 min'],
    ['Ground meat (1 lb)', '12-24 hrs', '30-60 min', '5-8 min'],
    ['Steak (1-2 lbs)', '12-24 hrs', '30-60 min', '8-12 min'],
    ['Pork chops (1 lb)', '12-24 hrs', '30-60 min', '5-8 min'],
    ['Pork roast (5 lbs)', '24-36 hrs', '2.5 hrs', '25-40 min'],
    ['Turkey (12 lbs)', '2-3 days', '6 hrs', 'Not recommended'],
    ['Turkey (20 lbs)', '4-5 days', '10 hrs', 'Not recommended'],
    ['Fish fillets (1 lb)', '8-12 hrs', '20-30 min', '3-5 min'],
    ['Brisket (12 lbs)', '2-3 days', '6 hrs', 'Not recommended']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  // Thawing rates by method (hours per pound)
  // Fridge: ~5 hrs/lb (24 hrs for 5 lbs)
  // Cold water: ~0.5 hrs/lb (30 min per lb)
  // Microwave: ~0.1 hrs/lb (6 min per lb)
  var methodRates = {
    fridge:    { rate: 4.8, label: 'Refrigerator (40°F)', minHours: 8 },
    coldwater: { rate: 0.5, label: 'Cold Water Bath', minHours: 0.33 },
    microwave: { rate: 0.1, label: 'Microwave Defrost', minHours: 0.05 }
  };

  // Meat type modifiers (density/shape affects thawing)
  var meatModifiers = {
    beef:         { mult: 1.0, fridgeLife: '1-2 days', note: '' },
    pork:         { mult: 1.0, fridgeLife: '1-2 days', note: '' },
    chicken:      { mult: 1.1, fridgeLife: '1 day', note: 'Whole poultry takes longer due to cavity.' },
    chickenParts: { mult: 0.8, fridgeLife: '1 day', note: '' },
    turkey:       { mult: 1.2, fridgeLife: '1-2 days', note: 'Large turkeys should only be fridge-thawed.' },
    fish:         { mult: 0.7, fridgeLife: '1 day', note: 'Fish thaws faster due to thin cuts. Do not over-thaw.' },
    ground:       { mult: 0.8, fridgeLife: '1 day', note: 'Ground meat thaws faster but spoils quicker. Cook promptly.' },
    lamb:         { mult: 1.0, fridgeLife: '1-2 days', note: '' }
  };

  function formatTime(hours) {
    if (hours < 1) {
      return Math.round(hours * 60) + ' minutes';
    } else if (hours < 24) {
      var h = Math.floor(hours);
      var m = Math.round((hours - h) * 60);
      if (m === 0) return h + ' hour' + (h !== 1 ? 's' : '');
      return h + ' hr ' + m + ' min';
    } else {
      var days = (hours / 24).toFixed(1);
      return days + ' days';
    }
  }

  function calculate() {
    var weight = parseFloat(document.getElementById('weight').value);
    var meatType = document.getElementById('meatType').value;
    var method = document.getElementById('method').value;

    if (isNaN(weight) || weight <= 0) return;

    var mRate = methodRates[method];
    var mMod = meatModifiers[meatType];

    var thawHours = Math.max(weight * mRate.rate * mMod.mult, mRate.minHours);

    // Large items (>10 lbs) shouldn't use microwave
    var warning = '';
    if (method === 'microwave' && weight > 6) {
      warning = 'Microwave thawing is not recommended for items over 6 lbs. Use refrigerator or cold water method instead.';
    }

    // Start-by calculation
    var startByText = '';
    if (method === 'fridge') {
      var daysAhead = Math.ceil(thawHours / 24);
      startByText = daysAhead + ' day' + (daysAhead !== 1 ? 's' : '') + ' before cooking';
    } else if (method === 'coldwater') {
      startByText = formatTime(thawHours) + ' before cooking';
    } else {
      startByText = 'Right before cooking';
    }

    // Fridge life after thawing
    var fridgeLife = mMod.fridgeLife;
    if (method !== 'fridge') {
      fridgeLife = 'Cook immediately';
    }

    document.getElementById('thawTime').textContent = formatTime(thawHours);
    document.getElementById('startBy').textContent = startByText;
    document.getElementById('fridgeLife').textContent = fridgeLife;
    document.getElementById('methodNote').textContent = mRate.label;

    var safetyNotes = [];
    if (mMod.note) safetyNotes.push(mMod.note);
    if (warning) safetyNotes.push(warning);
    if (method === 'coldwater') safetyNotes.push('Change water every 30 minutes. Keep meat in leak-proof packaging.');
    if (method === 'microwave') safetyNotes.push('Cook immediately after microwave thawing — some areas may begin cooking.');

    document.getElementById('safetyNote').textContent = safetyNotes.join(' ');

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  document.getElementById('weight').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });

})();
