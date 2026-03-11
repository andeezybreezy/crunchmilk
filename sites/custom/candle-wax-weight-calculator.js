(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var containerOz = parseFloat(document.getElementById('containerOz').value) || 0;
    var containers = parseFloat(document.getElementById('containers').value) || 0;
    var fragPct = parseFloat(document.getElementById('fragPct').value) || 0;

    // Calculation logic
    var waxOzPer = containerOz * 0.86; var totalWaxOz = waxOzPer * containers; var waxLbs = totalWaxOz / 16; var fragOz = (totalWaxOz * fragPct / 100); var wicks = containers; return {waxLbs: fmt(waxLbs,1), fragOz: fmt(fragOz,1), wicks: fmt(wicks,0)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['containerOz', 'containers', 'fragPct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
