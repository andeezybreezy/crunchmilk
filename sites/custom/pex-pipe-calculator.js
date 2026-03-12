(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var fixtures = parseFloat(document.getElementById('fixtures').value) || 0;
    var avgDistance = parseFloat(document.getElementById('avgDistance').value) || 0;
    var homeRun = document.getElementById('homeRun').value;

    // Calculation logic
    var totalPipe; var fittings; if(homeRun==='homerun'){totalPipe=fixtures*avgDistance; fittings=fixtures*2;}else{totalPipe=fixtures*avgDistance*0.6; fittings=fixtures*4;} totalPipe=totalPipe*1.1; var mainSize=fixtures>6?'1 inch':'3/4 inch'; var branchSize='1/2 inch';     document.getElementById('totalPipe').textContent = fmt(totalPipe,0)+' ft';
    document.getElementById('mainSize').textContent = mainSize;
    document.getElementById('branchSize').textContent = branchSize;
    document.getElementById('fittings').textContent = fittings+' fittings (approx)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['fixtures', 'avgDistance', 'homeRun'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
