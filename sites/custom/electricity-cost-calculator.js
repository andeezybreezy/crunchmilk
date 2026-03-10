(function() {
  'use strict';

  var presets = [
    ['Central AC', 3500, 8], ['Window AC', 1200, 8], ['Space Heater', 1500, 8],
    ['Refrigerator', 150, 24], ['Clothes Dryer', 5000, 1], ['Washer', 500, 1],
    ['Dishwasher', 1800, 1], ['Oven/Range', 2500, 1], ['Microwave', 1000, 0.5],
    ['TV (55")', 80, 5], ['Desktop PC', 200, 8], ['Laptop', 60, 8],
    ['LED Bulb', 10, 8], ['Hair Dryer', 1500, 0.25], ['Pool Pump', 1500, 8],
    ['Water Heater', 4500, 3], ['Dehumidifier', 300, 12], ['Ceiling Fan', 75, 8]
  ];

  var applianceList = [];
  var idCounter = 0;

  var watts = document.getElementById('watts');
  var hoursPerDay = document.getElementById('hoursPerDay');
  var rate = document.getElementById('rate');
  var addBtn = document.getElementById('addBtn');
  var result = document.getElementById('result');
  var totalCard = document.getElementById('totalCard');
  var totalBody = document.getElementById('totalBody');
  var clearBtn = document.getElementById('clearBtn');

  function fmt(n) { return '$' + n.toFixed(2); }

  function calculate() {
    var w = parseFloat(watts.value) || 0;
    var h = parseFloat(hoursPerDay.value) || 0;
    var r = parseFloat(rate.value) || 0;

    var dailyKwh = w * h / 1000;
    var dailyCost = dailyKwh * r;

    document.getElementById('dailyCost').textContent = fmt(dailyCost);
    document.getElementById('dailyKwh').textContent = dailyKwh.toFixed(2) + ' kWh';
    document.getElementById('weeklyCost').textContent = fmt(dailyCost * 7);
    document.getElementById('monthlyCost').textContent = fmt(dailyCost * 30);
    document.getElementById('yearlyCost').textContent = fmt(dailyCost * 365);
    document.getElementById('yearlyKwh').textContent = (dailyKwh * 365).toFixed(0) + ' kWh';
    document.getElementById('resultTip').textContent = w + 'W × ' + h + ' hrs/day = ' + dailyKwh.toFixed(2) + ' kWh/day at ' + fmt(r) + '/kWh';
  }

  function getPresetName() {
    var w = parseInt(watts.value);
    for (var i = 0; i < presets.length; i++) {
      if (presets[i][1] === w) return presets[i][0];
    }
    return w + 'W Appliance';
  }

  function renderTotal() {
    totalBody.innerHTML = '';
    if (applianceList.length === 0) { totalCard.style.display = 'none'; return; }
    totalCard.style.display = '';
    var grandMonthly = 0, grandYearly = 0;
    var r = parseFloat(rate.value) || 0;

    applianceList.forEach(function(item) {
      var monthly = item.watts * item.hours / 1000 * r * 30;
      grandMonthly += monthly;
      grandYearly += monthly * 12;
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + item.name + '</td><td>' + item.watts + '</td><td>' + item.hours + '</td><td>' + fmt(monthly) + '</td><td><button type="button" data-id="' + item.id + '" style="background:none;border:none;color:#991b1b;cursor:pointer;font-size:1.1rem">&times;</button></td>';
      totalBody.appendChild(tr);
    });

    document.getElementById('grandMonthly').textContent = fmt(grandMonthly);
    document.getElementById('grandYearly').textContent = fmt(grandYearly);

    totalBody.querySelectorAll('button').forEach(function(btn) {
      btn.addEventListener('click', function() {
        applianceList = applianceList.filter(function(a) { return a.id !== parseInt(btn.dataset.id); });
        renderTotal();
      });
    });
  }

  addBtn.addEventListener('click', function() {
    var w = parseFloat(watts.value) || 0;
    var h = parseFloat(hoursPerDay.value) || 0;
    if (w <= 0) return;
    applianceList.push({ id: ++idCounter, name: getPresetName(), watts: w, hours: h });
    renderTotal();
    totalCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  clearBtn.addEventListener('click', function() {
    applianceList = [];
    renderTotal();
  });

  function renderPresets() {
    var grid = document.getElementById('presetGrid');
    presets.forEach(function(p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'preset-btn';
      btn.innerHTML = p[0] + '<span>' + p[1] + 'W, ' + p[2] + ' hrs</span>';
      btn.addEventListener('click', function() {
        watts.value = p[1];
        hoursPerDay.value = p[2];
        calculate();
      });
      grid.appendChild(btn);
    });
  }

  [watts, hoursPerDay, rate].forEach(function(el) {
    el.addEventListener('input', calculate);
    el.addEventListener('change', calculate);
  });

  renderPresets();
  calculate();
})();
