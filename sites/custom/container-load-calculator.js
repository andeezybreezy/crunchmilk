(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var boxL = parseFloat(document.getElementById('boxL').value) || 0;
    var boxW = parseFloat(document.getElementById('boxW').value) || 0;
    var boxH = parseFloat(document.getElementById('boxH').value) || 0;
    var boxWt = parseFloat(document.getElementById('boxWt').value) || 0;
    var container = document.getElementById('container').value;

    // Calculation logic
    var dims = {'20':{l:234,w:93,h:93,wt:47900},'40':{l:474,w:93,h:93,wt:58600},'40hc':{l:474,w:93,h:102,wt:58600}}; var c = dims[container] || dims['40']; var a1 = Math.floor(c.l/boxL)*Math.floor(c.w/boxW)*Math.floor(c.h/boxH); var a2 = Math.floor(c.l/boxW)*Math.floor(c.w/boxL)*Math.floor(c.h/boxH); var byVol = Math.max(a1, a2); var byWt = Math.floor(c.wt / boxWt); var actual = Math.min(byVol, byWt); var usedVol = actual*boxL*boxW*boxH; var contVol = c.l*c.w*c.h; document.getElementById('maxByVol').textContent = fmt(byVol,0)+' boxes'; document.getElementById('maxByWt').textContent = fmt(byWt,0)+' boxes'; document.getElementById('actual').textContent = fmt(Math.floor(actual*0.85),0)+' boxes'; document.getElementById('fillPct').textContent = pct(usedVol/contVol*100);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['boxL', 'boxW', 'boxH', 'boxWt', 'container'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
