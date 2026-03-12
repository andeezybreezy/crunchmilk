(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var length = parseFloat(document.getElementById('length').value) || 0;
    var pipeDia = document.getElementById('pipeDia').value;

    // Calculation logic
    var dia=parseFloat(pipeDia); var slopePerFt=dia<=2?0.25:0.125; var totalDrop=slopePerFt*length; var grade=(slopePerFt/12)*100;     document.getElementById('slopePerFt').textContent = slopePerFt+' inches per foot';
    document.getElementById('totalDrop').textContent = fmt(totalDrop,2)+' inches ('+fmt(totalDrop/12,2)+' ft)';
    document.getElementById('dropInches').textContent = fmt(totalDrop,1)+' inches';
    document.getElementById('grade').textContent = fmt(grade,2)+'%';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'pipeDia'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
