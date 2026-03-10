(function() {
  'use strict';

  var weightUnit = 'lbs';
  var toggleBtns = document.querySelectorAll('.unit-toggle button');
  toggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      toggleBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      weightUnit = btn.dataset.unit;
    });
  });

  // Thawing rates: fridgeHoursPerLb, coldWaterMinPerLb, microwaveMinPerLb
  var foods = {
    turkey:       { name: 'Whole Turkey',       fridge: 4.8, water: 30, micro: 6 },
    chickenWhole: { name: 'Whole Chicken',       fridge: 6,   water: 30, micro: 7 },
    chickenParts: { name: 'Chicken Parts',       fridge: 8,   water: 30, micro: 5 },
    beefRoast:    { name: 'Beef Roast',          fridge: 5,   water: 30, micro: 7 },
    beefSteaks:   { name: 'Beef Steaks',         fridge: 12,  water: 30, micro: 5 },
    porkRoast:    { name: 'Pork Roast',          fridge: 5,   water: 30, micro: 7 },
    porkChops:    { name: 'Pork Chops',          fridge: 12,  water: 30, micro: 5 },
    fish:         { name: 'Fish Fillets',        fridge: 12,  water: 30, micro: 4 },
    shrimp:       { name: 'Shrimp',              fridge: 12,  water: 20, micro: 3 },
    groundMeat:   { name: 'Ground Meat',         fridge: 12,  water: 30, micro: 5 }
  };

  function fmtTime(minutes) {
    if (minutes < 60) return Math.round(minutes) + ' min';
    var hours = minutes / 60;
    if (hours < 24) return hours.toFixed(1).replace(/\.0$/, '') + ' hours';
    var days = hours / 24;
    if (days === Math.floor(days)) return days + ' day' + (days > 1 ? 's' : '');
    return days.toFixed(1) + ' days';
  }

  function fmtStartDate(cookDate, minutesBefore) {
    if (!cookDate) return '';
    var start = new Date(cookDate.getTime() - minutesBefore * 60000);
    var opts = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
    return start.toLocaleDateString('en-US', opts);
  }

  function calculate() {
    var foodType = document.getElementById('foodType').value;
    var weight = parseFloat(document.getElementById('weight').value);
    var cookDateStr = document.getElementById('cookDate').value;
    if (isNaN(weight) || weight <= 0) return;

    var lbs = weightUnit === 'kg' ? weight * 2.205 : weight;
    var food = foods[foodType];

    var fridgeMin = food.fridge * lbs * 60;
    var waterMin = food.water * lbs;
    var microMin = food.micro * lbs;

    var cookDate = cookDateStr ? new Date(cookDateStr) : null;

    var methods = [
      {
        name: 'Refrigerator (Recommended)',
        time: fridgeMin,
        icon: '&#x1f9ca;',
        note: 'Safest method. Place on lowest shelf on a tray. Thawed meat keeps 1-2 days in fridge.'
      },
      {
        name: 'Cold Water Bath',
        time: waterMin,
        icon: '&#x1f4a7;',
        note: 'Submerge in sealed bag. Change water every 30 minutes. Cook immediately after.'
      },
      {
        name: 'Microwave (Defrost Setting)',
        time: microMin,
        icon: '&#x26a1;',
        note: 'Use defrost/low power. Cook immediately — edges may start cooking.'
      }
    ];

    var html = '';
    methods.forEach(function(m) {
      var startStr = cookDate ? '<div style="margin-top:4px;font-size:0.85rem;color:#0369a1;"><strong>Start by:</strong> ' + fmtStartDate(cookDate, m.time) + '</div>' : '';
      html += '<div style="padding:12px;border-bottom:1px solid #e5e7eb;">' +
        '<div style="display:flex;justify-content:space-between;align-items:baseline;">' +
        '<span style="font-weight:600;">' + m.name + '</span>' +
        '<span style="font-weight:700;font-size:1.1rem;">' + fmtTime(m.time) + '</span>' +
        '</div>' +
        startStr +
        '<div style="font-size:0.85rem;color:#666;margin-top:4px;">' + m.note + '</div>' +
        '</div>';
    });

    // Weight display
    html += '<div style="padding:8px;background:#f3f4f6;border-radius:8px;margin-top:8px;font-size:0.9rem;">' +
      '<strong>' + food.name + ':</strong> ' + lbs.toFixed(1) + ' lbs (' + (lbs / 2.205).toFixed(1) + ' kg)' +
      '</div>';

    document.getElementById('thawOutput').innerHTML = html;

    var tip = lbs > 15
      ? 'For large items, refrigerator thawing is strongly recommended. Plan ahead — start several days before cooking.'
      : 'For food safety, never thaw at room temperature. Keep meat below 40°F (4°C) during thawing.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Set default cook date to tomorrow noon
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(12, 0, 0, 0);
  var dd = tomorrow.toISOString().slice(0, 16);
  document.getElementById('cookDate').value = dd;

  document.getElementById('convertBtn').addEventListener('click', calculate);
  document.getElementById('weight').addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });

})();
