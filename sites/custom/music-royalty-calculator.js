(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var streams = parseFloat(document.getElementById('streams').value) || 0;
    var platform = document.getElementById('platform').value;
    var splitPct = parseFloat(document.getElementById('splitPct').value) || 0;

    // Calculation logic
    var rates={spotify:0.004,apple:0.008,youtube:0.002,tidal:0.013,amazon:0.004}; var rate=rates[platform]; var monthlyGross=streams*rate; var monthlyNet=monthlyGross*(splitPct/100); var annualNet=monthlyNet*12; var streamsFor1k=Math.ceil(1000/(rate*splitPct/100));     document.getElementById('monthlyGross').textContent = dollar(monthlyGross);
    document.getElementById('monthlyNet').textContent = dollar(monthlyNet);
    document.getElementById('annualNet').textContent = dollar(annualNet);
    document.getElementById('streamsFor1k').textContent = fmt(streamsFor1k,0)+' streams';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['streams', 'platform', 'splitPct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
