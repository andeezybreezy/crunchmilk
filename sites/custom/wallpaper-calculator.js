(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var length = parseFloat(document.getElementById('length').value) || 0;
    var width = parseFloat(document.getElementById('width').value) || 0;
    var height = parseFloat(document.getElementById('height').value) || 0;
    var doors = parseFloat(document.getElementById('doors').value) || 0;
    var windows = parseFloat(document.getElementById('windows').value) || 0;

    // Calculation logic
    var perimeter=2*(length+width); var wallArea=perimeter*height; var subtract=(doors*21)+(windows*15); var coverArea=wallArea-subtract; var singleRolls=Math.ceil(coverArea/28); var doubleRolls=Math.ceil(singleRolls/2);     document.getElementById('wallArea').textContent = fmt(coverArea,0)+' sq ft';
    document.getElementById('singleRolls').textContent = singleRolls+' rolls';
    document.getElementById('doubleRolls').textContent = doubleRolls+' double rolls';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'width', 'height', 'doors', 'windows'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
