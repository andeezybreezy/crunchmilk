(function() {
  'use strict';

  // [lodging, mie, breakfast, lunch, dinner, incidentals]
  var rates = {
    'nyc':      [282, 79, 18, 20, 36, 5],
    'sf':       [311, 79, 18, 20, 36, 5],
    'dc':       [256, 79, 18, 20, 36, 5],
    'la':       [209, 74, 17, 18, 34, 5],
    'chicago':  [229, 79, 18, 20, 36, 5],
    'boston':    [265, 79, 18, 20, 36, 5],
    'seattle':  [222, 74, 17, 18, 34, 5],
    'miami':    [196, 74, 17, 18, 34, 5],
    'denver':   [199, 74, 17, 18, 34, 5],
    'atlanta':  [159, 69, 16, 17, 31, 5],
    'high':     [200, 74, 17, 18, 34, 5],
    'standard': [107, 59, 13, 15, 26, 5]
  };

  function fmt(n) {
    return '$' + n.toFixed(0);
  }

  function calculate() {
    var city = document.getElementById('pdCity').value;
    var days = parseInt(document.getElementById('travelDays').value, 10) || 1;
    var pdType = document.getElementById('pdType').value;

    if (!city || !rates[city]) return;

    var r = rates[city];
    var lodging = r[0];
    var mie = r[1];
    var breakfast = r[2];
    var lunch = r[3];
    var dinner = r[4];
    var incidentals = r[5];

    var dailyLodging = pdType === 'meals' ? 0 : lodging;
    var dailyTotal = dailyLodging + mie;
    var tripTotal = dailyTotal * days;

    document.getElementById('lodging').textContent = pdType === 'meals' ? 'N/A' : fmt(lodging) + '/night';
    document.getElementById('mie').textContent = fmt(mie) + '/day';
    document.getElementById('dailyTotal').textContent = fmt(dailyTotal);
    document.getElementById('tripTotal').textContent = '$' + tripTotal.toLocaleString();
    document.getElementById('breakfast').textContent = fmt(breakfast);
    document.getElementById('lunch').textContent = fmt(lunch);
    document.getElementById('dinner').textContent = fmt(dinner);
    document.getElementById('incidentals').textContent = fmt(incidentals);

    var tip = 'First and last travel days are typically reimbursed at 75% of M&IE (' + fmt(Math.round(mie * 0.75)) + '). Rates shown are approximate and updated annually by GSA.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
