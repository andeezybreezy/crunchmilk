(function() {
  'use strict';

  var appliances = [
    { name: 'Central AC (3 ton)',       running: 3500, surge: 7000,  checked: false },
    { name: 'Central AC (5 ton)',       running: 5000, surge: 10000, checked: false },
    { name: 'Electric Furnace/Heat',    running: 8000, surge: 8000,  checked: false },
    { name: 'Gas Furnace (blower)',     running: 800,  surge: 1600,  checked: false },
    { name: 'Heat Pump',               running: 4700, surge: 9400,  checked: false },
    { name: 'Refrigerator',            running: 200,  surge: 1200,  checked: true },
    { name: 'Freezer',                 running: 150,  surge: 900,   checked: true },
    { name: 'Well Pump (1/2 HP)',      running: 750,  surge: 2200,  checked: false },
    { name: 'Sump Pump (1/3 HP)',      running: 800,  surge: 2000,  checked: false },
    { name: 'Electric Water Heater',   running: 4500, surge: 4500,  checked: false },
    { name: 'Gas Water Heater',        running: 400,  surge: 400,   checked: false },
    { name: 'Electric Range/Oven',     running: 3000, surge: 3000,  checked: false },
    { name: 'Microwave (1000W)',       running: 1000, surge: 1500,  checked: true },
    { name: 'Dishwasher',             running: 1500, surge: 1800,  checked: false },
    { name: 'Washing Machine',         running: 500,  surge: 1200,  checked: false },
    { name: 'Dryer (electric)',        running: 5400, surge: 5400,  checked: false },
    { name: 'Dryer (gas)',             running: 700,  surge: 1400,  checked: false },
    { name: 'Lighting (10 LEDs)',      running: 100,  surge: 100,   checked: true },
    { name: 'TV & Entertainment',      running: 300,  surge: 300,   checked: true },
    { name: 'Computer & Router',       running: 400,  surge: 400,   checked: true },
    { name: 'Garage Door Opener',      running: 550,  surge: 1100,  checked: false },
    { name: 'Security System',         running: 200,  surge: 200,   checked: false },
    { name: 'EV Charger (Level 2)',    running: 7200, surge: 7200,  checked: false },
    { name: 'Hot Tub / Spa',          running: 3000, surge: 6000,  checked: false },
    { name: 'Pool Pump (1.5 HP)',      running: 1500, surge: 3000,  checked: false }
  ];

  // Generator sizes (kW) and costs
  var standbyPricing = [
    { kw: 10, cost: 3500 }, { kw: 14, cost: 4500 }, { kw: 16, cost: 5500 },
    { kw: 20, cost: 6500 }, { kw: 22, cost: 7500 }, { kw: 24, cost: 8500 },
    { kw: 30, cost: 10500 }, { kw: 36, cost: 13000 }, { kw: 48, cost: 18000 }
  ];
  var portablePricing = [
    { kw: 3, cost: 800 }, { kw: 5, cost: 1200 }, { kw: 7.5, cost: 1800 },
    { kw: 10, cost: 2500 }, { kw: 12, cost: 3200 }, { kw: 15, cost: 4500 }
  ];

  var fuelCostPerKwhDay = { naturalGas: 0.08, propane: 0.12, diesel: 0.10, gasoline: 0.14 };
  var installCost = { standby: [3000, 6000], portable: [200, 500] };

  function $(id) { return document.getElementById(id); }
  function fmt(n) { return '$' + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  // Build appliance checklist
  var listEl = $('applianceList');
  appliances.forEach(function(app, i) {
    var div = document.createElement('div');
    div.style.cssText = 'padding:4px 0;display:flex;align-items:center;gap:8px;font-size:0.9rem';
    var cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = 'app_' + i;
    cb.checked = app.checked;
    var label = document.createElement('label');
    label.htmlFor = 'app_' + i;
    label.textContent = app.name + ' (' + app.running.toLocaleString() + 'W / ' + app.surge.toLocaleString() + 'W surge)';
    label.style.cursor = 'pointer';
    div.appendChild(cb);
    div.appendChild(label);
    listEl.appendChild(div);
  });

  var chartData = [
    ['Central AC (3 ton)', '3,500', '7,000', '28\u201342', 'High (summer)'],
    ['Electric Furnace', '7,000\u201310,000', '7,000\u201310,000', '56\u201380', 'High (winter)'],
    ['Refrigerator', '150\u2013400', '400\u20131,200', '1.5\u20134', 'Essential'],
    ['Well Pump (1/2 HP)', '750', '1,500\u20132,200', '2\u20134', 'Essential'],
    ['Electric Water Heater', '4,000\u20134,500', '4,000\u20134,500', '10\u201315', 'Important'],
    ['Sump Pump (1/3 HP)', '800', '1,300\u20132,000', '1\u20133', 'Essential'],
    ['Electric Range/Oven', '2,000\u20135,000', '2,000\u20135,000', '3\u20138', 'Moderate']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  $('calcBtn').addEventListener('click', function() {
    var genType = $('genType').value;
    var fuelType = $('fuelType').value;
    var customWatts = parseFloat($('customWatts').value) || 0;

    var totalRunning = customWatts;
    var maxSurge = 0;

    appliances.forEach(function(app, i) {
      var cb = document.getElementById('app_' + i);
      if (cb && cb.checked) {
        totalRunning += app.running;
        var surgeAdd = app.surge - app.running;
        if (surgeAdd > maxSurge) maxSurge = surgeAdd;
      }
    });

    var peakWatts = totalRunning + maxSurge;
    var safetyMargin = 1.20;
    var requiredKw = (peakWatts * safetyMargin) / 1000;

    // Find recommended generator
    var pricing = genType === 'standby' ? standbyPricing : portablePricing;
    var recommended = pricing[pricing.length - 1];
    for (var i = 0; i < pricing.length; i++) {
      if (pricing[i].kw >= requiredKw) {
        recommended = pricing[i];
        break;
      }
    }

    var instRange = installCost[genType];
    var avgInstall = (instRange[0] + instRange[1]) / 2;
    var fuelPerDay = (totalRunning / 1000) * 0.5 * 24 * fuelCostPerKwhDay[fuelType]; // 50% avg load

    $('rRunning').textContent = totalRunning.toLocaleString() + ' W';
    $('rSurge').textContent = peakWatts.toLocaleString() + ' W';
    $('rSize').textContent = recommended.kw + ' kW';
    $('rCost').textContent = fmt(recommended.cost);
    $('rInstall').textContent = fmt(instRange[0]) + '\u2013' + fmt(instRange[1]);
    $('rFuel').textContent = fmt(fuelPerDay) + '/day';

    var totalCost = recommended.cost + avgInstall;

    var d = '';
    d += '<div style="padding:14px;background:#eef2ff;border-radius:8px;margin-bottom:12px">';
    d += '<strong>Sizing Breakdown</strong>';
    d += '<div style="margin-top:8px;font-size:0.9rem;line-height:1.7">';
    d += 'Total running watts: ' + totalRunning.toLocaleString() + ' W<br>';
    d += 'Largest surge addition: +' + maxSurge.toLocaleString() + ' W<br>';
    d += 'Peak requirement: ' + peakWatts.toLocaleString() + ' W<br>';
    d += 'With 20% safety margin: ' + (requiredKw).toFixed(1) + ' kW<br>';
    d += '<strong>Recommended: ' + recommended.kw + ' kW ' + (genType === 'standby' ? 'standby' : 'portable') + ' generator</strong>';
    d += '</div></div>';

    d += '<div style="padding:14px;background:#f0fdf4;border-radius:8px;margin-bottom:12px">';
    d += '<strong>Total Installed Cost Estimate</strong>';
    d += '<div style="margin-top:8px;font-size:0.9rem">';
    d += 'Generator: ' + fmt(recommended.cost) + '<br>';
    d += 'Installation: ' + fmt(instRange[0]) + '\u2013' + fmt(instRange[1]) + '<br>';
    if (genType === 'standby') {
      d += 'Transfer switch, pad, permits included<br>';
    }
    d += '<strong>Total: ' + fmt(recommended.cost + instRange[0]) + '\u2013' + fmt(recommended.cost + instRange[1]) + '</strong>';
    d += '</div></div>';

    d += '<div style="padding:14px;background:#fef3c7;border-radius:8px;margin-bottom:12px;font-size:0.85rem">';
    d += '<strong>Fuel costs at 50% load:</strong> ' + fmt(fuelPerDay) + '/day \u2248 ' + fmt(fuelPerDay * 30) + '/month of continuous run. ';
    d += 'Actual usage varies \u2014 generators rarely run at full load continuously. During a typical outage with cycling HVAC, expect 40-60% of rated load.';
    d += '</div>';

    if (requiredKw > pricing[pricing.length - 1].kw) {
      d += '<div style="padding:12px;background:#fef2f2;border-radius:8px;font-size:0.85rem">';
      d += '<strong style="color:#dc2626">Note:</strong> Your load exceeds standard ' + genType + ' generator sizes. Consider which appliances are truly essential during an outage, or look into a load management panel that cycles large loads.';
      d += '</div>';
    }

    $('resultDetails').innerHTML = d;
    $('result').classList.add('visible');
    $('result').style.display = 'block';
  });
})();
