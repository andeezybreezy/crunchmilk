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
    var coats = parseFloat(document.getElementById('coats').value) || 0;

    // Calculation logic
    var wallArea=2*(length+width)*height; var doorArea=doors*21; var windowArea=windows*15; var paintableArea=wallArea-doorArea-windowArea; var gallonsPerCoat=paintableArea/350; var gallons=Math.ceil(gallonsPerCoat*coats*10)/10; var cost=Math.ceil(gallons)*35;     document.getElementById('wallArea').textContent = fmt(wallArea,0)+' sq ft';
    document.getElementById('paintableArea').textContent = fmt(paintableArea,0)+' sq ft';
    document.getElementById('gallons').textContent = fmt(gallons,1)+' gallons';
    document.getElementById('cost').textContent = dollar(cost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'width', 'height', 'doors', 'windows', 'coats'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
