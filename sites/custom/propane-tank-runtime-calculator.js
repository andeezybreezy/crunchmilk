(function() {
  'use strict';

  var BTU_PER_GALLON = 91502;

  var chartData = [
    ['1 lb cylinder', '0.24', '2.2 hrs', '0.7 hrs', '0.4 hrs'],
    ['20 lb (grill)', '4.7', '34.4 hrs', '14.3 hrs', '7.2 hrs'],
    ['30 lb', '7.1', '51.9 hrs', '21.7 hrs', '10.8 hrs'],
    ['40 lb', '9.4', '68.8 hrs', '28.7 hrs', '14.3 hrs'],
    ['100 lb', '23.6', '172.7 hrs', '72.0 hrs', '36.0 hrs'],
    ['500 gallon', '400', '2,928 hrs', '1,220 hrs', '610 hrs'],
    ['1,000 gallon', '800', '5,856 hrs', '2,440 hrs', '1,220 hrs']
  ];

  var chartBody = document.getElementById('chartBody');
  if (chartBody && chartBody.children.length === 0) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td><td>' + row[4] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  document.getElementById('tankSize').addEventListener('change', function() {
    document.getElementById('customTankGroup').style.display = this.value === 'custom' ? '' : 'none';
  });

  document.getElementById('btuUsage').addEventListener('change', function() {
    document.getElementById('customBtuGroup').style.display = this.value === 'custom' ? '' : 'none';
  });

  function calculate() {
    var tankSel = document.getElementById('tankSize').value;
    var gallons = tankSel === 'custom'
      ? parseFloat(document.getElementById('customGallons').value)
      : parseFloat(tankSel);

    var fillLevel = parseFloat(document.getElementById('fillLevel').value) / 100;

    var btuSel = document.getElementById('btuUsage').value;
    var btuPerHour = btuSel === 'custom'
      ? parseFloat(document.getElementById('customBtu').value)
      : parseFloat(btuSel);

    if (isNaN(gallons) || isNaN(fillLevel) || isNaN(btuPerHour) || gallons <= 0 || btuPerHour <= 0) return;

    var usableGallons = gallons * fillLevel;
    var totalBtu = usableGallons * BTU_PER_GALLON;
    var runtimeHours = totalBtu / btuPerHour;
    var gallonsPerHour = btuPerHour / BTU_PER_GALLON;
    var costPerHour = gallonsPerHour * 2.50;
    var daysAt8Hrs = runtimeHours / 8;

    var runtimeStr;
    if (runtimeHours >= 24) {
      var days = Math.floor(runtimeHours / 24);
      var hrs = Math.round(runtimeHours % 24);
      runtimeStr = days + ' days, ' + hrs + ' hrs';
    } else {
      runtimeStr = runtimeHours.toFixed(1) + ' hours';
    }

    document.getElementById('runtime').textContent = runtimeStr;
    document.getElementById('usable').textContent = usableGallons.toFixed(1) + ' gallons';
    document.getElementById('totalBtu').textContent = Math.round(totalBtu).toLocaleString() + ' BTU';
    document.getElementById('burnRate').textContent = gallonsPerHour.toFixed(2) + ' gal/hr';
    document.getElementById('days').textContent = daysAt8Hrs.toFixed(1) + ' days';
    document.getElementById('costHr').textContent = '$' + costPerHour.toFixed(2);

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('convertBtn').addEventListener('click', calculate);

  ['customGallons', 'fillLevel', 'customBtu'].forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

})();
