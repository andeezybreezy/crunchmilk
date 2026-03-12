(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var tier = document.getElementById('tier').value;
    var computer = parseFloat(document.getElementById('computer').value) || 0;
    var hasInterface = document.getElementById('hasInterface').value;
    var hasMic = document.getElementById('hasMic').value;
    var roomTreatment = document.getElementById('roomTreatment').value;
    var daw = document.getElementById('daw').value;

    // Calculation logic
    var interfaces = {bedroom: 100, prosumer: 350, pro: 1200};
    var mics = {bedroom: 100, prosumer: 500, pro: 2000};
    var monitors = {bedroom: 150, prosumer: 500, pro: 1500};
    var treatments = {none: 0, basic: 200, full: 1500};
    var daws = {free: 0, mid: 200, pro: 550};
    var pluginCost = {bedroom: 0, prosumer: 200, pro: 800};
    var intCost = hasInterface === 'yes' ? 0 : interfaces[tier];
    var mCost = hasMic === 'yes' ? 0 : mics[tier];
    var monCost = monitors[tier];
    var treatCost = treatments[roomTreatment];
    var softCost = daws[daw] + pluginCost[tier];
    var total = computer + intCost + mCost + monCost + treatCost + softCost;
    document.getElementById('interfaceCost').textContent = intCost > 0 ? '$' + intCost.toFixed(0) : 'Already owned';
    document.getElementById('micCost').textContent = mCost > 0 ? '$' + mCost.toFixed(0) : 'Already owned';
    document.getElementById('monitorCost').textContent = '$' + monCost.toFixed(0);
    document.getElementById('treatmentCost').textContent = treatCost > 0 ? '$' + treatCost.toFixed(0) : '$0';
    document.getElementById('softwareCost').textContent = '$' + softCost.toFixed(0);
    document.getElementById('totalCost').textContent = '$' + total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['tier', 'computer', 'hasInterface', 'hasMic', 'roomTreatment', 'daw'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
