(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var annualKwh = parseFloat(document.getElementById('annualKwh').value) || 0;
    var solarPct = parseFloat(document.getElementById('solarPct').value) || 0;
    var windPct = parseFloat(document.getElementById('windPct').value) || 0;
    var hydroPct = parseFloat(document.getElementById('hydroPct').value) || 0;

    // Calculation logic
    var total = solarPct + windPct + hydroPct; var solarKwh = annualKwh * (solarPct / Math.max(total,1)); var windKwh = annualKwh * (windPct / Math.max(total,1)); var hydroKwh = annualKwh * (hydroPct / Math.max(total,1)); var co2Saved = annualKwh * 0.000907;     document.getElementById('solarKwh').textContent = fmt(solarKwh,0);
    document.getElementById('windKwh').textContent = fmt(windKwh,0);
    document.getElementById('hydroKwh').textContent = fmt(hydroKwh,0);
    document.getElementById('co2Saved').textContent = fmt(co2Saved,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['annualKwh', 'solarPct', 'windPct', 'hydroPct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
