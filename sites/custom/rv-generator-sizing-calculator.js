(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var ac = document.getElementById('ac').value;
    var microwave = document.getElementById('microwave').value;
    var fridge = document.getElementById('fridge').value;
    var extras = parseFloat(document.getElementById('extras').value) || 0;

    // Calculation logic
    var acWatts = {'None': 0, '13,500 BTU': 1500, '15,000 BTU': 2000}; var acStart = {'None': 0, '13,500 BTU': 3000, '15,000 BTU': 3500}; var mwWatts = microwave === 'Yes (1000W)' ? 1000 : 0; var fridgeWatts = fridge === 'Yes' ? 150 : 0; var fridgeStart = fridge === 'Yes' ? 600 : 0; var running = (acWatts[ac]||0) + mwWatts + fridgeWatts + extras; var starting = (acStart[ac]||0) + mwWatts + fridgeStart + extras; var recommended = Math.ceil(starting / 500) * 500; return {runningWatts: fmt(running,0), startingWatts: fmt(starting,0), recommended: fmt(recommended,0)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['ac', 'microwave', 'fridge', 'extras'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
