(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var power = parseFloat(document.getElementById('power').value) || 0;
    var frequency = document.getElementById('frequency').value;
    var terrain = document.getElementById('terrain').value;
    var antennaHeight = parseFloat(document.getElementById('antennaHeight').value) || 0;

    // Calculation logic
    var terrainFactor = {open:1.0,suburban:0.5,forest:0.35,urban:0.25,mountain:0.3}; var tf = terrainFactor[terrain] || 0.5; var baseRange; if (frequency === 'hf') { baseRange = 50; } else if (frequency === 'vhf') { baseRange = 15 * Math.sqrt(power/5); } else if (frequency === 'frs') { baseRange = 2; } else { baseRange = 10 * Math.sqrt(power/5); } var los = 1.23 * Math.sqrt(antennaHeight); var theoretical = baseRange; var practical = baseRange * tf; var rec = frequency === 'hf' ? 'Long-range emergency (skip propagation)' : frequency === 'vhf' ? 'Rural/wilderness, search & rescue' : frequency === 'frs' ? 'Short-range family comms only' : 'General purpose, suburban/urban'; document.getElementById('theoreticalRange').textContent = fmt(theoretical, 1) + ' miles'; document.getElementById('practicalRange').textContent = fmt(practical, 1) + ' miles'; document.getElementById('losRange').textContent = fmt(los, 1) + ' miles'; document.getElementById('recommendation').textContent = rec;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['power', 'frequency', 'terrain', 'antennaHeight'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
