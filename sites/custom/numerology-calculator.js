(function() {
  'use strict';

  var MEANINGS = {
    1: 'The Leader — Independent, ambitious, and pioneering. You forge your own path and inspire others through action.',
    2: 'The Diplomat — Cooperative, sensitive, and balanced. You excel at partnerships and bringing harmony to groups.',
    3: 'The Communicator — Creative, expressive, and joyful. You have natural talent in writing, speaking, and the arts.',
    4: 'The Builder — Stable, disciplined, and hardworking. You create lasting foundations and systems that endure.',
    5: 'The Adventurer — Freedom-loving, versatile, and dynamic. You thrive on change and new experiences.',
    6: 'The Nurturer — Responsible, loving, and harmonious. You are drawn to caring for others and creating beauty.',
    7: 'The Seeker — Analytical, wise, and spiritual. You are drawn to deep research, philosophy, and inner truth.',
    8: 'The Powerhouse — Authoritative, ambitious, and materially skilled. You have a gift for business and achievement.',
    9: 'The Humanitarian — Compassionate, generous, and idealistic. You are here to serve the greater good.',
    11: 'Master Intuitive — A heightened version of 2 with visionary insight, spiritual awareness, and inspirational power.',
    22: 'Master Builder — A heightened version of 4 with the ability to turn grand visions into practical reality.',
    33: 'Master Teacher — A heightened version of 6 with extraordinary healing, compassion, and selfless service.'
  };

  function reduceToDigit(num) {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      var sum = 0;
      var s = String(num);
      for (var i = 0; i < s.length; i++) {
        sum += parseInt(s[i]);
      }
      num = sum;
    }
    return num;
  }

  function lifePathNumber(dateStr) {
    var parts = dateStr.split('-');
    var month = parseInt(parts[1]);
    var day = parseInt(parts[2]);
    var year = parseInt(parts[0]);

    var m = reduceToDigit(month);
    var d = reduceToDigit(day);

    // Reduce year digits
    var ySum = 0;
    var ys = String(year);
    for (var i = 0; i < ys.length; i++) {
      ySum += parseInt(ys[i]);
    }
    var y = reduceToDigit(ySum);

    return reduceToDigit(m + d + y);
  }

  function letterValue(ch) {
    return ch.toLowerCase().charCodeAt(0) - 96;
  }

  function nameToNumber(name) {
    var sum = 0;
    for (var i = 0; i < name.length; i++) {
      var ch = name[i].toLowerCase();
      if (ch >= 'a' && ch <= 'z') {
        sum += letterValue(ch);
      }
    }
    return reduceToDigit(sum);
  }

  function soulUrgeNumber(name) {
    var vowels = 'aeiou';
    var sum = 0;
    for (var i = 0; i < name.length; i++) {
      var ch = name[i].toLowerCase();
      if (vowels.indexOf(ch) !== -1) {
        sum += letterValue(ch);
      }
    }
    return reduceToDigit(sum);
  }

  function calculate() {
    var name = document.getElementById('fullName').value.trim();
    var bd = document.getElementById('birthdate').value;
    if (!name || !bd) return;

    var lp = lifePathNumber(bd);
    var expr = nameToNumber(name);
    var su = soulUrgeNumber(name);

    document.getElementById('lifePath').textContent = lp;
    document.getElementById('expression').textContent = expr;
    document.getElementById('soulUrge').textContent = su;

    var meaningsDiv = document.getElementById('meanings');
    var html = '<div style="text-align:left;">';
    html += '<p><strong>Life Path ' + lp + ':</strong> ' + (MEANINGS[lp] || 'Unique energy.') + '</p>';
    html += '<p><strong>Expression ' + expr + ':</strong> ' + (MEANINGS[expr] || 'Unique energy.') + '</p>';
    html += '<p><strong>Soul Urge ' + su + ':</strong> ' + (MEANINGS[su] || 'Unique energy.') + '</p>';
    html += '</div>';
    meaningsDiv.innerHTML = html;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
  document.getElementById('fullName').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculate();
  });
})();
