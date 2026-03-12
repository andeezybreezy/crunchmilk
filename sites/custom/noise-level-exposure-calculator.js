(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var decibels = parseFloat(document.getElementById('decibels').value) || 0;

    // Calculation logic
    var oshaHours = 8 / Math.pow(2, (decibels - 90) / 5); var nioshHours = 8 / Math.pow(2, (decibels - 85) / 3); var safeTime = oshaHours >= 8 ? fmt(oshaHours,1) + ' hours' : oshaHours >= 1 ? fmt(oshaHours,1) + ' hours' : fmt(oshaHours * 60,0) + ' minutes'; var nioshTime = nioshHours >= 1 ? fmt(nioshHours,1) + ' hours' : fmt(nioshHours * 60,0) + ' minutes'; var risk = decibels >= 120 ? 'Immediate damage possible' : decibels >= 100 ? 'High - limit exposure' : decibels >= 85 ? 'Moderate - use protection' : 'Low';     document.getElementById('safeTime').textContent = safeTime;
    document.getElementById('nioshLimit').textContent = nioshTime;
    document.getElementById('risk').textContent = risk;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['decibels'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
