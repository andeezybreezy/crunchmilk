(function() {
  'use strict';

  var unit = 'lbs';

  var goals = {
    sedentary: { low: 0.36, high: 0.36, label: 'Sedentary (RDA minimum)' },
    fitness:   { low: 0.50, high: 0.70, label: 'General Fitness' },
    muscle:    { low: 0.70, high: 1.00, label: 'Muscle Gain' },
    cutting:   { low: 1.00, high: 1.20, label: 'Cutting' },
    athlete:   { low: 0.80, high: 1.00, label: 'Competitive Athlete' }
  };

  document.querySelectorAll('[data-unit]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-unit]').forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      unit = btn.dataset.unit;
    });
  });

  document.getElementById('calcBtn').addEventListener('click', function() {
    var weight = parseFloat(document.getElementById('bodyWeight').value);
    if (!weight) { alert('Please enter your body weight.'); return; }

    var weightLbs = unit === 'lbs' ? weight : weight * 2.20462;
    var g = goals[document.getElementById('goal').value];
    var meals = parseInt(document.getElementById('meals').value, 10);

    var lowG = Math.round(weightLbs * g.low);
    var highG = Math.round(weightLbs * g.high);
    var midG = Math.round((lowG + highG) / 2);

    var perMeal = Math.round(midG / meals);

    document.getElementById('dailyProtein').textContent = midG + 'g';
    document.getElementById('perMeal').textContent = perMeal + 'g × ' + meals + ' meals';
    document.getElementById('rangeVal').textContent = lowG + 'g – ' + highG + 'g per day';

    // Food equivalents based on midG
    var chicken = (midG / 31).toFixed(1);    // 31g per 4oz
    var eggs = Math.round(midG / 6);          // 6g per egg
    var greek = (midG / 17).toFixed(1);       // 17g per cup
    var whey = (midG / 25).toFixed(1);        // 25g per scoop

    var html = '<div style="font-size:0.9rem;line-height:1.8">';
    html += '<strong>Food equivalents (' + midG + 'g protein):</strong><br>';
    html += '\u2022 ' + chicken + ' servings of chicken breast (4 oz each)<br>';
    html += '\u2022 ' + eggs + ' large eggs<br>';
    html += '\u2022 ' + greek + ' cups of Greek yogurt<br>';
    html += '\u2022 ' + whey + ' scoops of whey protein';
    html += '</div>';
    document.getElementById('foodEquiv').innerHTML = html;

    document.getElementById('result').style.display = '';
  });
})();
