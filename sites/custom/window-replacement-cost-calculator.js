(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var windowCount = parseFloat(document.getElementById('windowCount').value) || 0;
    var windowType = document.getElementById('windowType').value;
    var frameType = document.getElementById('frameType').value;
    var installation = document.getElementById('installation').value;

    // Calculation logic
    var windowCosts = {'single':325,'double':550,'triple':850,'impact':1100};
    var frameMult = {'vinyl':1.0,'fiberglass':1.2,'wood':1.5,'aluminum':1.1};
    var laborPerWindow = installation === 'pro' ? 225 : 0;
    var materialCost = windowCosts[windowType] * frameMult[frameType];
    var perWindow = materialCost + laborPerWindow;
    var total = perWindow * windowCount;
    var energyPct = windowType === 'single' ? 0 : (windowType === 'double' ? 0.12 : (windowType === 'triple' ? 0.20 : 0.15));
    var annualEnergySavings = 2400 * energyPct;
    var payback = annualEnergySavings > 0 ? total / annualEnergySavings : 999;
    document.getElementById('perWindow').textContent = dollar(perWindow) + ' (' + dollar(materialCost) + ' materials + ' + dollar(laborPerWindow) + ' labor)';
    document.getElementById('totalCost').textContent = dollar(total) + ' for ' + fmt(windowCount, 0) + ' windows';
    document.getElementById('energySavings').textContent = annualEnergySavings > 0 ? dollar(annualEnergySavings) + '/year (est. ' + fmt(energyPct * 100, 0) + '% reduction)' : 'Minimal — single pane offers no improvement';
    document.getElementById('payback').textContent = payback < 50 ? fmt(payback, 1) + ' years' : 'N/A';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['windowCount', 'windowType', 'frameType', 'installation'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
