(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var spo2 = parseFloat(document.getElementById('spo2').value) || 0;
    var heartRate = parseFloat(document.getElementById('heartRate').value) || 0;
    var altitude = document.getElementById('altitude').value;

    // Calculation logic
    var altAdj = {'Sea Level': 0, '3000-5000 ft': -2, '5000-8000 ft': -3, '8000+ ft': -5}; var adj = altAdj[altitude] || 0; var effectiveSpo2 = spo2 - adj; var status = effectiveSpo2 >= 95 ? 'Normal' : effectiveSpo2 >= 90 ? 'Mildly Low' : effectiveSpo2 >= 85 ? 'Low - concerning' : 'Critical - seek help'; var hrStatus = heartRate < 60 ? 'Low (bradycardia)' : heartRate <= 100 ? 'Normal' : 'Elevated (tachycardia)'; var action = effectiveSpo2 < 90 ? 'Seek medical attention immediately' : effectiveSpo2 < 95 ? 'Monitor closely, consult doctor if persistent' : 'Normal, no action needed';     document.getElementById('status').textContent = status;
    document.getElementById('hrStatus').textContent = hrStatus;
    document.getElementById('action').textContent = action;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['spo2', 'heartRate', 'altitude'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
