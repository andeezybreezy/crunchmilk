(function() {
  'use strict';

  var batteries = {
    powerwall: { name: 'Tesla Powerwall 3', capacity: 13.5, cost: 8500, power: 11.5 },
    enphase:   { name: 'Enphase IQ 5P', capacity: 5, cost: 5000, power: 3.84 },
    lg:        { name: 'LG RESU Prime', capacity: 16, cost: 11000, power: 7 },
    generac:   { name: 'Generac PWRcell', capacity: 18, cost: 12000, power: 9 }
  };

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 1;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  function fmtD(n) { return '$' + fmt(Math.abs(n), 0).replace(/\..*/, ''); }

  var dailyUsageEl = document.getElementById('dailyUsage');
  var backupModeEl = document.getElementById('backupMode');
  var backupHoursEl = document.getElementById('backupHours');
  var batteryBrandEl = document.getElementById('batteryBrand');
  var solarSizeEl = document.getElementById('solarSize');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['Tesla Powerwall 3', '13.5 kWh', '11.5 kW', '$8,500', '$5,950', '10 years'],
    ['Enphase IQ 5P', '5 kWh', '3.84 kW', '$5,000', '$3,500', '15 years'],
    ['LG RESU Prime', '16 kWh', '7 kW', '$11,000', '$7,700', '10 years'],
    ['Generac PWRcell', '18 kWh', '9 kW', '$12,000', '$8,400', '10 years'],
    ['Franklin WH aPower2', '15 kWh', '10 kW', '$10,000', '$7,000', '12 years']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getVal(el) { var v = parseFloat(el.value); return isNaN(v) ? 0 : v; }

  function calculate() {
    var dailyUsage = getVal(dailyUsageEl);
    var mode = backupModeEl.value;
    var hours = getVal(backupHoursEl);
    var brand = batteryBrandEl.value;
    var solarKW = getVal(solarSizeEl);

    if (dailyUsage <= 0 || hours <= 0) return;

    var bat = batteries[brand];
    var loadFraction = mode === 'critical' ? 0.35 : 1.0;
    var hourlyLoad = (dailyUsage * loadFraction) / 24;

    // Solar offset: ~4.5 peak sun hours, but only during daytime (~10 of 24 hours useful)
    var solarDailyKWh = solarKW * 4.5;
    var solarHourlyAvg = hours > 10 ? solarDailyKWh / hours : (solarKW > 0 ? solarDailyKWh / Math.min(hours, 10) * (Math.min(hours, 10) / hours) : 0);
    var netHourlyLoad = Math.max(0, hourlyLoad - solarHourlyAvg);

    var totalEnergyNeeded = netHourlyLoad * hours;
    var usableCapacity = bat.capacity * 0.9; // 90% depth of discharge
    var batteriesNeeded = Math.ceil(totalEnergyNeeded / usableCapacity);
    if (batteriesNeeded < 1) batteriesNeeded = 1;

    var totalCapacity = batteriesNeeded * bat.capacity;
    var actualBackupHours = (totalCapacity * 0.9) / hourlyLoad;
    var installCost = 4500;
    var equipmentCost = batteriesNeeded * bat.cost;
    var totalCost = equipmentCost + installCost;
    var taxCredit = totalCost * 0.30;
    var afterCredit = totalCost - taxCredit;

    document.getElementById('rCount').textContent = batteriesNeeded + ' ' + bat.name.split(' ')[0];
    document.getElementById('rCapacity').textContent = fmt(totalCapacity, 1) + ' kWh';
    document.getElementById('rCost').textContent = fmtD(totalCost);
    document.getElementById('rAfterCredit').textContent = fmtD(afterCredit);
    document.getElementById('rAfterCredit').style.color = '#059669';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">';

    d += '<div style="padding:14px;background:#fffbeb;border-radius:8px;border-left:4px solid #f59e0b">';
    d += '<strong>System Specs</strong><br>';
    d += 'Battery: ' + bat.name + '<br>';
    d += 'Units needed: ' + batteriesNeeded + '<br>';
    d += 'Total capacity: ' + fmt(totalCapacity, 1) + ' kWh<br>';
    d += 'Max power output: ' + fmt(batteriesNeeded * bat.power, 1) + ' kW<br>';
    d += 'Backup mode: ' + (mode === 'critical' ? 'Critical loads' : 'Whole home');
    d += '</div>';

    d += '<div style="padding:14px;background:#f0fdf4;border-radius:8px;border-left:4px solid #059669">';
    d += '<strong>Cost Breakdown</strong><br>';
    d += 'Equipment: ' + fmtD(equipmentCost) + ' (' + batteriesNeeded + ' × ' + fmtD(bat.cost) + ')<br>';
    d += 'Installation (est): ' + fmtD(installCost) + '<br>';
    d += 'Total before credit: ' + fmtD(totalCost) + '<br>';
    d += '30% federal ITC: <strong style="color:#059669">-' + fmtD(taxCredit) + '</strong><br>';
    d += '<strong>Net cost: ' + fmtD(afterCredit) + '</strong>';
    d += '</div>';

    d += '</div>';

    d += '<div style="padding:14px;background:#f9fafb;border-radius:8px;margin-bottom:12px;font-size:0.9rem">';
    d += '<strong>Backup Duration</strong><br>';
    d += 'Load: ' + fmt(hourlyLoad, 2) + ' kW (' + (mode === 'critical' ? '~35% of daily usage' : 'full home') + ')<br>';
    if (solarKW > 0) {
      d += 'Solar production: ~' + fmt(solarDailyKWh, 1) + ' kWh/day (' + fmt(solarKW, 1) + ' kW system)<br>';
      d += 'Without solar: ' + fmt((totalCapacity * 0.9) / hourlyLoad, 0) + ' hours<br>';
      d += 'With solar recharging: <strong style="color:#059669">~' + fmt(actualBackupHours * 1.4, 0) + '+ hours</strong> (during sunny days)';
    } else {
      d += 'Estimated backup: <strong>' + fmt(actualBackupHours, 0) + ' hours</strong>';
    }
    d += '</div>';

    // Compare all brands
    d += '<div style="font-size:0.85rem;margin-top:12px">';
    d += '<strong>Quick Comparison (for your usage)</strong>';
    d += '<table style="width:100%;border-collapse:collapse;margin-top:8px">';
    d += '<tr style="border-bottom:2px solid #e5e7eb"><th style="text-align:left;padding:6px">Brand</th><th style="text-align:right;padding:6px">Units</th><th style="text-align:right;padding:6px">Cost</th><th style="text-align:right;padding:6px">After ITC</th></tr>';
    var brands = ['powerwall', 'enphase', 'lg', 'generac'];
    brands.forEach(function(b) {
      var bt = batteries[b];
      var units = Math.ceil(totalEnergyNeeded / (bt.capacity * 0.9));
      if (units < 1) units = 1;
      var cost = units * bt.cost + installCost;
      var after = cost * 0.7;
      var isCurrent = b === brand;
      d += '<tr style="border-bottom:1px solid #f3f4f6;' + (isCurrent ? 'background:#fffbeb' : '') + '">';
      d += '<td style="padding:6px">' + bt.name + '</td>';
      d += '<td style="text-align:right;padding:6px">' + units + '</td>';
      d += '<td style="text-align:right;padding:6px">' + fmtD(cost) + '</td>';
      d += '<td style="text-align:right;padding:6px">' + fmtD(after) + '</td>';
      d += '</tr>';
    });
    d += '</table></div>';

    document.getElementById('resultDetails').innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [dailyUsageEl, backupHoursEl, solarSizeEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
