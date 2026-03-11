(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var flourG = parseFloat(document.getElementById('flourG').value) || 0;
    var hydration = parseFloat(document.getElementById('hydration').value) || 0;
    var saltPct = parseFloat(document.getElementById('saltPct').value) || 0;
    var starterPct = parseFloat(document.getElementById('starterPct').value) || 0;

    // Calculation logic
    var water=flourG*(hydration/100); var salt=flourG*(saltPct/100); var starter=flourG*(starterPct/100); var totalDough=flourG+water+salt+starter; var loaves=totalDough/500; return {water:fmt(water,0)+' g', salt:fmt(salt,0)+' g', starter:fmt(starter,0)+' g', totalDough:fmt(totalDough,0)+' g', loaves:fmt(loaves,1)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['flourG', 'hydration', 'saltPct', 'starterPct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
