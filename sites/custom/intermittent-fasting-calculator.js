(function() {
  'use strict';

  var protocols = {
    '16:8': { fast: 16, eat: 8, meals: 3 },
    '18:6': { fast: 18, eat: 6, meals: 2 },
    '20:4': { fast: 20, eat: 4, meals: 2 },
    'omad': { fast: 23, eat: 1, meals: 1 },
    '5:2':  { fast: 0, eat: 0, meals: 3 }
  };

  function fmtTime12(hours, minutes) {
    var h = ((hours % 24) + 24) % 24;
    var m = minutes || 0;
    var ampm = h >= 12 ? 'PM' : 'AM';
    var h12 = h % 12 || 12;
    return h12 + ':' + String(m).padStart(2, '0') + ' ' + ampm;
  }

  function addHours(baseH, baseM, addH) {
    var totalM = baseH * 60 + baseM + addH * 60;
    var h = Math.floor(totalM / 60) % 24;
    var m = totalM % 60;
    return { h: h, m: m };
  }

  document.getElementById('protocol').addEventListener('change', function() {
    var is52 = this.value === '5:2';
    document.getElementById('timeInputs').style.display = is52 ? 'none' : '';
  });

  document.getElementById('calcBtn').addEventListener('click', function() {
    var proto = document.getElementById('protocol').value;
    var p = protocols[proto];
    var goalType = document.getElementById('goal').value;
    var tdee = parseFloat(document.getElementById('tdee').value) || 0;

    var calTarget;
    if (tdee > 0) {
      calTarget = goalType === 'loss' ? Math.round(tdee - 500) : tdee;
    }

    // 5:2 special case
    if (proto === '5:2') {
      document.getElementById('eatWindow').textContent = '5 normal days';
      document.getElementById('fastWindow').textContent = '2 low-cal days (500-600 cal)';
      document.getElementById('calTarget').textContent = calTarget ? calTarget.toLocaleString() + ' cal (normal days)' : 'Enter TDEE for target';
      document.getElementById('mealTimes').innerHTML = '';
      var html52 = '<div style="font-size:0.9rem;line-height:1.8">';
      html52 += '<strong>5:2 Schedule:</strong><br>';
      html52 += '\u2022 <strong>Normal days:</strong> Eat ' + (calTarget || 'your TDEE') + ' calories<br>';
      html52 += '\u2022 <strong>Fast days:</strong> Eat only 500-600 calories<br>';
      html52 += '\u2022 Space fast days apart (e.g., Tuesday & Thursday)<br>';
      html52 += '\u2022 On fast days, eat 2 small meals of 250-300 cal each';
      html52 += '</div>';
      document.getElementById('fiveTwo').innerHTML = html52;
      document.getElementById('fiveTwo').style.display = '';
      document.getElementById('result').style.display = '';
      return;
    }

    document.getElementById('fiveTwo').style.display = 'none';

    var timeParts = document.getElementById('startTime').value.split(':');
    var startH = parseInt(timeParts[0], 10);
    var startM = parseInt(timeParts[1], 10);

    var endTime = addHours(startH, startM, p.eat);
    var fastEnd = fmtTime12(startH, startM);
    var eatEnd = fmtTime12(endTime.h, endTime.m);

    document.getElementById('eatWindow').textContent = fastEnd + ' – ' + eatEnd;
    document.getElementById('fastWindow').textContent = eatEnd + ' – ' + fastEnd + ' (' + p.fast + ' hrs)';
    document.getElementById('calTarget').textContent = calTarget ? calTarget.toLocaleString() + ' cal/day' : 'Enter TDEE for target';

    // Generate meal times
    var html = '<div style="font-size:0.9rem;line-height:1.8"><strong>Suggested Meal Times:</strong><br>';
    if (p.meals === 1) {
      html += '\u2022 Main meal: ' + fastEnd;
    } else {
      var spacing = p.eat / p.meals;
      for (var i = 0; i < p.meals; i++) {
        var mealTime = addHours(startH, startM, spacing * i + spacing * 0.5);
        var label = i === 0 ? 'Meal 1' : (i === p.meals - 1 ? 'Last meal' : 'Meal ' + (i + 1));
        html += '\u2022 ' + label + ': ' + fmtTime12(mealTime.h, mealTime.m);
        if (calTarget) {
          html += ' (~' + Math.round(calTarget / p.meals) + ' cal)';
        }
        html += '<br>';
      }
    }
    html += '</div>';
    document.getElementById('mealTimes').innerHTML = html;
    document.getElementById('result').style.display = '';
  });
})();
