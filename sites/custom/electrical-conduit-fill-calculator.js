(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var conduitSize = document.getElementById('conduitSize').value;
    var wireGauge = document.getElementById('wireGauge').value;
    var wireCount = parseFloat(document.getElementById('wireCount').value) || 0;

    // Calculation logic
    var conduitAreas = {'0.5':0.122,'0.75':0.213,'1':0.346,'1.25':0.598,'1.5':0.814,'2':1.316};
    var wireAreas = {'14':0.0097,'12':0.0133,'10':0.0211,'8':0.0366,'6':0.0507};
    var cArea = conduitAreas[conduitSize];
    var wArea = wireAreas[wireGauge];
    var fillLimit = wireCount <= 1 ? 0.53 : (wireCount === 2 ? 0.31 : 0.40);
    var totalWireArea = wireCount * wArea;
    var fillRatio = totalWireArea / cArea;
    var maxW = Math.floor((cArea * 0.40) / wArea);
    document.getElementById('fillPct').textContent = pct(fillRatio * 100, 1);
    document.getElementById('maxWires').textContent = maxW + ' wires (at 40% fill)';
    document.getElementById('status').textContent = fillRatio <= fillLimit ? 'PASS — Within NEC limits' : 'FAIL — Exceeds NEC ' + fmt(fillLimit * 100, 0) + '% fill limit';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['conduitSize', 'wireGauge', 'wireCount'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
