(function() {
  'use strict';

  var method = 'formula';

  document.querySelectorAll('[data-method]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-method]').forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      method = btn.dataset.method;
      document.getElementById('customMaxGroup').style.display = method === 'custom' ? '' : 'none';
    });
  });

  var zones = [
    { name: 'Zone 1', low: 0.50, high: 0.60, purpose: 'Recovery & warm-up' },
    { name: 'Zone 2', low: 0.60, high: 0.70, purpose: 'Aerobic base & fat burning' },
    { name: 'Zone 3', low: 0.70, high: 0.80, purpose: 'Aerobic fitness & stamina' },
    { name: 'Zone 4', low: 0.80, high: 0.90, purpose: 'Anaerobic threshold & speed' },
    { name: 'Zone 5', low: 0.90, high: 1.00, purpose: 'VO2 max & peak power' }
  ];

  document.getElementById('calcBtn').addEventListener('click', function() {
    var age = parseFloat(document.getElementById('age').value);
    var restHR = parseFloat(document.getElementById('restingHR').value) || 0;
    var maxHR;

    if (method === 'custom') {
      maxHR = parseFloat(document.getElementById('customMax').value);
      if (!maxHR) { alert('Please enter your custom max heart rate.'); return; }
    } else {
      if (!age) { alert('Please enter your age.'); return; }
      maxHR = 220 - age;
    }

    var useKarvonen = restHR > 0;
    var methodLabel = useKarvonen ? 'Karvonen' : 'Standard (% of Max)';

    document.getElementById('maxHR').textContent = Math.round(maxHR) + ' bpm';
    document.getElementById('methodLabel').textContent = methodLabel;

    var html = '<table style="width:100%;border-collapse:collapse;font-size:0.9rem;margin-top:1rem">';
    html += '<tr style="border-bottom:2px solid #ddd"><th style="text-align:left;padding:6px">Zone</th><th style="text-align:center;padding:6px">BPM Range</th><th style="text-align:left;padding:6px">Purpose</th></tr>';

    zones.forEach(function(z) {
      var low, high;
      if (useKarvonen) {
        low = Math.round(((maxHR - restHR) * z.low) + restHR);
        high = Math.round(((maxHR - restHR) * z.high) + restHR);
      } else {
        low = Math.round(maxHR * z.low);
        high = Math.round(maxHR * z.high);
      }
      var pct = Math.round(z.low * 100) + '-' + Math.round(z.high * 100) + '%';
      html += '<tr style="border-bottom:1px solid #eee"><td style="padding:6px"><strong>' + z.name + '</strong><br><span style="font-size:0.8rem;color:#666">' + pct + '</span></td><td style="text-align:center;padding:6px;font-weight:600">' + low + ' - ' + high + '</td><td style="padding:6px">' + z.purpose + '</td></tr>';
    });

    html += '</table>';
    document.getElementById('zonesTable').innerHTML = html;
    document.getElementById('result').style.display = '';
  });
})();
