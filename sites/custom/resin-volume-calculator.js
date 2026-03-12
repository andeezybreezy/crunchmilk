(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var partVolume = parseFloat(document.getElementById('partVolume').value) || 0;
    var supportPct = parseFloat(document.getElementById('supportPct').value) || 0;
    var bottlePrice = parseFloat(document.getElementById('bottlePrice').value) || 0;
    var bottleVolume = parseFloat(document.getElementById('bottleVolume').value) || 0;

    // Calculation logic
    var totalML = partVolume * (1 + supportPct / 100);
    var costPerML = bottlePrice / bottleVolume;
    var cost = totalML * costPerML;
    var ppb = Math.floor(bottleVolume / totalML);
    document.getElementById('totalResin').textContent = fmt(totalML, 1) + ' mL';
    document.getElementById('resinCost').textContent = dollar(cost);
    document.getElementById('partsPerBottle').textContent = fmt(ppb, 0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['partVolume', 'supportPct', 'bottlePrice', 'bottleVolume'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
