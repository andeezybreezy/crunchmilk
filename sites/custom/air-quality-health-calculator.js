(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var aqi = parseFloat(document.getElementById('aqi').value) || 0;
    var sensitive = document.getElementById('sensitive').value;

    // Calculation logic
    var cat, risk, rec; if (aqi <= 50) { cat = 'Good'; risk = 'None'; rec = 'Air quality is satisfactory. Enjoy outdoor activities.'; } else if (aqi <= 100) { cat = 'Moderate'; risk = sensitive === 'yes' ? 'Low-Moderate' : 'Low'; rec = sensitive === 'yes' ? 'Unusually sensitive people should reduce prolonged outdoor exertion.' : 'Acceptable for most people. Sensitive groups may have mild effects.'; } else if (aqi <= 150) { cat = 'Unhealthy for Sensitive Groups'; risk = sensitive === 'yes' ? 'Moderate-High' : 'Low-Moderate'; rec = sensitive === 'yes' ? 'Avoid prolonged outdoor exertion. Keep rescue inhaler handy.' : 'Most people OK. Reduce prolonged outdoor exertion if you feel symptoms.'; } else if (aqi <= 200) { cat = 'Unhealthy'; risk = sensitive === 'yes' ? 'High' : 'Moderate'; rec = 'Everyone should reduce outdoor exertion. Sensitive groups should stay indoors.'; } else if (aqi <= 300) { cat = 'Very Unhealthy'; risk = 'High'; rec = 'Avoid all outdoor exertion. Keep windows closed. Use air purifier indoors.'; } else { cat = 'Hazardous'; risk = 'Very High'; rec = 'Stay indoors. Seal windows. Use N95 mask if you must go outside. Seek medical attention for symptoms.'; } document.getElementById('category').textContent = cat; document.getElementById('risk').textContent = risk; document.getElementById('recommendation').textContent = rec;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['aqi', 'sensitive'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
