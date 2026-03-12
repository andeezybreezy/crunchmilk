(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var panelAmps = parseFloat(document.getElementById('panelAmps').value) || 0;
    var panelVoltage = parseFloat(document.getElementById('panelVoltage').value) || 0;
    var existingLoad = parseFloat(document.getElementById('existingLoad').value) || 0;
    var plannedLoad = parseFloat(document.getElementById('plannedLoad').value) || 0;

    // Calculation logic
    var totalKW = (panelAmps * panelVoltage) / 1000;
    var usePct = (existingLoad / panelAmps) * 100;
    var newTotal = existingLoad + plannedLoad;
    var newPct = (newTotal / panelAmps) * 100;
    var remaining = panelAmps - newTotal;
    document.getElementById('totalCapacity').textContent = fmt(panelAmps, 0) + ' A / ' + fmt(totalKW, 1) + ' kW';
    document.getElementById('currentUse').textContent = fmt(existingLoad, 0) + ' A (' + fmt(usePct, 1) + '%)';
    document.getElementById('afterAdding').textContent = fmt(newTotal, 0) + ' A (' + fmt(newPct, 1) + '%)' + (newPct > 80 ? ' — WARNING: Exceeds 80% rule' : '');
    document.getElementById('remaining').textContent = remaining > 0 ? fmt(remaining, 0) + ' A available' : 'OVER CAPACITY by ' + fmt(Math.abs(remaining), 0) + ' A — Panel upgrade needed';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['panelAmps', 'panelVoltage', 'existingLoad', 'plannedLoad'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
