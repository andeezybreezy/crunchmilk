(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sphere = parseFloat(document.getElementById('sphere').value) || 0;
    var cylinder = parseFloat(document.getElementById('cylinder').value) || 0;
    var vertexDistance = parseFloat(document.getElementById('vertexDistance').value) || 0;

    // Calculation logic
    var vd = vertexDistance / 1000; var contactSphere = sphere / (1 - vd * sphere); contactSphere = Math.round(contactSphere * 4) / 4; var contactCyl = cylinder; var note = Math.abs(sphere) > 4 ? 'Significant conversion difference - verify with eye doctor' : 'Minor conversion - verify with eye doctor';     document.getElementById('contactSphere').textContent = fmt(contactSphere,2);
    document.getElementById('contactCyl').textContent = fmt(contactCyl,2);
    document.getElementById('note').textContent = note;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sphere', 'cylinder', 'vertexDistance'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
