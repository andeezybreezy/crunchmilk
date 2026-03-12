(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var cubicFeet = parseFloat(document.getElementById('cubicFeet').value) || 0;
    var mixRatio = document.getElementById('mixRatio').value;

    // Calculation logic
    var ratios = {'1:2:3 (standard)': [1,2,3], '1:1.5:3 (strong)': [1,1.5,3], '1:3:6 (lean)': [1,3,6]}; var r = ratios[mixRatio] || [1,2,3]; var total = r[0]+r[1]+r[2]; var cementCuFt = cubicFeet * r[0] / total * 1.54; var cement = Math.ceil(cementCuFt / 1); var sand = cubicFeet * r[1] / total * 1.54; var gravel = cubicFeet * r[2] / total * 1.54;     document.getElementById('cement').textContent = fmt(cement,0);
    document.getElementById('sand').textContent = fmt(sand,0);
    document.getElementById('gravel').textContent = fmt(gravel,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['cubicFeet', 'mixRatio'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
