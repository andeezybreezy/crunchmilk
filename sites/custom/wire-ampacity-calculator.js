(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var gauge = document.getElementById('gauge').value;
    var wireType = document.getElementById('wireType').value;
    var ambientTemp = document.getElementById('ambientTemp').value;

    // Calculation logic
    var amps = {'14 AWG': 15, '12 AWG': 20, '10 AWG': 30, '8 AWG': 40, '6 AWG': 55, '4 AWG': 70, '2 AWG': 95, '1/0 AWG': 125}; var ampacity = amps[gauge] || 20; var tempDerate = {'Normal (<86°F)': 1, 'Warm (86-104°F)': 0.88, 'Hot (>104°F)': 0.75}; ampacity = Math.floor(ampacity * (tempDerate[ambientTemp] || 1)); var breakerSize = amps[gauge] || 20; var uses = {'14 AWG': 'Lighting, general outlets', '12 AWG': 'Kitchen, bathroom outlets', '10 AWG': 'Dryer, water heater', '8 AWG': 'Range, large AC', '6 AWG': 'Subpanel feeder', '4 AWG': 'Large subpanel', '2 AWG': 'Main feeder', '1/0 AWG': '100A service'}; var typicalUse = uses[gauge] || '';     document.getElementById('ampacity').textContent = fmt(ampacity,0);
    document.getElementById('breakerSize').textContent = fmt(breakerSize,0);
    document.getElementById('typicalUse').textContent = typicalUse;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['gauge', 'wireType', 'ambientTemp'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
