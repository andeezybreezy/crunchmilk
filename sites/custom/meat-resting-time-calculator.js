(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var meatType = document.getElementById('meatType').value;
    var weight = parseFloat(document.getElementById('weight').value) || 0;
    var cookMethod = document.getElementById('cookMethod').value;

    // Calculation logic
    var baseMin = {steak:5,roast:15,chicken:10,turkey:20,pork:5,porkRoast:15,lamb:5}; var base = baseMin[meatType] || 5; var restTime = base + Math.round(weight * 2); if (meatType === 'turkey') restTime = Math.max(20, 15 + Math.round(weight * 1.5)); if (meatType === 'roast' || meatType === 'porkRoast') restTime = Math.max(15, 10 + Math.round(weight * 3)); var carryover = 0; if (meatType === 'steak' || meatType === 'lamb') carryover = cookMethod === 'pan' ? 8 : 5; else if (meatType === 'roast') carryover = 10; else if (meatType === 'turkey') carryover = 15; else if (meatType === 'porkRoast') carryover = 10; else carryover = 5; var tipText = meatType === 'steak' ? 'Tent loosely with foil — tight wrapping steams the crust' : meatType === 'turkey' ? 'Tent with foil on a cutting board. Do not skip resting a turkey.' : 'Rest on a cutting board or warm plate, tented loosely with foil'; document.getElementById('restTime').textContent = restTime + ' min'; document.getElementById('carryover').textContent = carryover + ' F'; document.getElementById('pullTemp').textContent = carryover + ' F below target'; document.getElementById('tip').textContent = tipText;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['meatType', 'weight', 'cookMethod'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
