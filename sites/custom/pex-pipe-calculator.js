(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var fixtures = parseFloat(document.getElementById('fixtures').value) || 0;
    var avgDistance = parseFloat(document.getElementById('avgDistance').value) || 0;
    var homeRun = document.getElementById('homeRun').value;

    // Calculation logic
    var totalPipe; var fittings; if(homeRun==='homerun'){totalPipe=fixtures*avgDistance; fittings=fixtures*2;}else{totalPipe=fixtures*avgDistance*0.6; fittings=fixtures*4;} totalPipe=totalPipe*1.1; var mainSize=fixtures>6?'1 inch':'3/4 inch'; var branchSize='1/2 inch'; return {totalPipe:fmt(totalPipe,0)+' ft', mainSize:mainSize, branchSize:branchSize, fittings:fittings+' fittings (approx)'};

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
