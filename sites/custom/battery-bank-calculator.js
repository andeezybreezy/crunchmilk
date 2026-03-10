(function() {
  'use strict';

  var batteryTypes = {
    lifepo4: { name: 'LiFePO4', dod: 0.85, costPerAh12V: 0.50, cycles: 5000 },
    agm:     { name: 'AGM Lead-Acid', dod: 0.50, costPerAh12V: 0.28, cycles: 650 },
    flooded: { name: 'Flooded Lead-Acid', dod: 0.50, costPerAh12V: 0.16, cycles: 1000 },
    gel:     { name: 'Gel Lead-Acid', dod: 0.50, costPerAh12V: 0.32, cycles: 600 }
  };

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 1;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  function fmtD(n) { return '$' + fmt(n, 0).replace(/\..*/, ''); }

  var dailyWhEl = document.getElementById('dailyWh');
  var systemVoltageEl = document.getElementById('systemVoltage');
  var autonomyDaysEl = document.getElementById('autonomyDays');
  var batteryTypeEl = document.getElementById('batteryType');
  var batteryAhEl = document.getElementById('batteryAh');
  var batteryVoltageEl = document.getElementById('batteryVoltage');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  var chartData = [
    ['LiFePO4', '80-90%', '4,000-6,000', '$0.40-$0.60', '1.5-2.0 kWh', '10-15 years'],
    ['AGM Lead-Acid', '50%', '500-800', '$0.20-$0.35', '0.7-1.0 kWh', '3-5 years'],
    ['Flooded Lead-Acid', '50%', '800-1,200', '$0.12-$0.20', '1.0-1.5 kWh', '3-7 years'],
    ['Gel Lead-Acid', '50%', '500-700', '$0.25-$0.40', '0.5-0.8 kWh', '3-5 years'],
    ['Lithium NMC', '80%', '2,000-3,000', '$0.35-$0.55', '1.2-1.6 kWh', '7-10 years']
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
    var dailyWh = getVal(dailyWhEl);
    var sysV = parseInt(systemVoltageEl.value);
    var days = getVal(autonomyDaysEl);
    var bType = batteryTypeEl.value;
    var batAh = parseInt(batteryAhEl.value);
    var batV = parseInt(batteryVoltageEl.value);

    if (dailyWh <= 0 || days <= 0) return;

    var bat = batteryTypes[bType];

    // Core formula: Total Ah = (daily_Wh * days) / (system_voltage * DoD)
    var totalWhNeeded = dailyWh * days;
    var requiredAh = totalWhNeeded / (sysV * bat.dod);
    var totalKwh = (requiredAh * sysV) / 1000;

    // Wiring configuration
    var seriesPerString = sysV / batV; // e.g., 24V system / 12V battery = 2 in series
    var parallelStrings = Math.ceil(requiredAh / batAh);
    var totalBatteries = seriesPerString * parallelStrings;
    var actualAh = parallelStrings * batAh;
    var actualKwh = (actualAh * sysV) / 1000;

    // Cost estimate
    var costPerBat = bat.costPerAh12V * batAh * (batV / 12);
    var totalCost = totalBatteries * costPerBat;

    document.getElementById('rAh').textContent = fmt(requiredAh, 0) + ' Ah';
    document.getElementById('rKwh').textContent = fmt(actualKwh, 1) + ' kWh';
    document.getElementById('rCount').textContent = totalBatteries + ' batteries';
    document.getElementById('rCost').textContent = fmtD(totalCost);

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">';

    d += '<div style="padding:14px;background:#fffbeb;border-radius:8px;border-left:4px solid #f59e0b">';
    d += '<strong>Bank Specifications</strong><br>';
    d += 'Battery type: ' + bat.name + '<br>';
    d += 'System voltage: ' + sysV + 'V<br>';
    d += 'Required capacity: ' + fmt(requiredAh, 0) + ' Ah @ ' + sysV + 'V<br>';
    d += 'Actual capacity: ' + fmt(actualAh, 0) + ' Ah @ ' + sysV + 'V<br>';
    d += 'Usable energy: ' + fmt(actualAh * sysV * bat.dod / 1000, 1) + ' kWh';
    d += '</div>';

    d += '<div style="padding:14px;background:#f0fdf4;border-radius:8px;border-left:4px solid #059669">';
    d += '<strong>Wiring Configuration</strong><br>';
    d += 'Batteries per string (series): ' + seriesPerString + '<br>';
    d += 'Parallel strings: ' + parallelStrings + '<br>';
    d += 'Total batteries: ' + totalBatteries + ' x ' + batAh + 'Ah ' + batV + 'V<br>';
    d += 'Estimated cost: ' + fmtD(totalCost);
    d += '</div>';

    d += '</div>';

    // Energy budget breakdown
    d += '<div style="padding:14px;background:#f9fafb;border-radius:8px;margin-bottom:12px;font-size:0.9rem">';
    d += '<strong>Energy Budget</strong><br>';
    d += 'Daily consumption: ' + fmt(dailyWh, 0) + ' Wh (' + fmt(dailyWh / 1000, 1) + ' kWh)<br>';
    d += 'Autonomy: ' + fmt(days, 1) + ' days = ' + fmt(totalWhNeeded, 0) + ' Wh total<br>';
    d += 'Depth of discharge: ' + (bat.dod * 100) + '% (' + bat.name + ')<br>';
    d += 'Battery lifespan: ~' + bat.cycles + ' cycles (' + fmt(bat.cycles / 365, 0) + '+ years at 1 cycle/day)';
    d += '</div>';

    // Solar array recommendation
    var solarWatts = Math.ceil((dailyWh * 1.3) / 5); // 1.3x buffer, 5 peak sun hours
    d += '<div style="padding:14px;background:#eff6ff;border-radius:8px;margin-bottom:12px;font-size:0.9rem;border-left:4px solid #3b82f6">';
    d += '<strong>Recommended Solar Array</strong><br>';
    d += 'To recharge this bank daily: ~' + fmt(solarWatts, 0) + 'W of solar panels<br>';
    d += '<span style="font-size:0.8rem;color:var(--text-light)">Based on 5 peak sun hours/day with 30% system loss buffer</span>';
    d += '</div>';

    // Compare battery types
    d += '<div style="font-size:0.85rem;margin-top:12px">';
    d += '<strong>Battery Type Comparison (for your system)</strong>';
    d += '<table style="width:100%;border-collapse:collapse;margin-top:8px">';
    d += '<tr style="border-bottom:2px solid #e5e7eb"><th style="text-align:left;padding:6px">Type</th><th style="text-align:right;padding:6px">Batteries</th><th style="text-align:right;padding:6px">Cost</th><th style="text-align:right;padding:6px">$/cycle</th></tr>';
    var types = ['lifepo4', 'agm', 'flooded', 'gel'];
    types.forEach(function(t) {
      var bt = batteryTypes[t];
      var tAh = totalWhNeeded / (sysV * bt.dod);
      var tParallel = Math.ceil(tAh / batAh);
      var tTotal = seriesPerString * tParallel;
      var tCost = tTotal * bt.costPerAh12V * batAh * (batV / 12);
      var costPerCycle = tCost / bt.cycles;
      var isCurrent = t === bType;
      d += '<tr style="border-bottom:1px solid #f3f4f6;' + (isCurrent ? 'background:#fffbeb' : '') + '">';
      d += '<td style="padding:6px">' + bt.name + '</td>';
      d += '<td style="text-align:right;padding:6px">' + tTotal + '</td>';
      d += '<td style="text-align:right;padding:6px">' + fmtD(tCost) + '</td>';
      d += '<td style="text-align:right;padding:6px">$' + fmt(costPerCycle, 2) + '</td>';
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

  [dailyWhEl, autonomyDaysEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
