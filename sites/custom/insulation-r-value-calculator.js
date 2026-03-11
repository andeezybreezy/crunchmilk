(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var zone = document.getElementById('zone').value;
    var area = document.getElementById('area').value;

    // Calculation logic
    var recs = {'1':{attic:30,wall:13,floor:13,basement:11},'2':{attic:38,wall:13,floor:13,basement:11},'3':{attic:38,wall:13,floor:19,basement:11},'4':{attic:49,wall:13,floor:25,basement:11},'5':{attic:49,wall:20,floor:25,basement:15},'6':{attic:60,wall:20,floor:30,basement:15},'7':{attic:60,wall:21,floor:30,basement:15}}; var z = recs[zone] || recs['4']; var R = z[area] || 30; var fg = R / 3.2; var cel = R / 3.7; var foam = R / 6.5; document.getElementById('rValue').textContent = 'R-' + R; document.getElementById('fgDepth').textContent = fmt(fg, 1) + ' inches'; document.getElementById('cellDepth').textContent = fmt(cel, 1) + ' inches'; document.getElementById('foamDepth').textContent = fmt(foam, 1) + ' inches';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['zone', 'area'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
