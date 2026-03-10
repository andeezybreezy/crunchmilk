(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');
  var inputMethod = document.getElementById('inputMethod');
  var zoneInput = document.getElementById('zoneInput');
  var dateInput = document.getElementById('dateInput');

  // Avg last frost dates by zone (month-day)
  var zoneFrostDates = {
    3: '05-15', 4: '05-10', 5: '04-30', 6: '04-15',
    7: '04-01', 8: '03-15', 9: '02-15', 10: '01-31',
    11: '01-15', 12: '01-01', 13: '01-01'
  };

  // Crop data: weeksIndoor, transplantOffset (weeks from frost, negative = before), directSowOffset (weeks from frost)
  var crops = [
    { name: 'Tomato',   indoorWks: 7,  transplantWks: 1,  directSow: null },
    { name: 'Pepper',   indoorWks: 9,  transplantWks: 2,  directSow: null },
    { name: 'Eggplant', indoorWks: 8,  transplantWks: 2,  directSow: null },
    { name: 'Broccoli', indoorWks: 7,  transplantWks: -3, directSow: null },
    { name: 'Cabbage',  indoorWks: 6,  transplantWks: -3, directSow: null },
    { name: 'Lettuce',  indoorWks: 5,  transplantWks: -3, directSow: -3 },
    { name: 'Kale',     indoorWks: 6,  transplantWks: -4, directSow: -4 },
    { name: 'Cucumber', indoorWks: 3,  transplantWks: 1,  directSow: 2 },
    { name: 'Squash',   indoorWks: 3,  transplantWks: 1,  directSow: 2 },
    { name: 'Melon',    indoorWks: 4,  transplantWks: 2,  directSow: 2 },
    { name: 'Beans',    indoorWks: null, transplantWks: null, directSow: 1 },
    { name: 'Peas',     indoorWks: null, transplantWks: null, directSow: -4 },
    { name: 'Corn',     indoorWks: null, transplantWks: null, directSow: 1 },
    { name: 'Carrot',   indoorWks: null, transplantWks: null, directSow: -3 },
    { name: 'Radish',   indoorWks: null, transplantWks: null, directSow: -4 }
  ];

  inputMethod.addEventListener('change', function() {
    if (inputMethod.value === 'zone') {
      zoneInput.style.display = '';
      dateInput.style.display = 'none';
    } else {
      zoneInput.style.display = 'none';
      dateInput.style.display = '';
    }
  });

  function addDays(date, days) {
    var d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  function formatDate(d) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[d.getMonth()] + ' ' + d.getDate();
  }

  function calculate() {
    var frostDate;
    var year = new Date().getFullYear();

    if (inputMethod.value === 'zone') {
      var zone = document.getElementById('usdaZone').value;
      var fd = zoneFrostDates[zone];
      frostDate = new Date(year + '-' + fd + 'T12:00:00');
    } else {
      var dateVal = document.getElementById('frostDate').value;
      if (!dateVal) return;
      frostDate = new Date(dateVal + 'T12:00:00');
    }

    var tbody = document.getElementById('scheduleBody');
    tbody.innerHTML = '';

    for (var i = 0; i < crops.length; i++) {
      var crop = crops[i];
      var tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--border)';

      var tdName = document.createElement('td');
      tdName.style.padding = '8px';
      tdName.style.fontWeight = '600';
      tdName.textContent = crop.name;
      tr.appendChild(tdName);

      var tdIndoor = document.createElement('td');
      tdIndoor.style.padding = '8px';
      if (crop.indoorWks) {
        var startDate = addDays(frostDate, -crop.indoorWks * 7);
        tdIndoor.textContent = formatDate(startDate);
      } else {
        tdIndoor.textContent = '—';
        tdIndoor.style.color = '#9ca3af';
      }
      tr.appendChild(tdIndoor);

      var tdTransplant = document.createElement('td');
      tdTransplant.style.padding = '8px';
      if (crop.transplantWks !== null) {
        var tpDate = addDays(frostDate, crop.transplantWks * 7);
        tdTransplant.textContent = formatDate(tpDate);
      } else {
        tdTransplant.textContent = '—';
        tdTransplant.style.color = '#9ca3af';
      }
      tr.appendChild(tdTransplant);

      var tdDirect = document.createElement('td');
      tdDirect.style.padding = '8px';
      if (crop.directSow !== null) {
        var dsDate = addDays(frostDate, crop.directSow * 7);
        tdDirect.textContent = formatDate(dsDate);
      } else {
        tdDirect.textContent = '—';
        tdDirect.style.color = '#9ca3af';
      }
      tr.appendChild(tdDirect);

      tbody.appendChild(tr);
    }

    var tip = 'Last frost date: ' + formatDate(frostDate) + '. Dates are guidelines — adjust for your microclimate and weather forecasts.';
    document.getElementById('resultTip').textContent = tip;

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  document.querySelectorAll('select').forEach(function(el) {
    el.addEventListener('change', calculate);
  });
  document.getElementById('frostDate').addEventListener('change', calculate);

  // Set default frost date
  var today = new Date();
  document.getElementById('frostDate').value = today.getFullYear() + '-04-15';

  calculate();
})();
