(function() {
  'use strict';

  var PHYSICAL = 23;
  var EMOTIONAL = 28;
  var INTELLECTUAL = 33;

  // Set default dates
  var targetInput = document.getElementById('targetDate');
  var today = new Date();
  targetInput.value = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

  function daysBetween(d1, d2) {
    var ms = d2.getTime() - d1.getTime();
    return Math.floor(ms / (1000 * 60 * 60 * 24));
  }

  function bioValue(days, period) {
    return Math.sin(2 * Math.PI * days / period) * 100;
  }

  function formatVal(v) {
    var sign = v >= 0 ? '+' : '';
    return sign + v.toFixed(0) + '%';
  }

  function isCritical(days, period) {
    var val = Math.abs(bioValue(days, period));
    return val < 5;
  }

  function formatDate(d) {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[d.getMonth()] + ' ' + d.getDate();
  }

  function calculate() {
    var bd = document.getElementById('birthdate').value;
    var td = document.getElementById('targetDate').value;
    if (!bd || !td) return;

    var birthDate = new Date(bd + 'T00:00:00');
    var targetDate = new Date(td + 'T00:00:00');
    var days = daysBetween(birthDate, targetDate);

    if (days < 0) return;

    var phys = bioValue(days, PHYSICAL);
    var emot = bioValue(days, EMOTIONAL);
    var intl = bioValue(days, INTELLECTUAL);

    document.getElementById('physical').textContent = formatVal(phys);
    document.getElementById('physical').style.color = phys >= 0 ? '#16a34a' : '#dc2626';
    document.getElementById('emotional').textContent = formatVal(emot);
    document.getElementById('emotional').style.color = emot >= 0 ? '#16a34a' : '#dc2626';
    document.getElementById('intellectual').textContent = formatVal(intl);
    document.getElementById('intellectual').style.color = intl >= 0 ? '#16a34a' : '#dc2626';
    document.getElementById('daysAlive').textContent = days.toLocaleString();

    // Critical days in next 30 days
    var criticals = [];
    for (var i = 0; i <= 30; i++) {
      var d = days + i;
      var labels = [];
      if (isCritical(d, PHYSICAL)) labels.push('Physical');
      if (isCritical(d, EMOTIONAL)) labels.push('Emotional');
      if (isCritical(d, INTELLECTUAL)) labels.push('Intellectual');
      if (labels.length > 0) {
        var cDate = new Date(targetDate.getTime() + i * 86400000);
        criticals.push(formatDate(cDate) + ': ' + labels.join(', '));
      }
    }

    var critDiv = document.getElementById('criticalDays');
    if (criticals.length > 0) {
      critDiv.innerHTML = '<strong>Critical Days (next 30 days):</strong><br>' + criticals.join('<br>');
    } else {
      critDiv.innerHTML = '<strong>No critical days in the next 30 days.</strong>';
    }

    // 30-day text forecast
    var forecastDiv = document.getElementById('forecast');
    var rows = '';
    for (var j = 0; j <= 30; j += 3) {
      var fd = days + j;
      var fDate = new Date(targetDate.getTime() + j * 86400000);
      var p = bioValue(fd, PHYSICAL);
      var e = bioValue(fd, EMOTIONAL);
      var il = bioValue(fd, INTELLECTUAL);

      function bar(v) {
        var filled = Math.round((v + 100) / 200 * 10);
        var b = '';
        for (var k = 0; k < 10; k++) {
          b += k < filled ? '\u2588' : '\u2591';
        }
        return b;
      }

      rows += '<div style="font-family:monospace;font-size:0.8rem;margin:2px 0;">' +
        formatDate(fDate).padStart(6) + '  P:' + bar(p) + '  E:' + bar(e) + '  I:' + bar(il) +
        '</div>';
    }
    forecastDiv.innerHTML = '<strong>30-Day Forecast (every 3 days):</strong>' + rows;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
