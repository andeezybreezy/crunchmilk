(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var totalRise = parseFloat(document.getElementById('totalRise').value) || 0;
    var maxRiser = parseFloat(document.getElementById('maxRiser').value) || 0;
    var treadDepth = parseFloat(document.getElementById('treadDepth').value) || 0;

    // Calculation logic
    var risers=Math.ceil(totalRise/maxRiser); var riserHeight=totalRise/risers; var treads=risers-1; var totalRun=treads*treadDepth; var angle=Math.atan(totalRise/(totalRun))*180/Math.PI; var sumCheck=riserHeight+treadDepth; var codeOk=riserHeight<=7.75&&treadDepth>=10&&sumCheck>=17&&sumCheck<=18.5;     document.getElementById('risers').textContent = risers+' risers, '+(risers-1)+' treads';
    document.getElementById('riserHeight').textContent = fmt(riserHeight,2)+' inches';
    document.getElementById('totalRun').textContent = fmt(totalRun,1)+' inches ('+fmt(totalRun/12,1)+' ft)';
    document.getElementById('angle').textContent = fmt(angle,1)+'°';
    document.getElementById('codeCheck').textContent = codeOk?'Passes IRC code':'Check local code — may need adjustment';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['totalRise', 'maxRiser', 'treadDepth'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
