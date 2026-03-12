(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var samples = parseFloat(document.getElementById('samples').value) || 0;
    var taskType = document.getElementById('taskType').value;
    var method = document.getElementById('method').value;

    // Calculation logic
    var rates = {'Text Classification': {'In-house Team': 0.10, 'Crowdsource (MTurk)': 0.03, 'Managed Service': 0.08, 'AI-Assisted + Review': 0.02}, 'Image Bounding Box': {'In-house Team': 0.25, 'Crowdsource (MTurk)': 0.08, 'Managed Service': 0.15, 'AI-Assisted + Review': 0.05}, 'Image Segmentation': {'In-house Team': 0.80, 'Crowdsource (MTurk)': 0.25, 'Managed Service': 0.50, 'AI-Assisted + Review': 0.12}, 'Named Entity Recognition': {'In-house Team': 0.15, 'Crowdsource (MTurk)': 0.05, 'Managed Service': 0.10, 'AI-Assisted + Review': 0.03}, 'Audio Transcription': {'In-house Team': 0.50, 'Crowdsource (MTurk)': 0.15, 'Managed Service': 0.30, 'AI-Assisted + Review': 0.08}}; var cps = rates[taskType][method] || 0.10; var totalCost = cps * samples; var samplesPerWeek = method === 'In-house Team' ? 2000 : method === 'Crowdsource (MTurk)' ? 10000 : method === 'Managed Service' ? 5000 : 15000; var timeEstimate = Math.ceil(samples / samplesPerWeek);     document.getElementById('costPerSample').textContent = dollar(cps);
    document.getElementById('totalCost').textContent = dollar(totalCost);
    document.getElementById('timeEstimate').textContent = fmt(timeEstimate, 0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['samples', 'taskType', 'method'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
