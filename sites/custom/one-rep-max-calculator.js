(function() {
  'use strict';

  var unit = 'lbs';

  document.querySelectorAll('[data-unit]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-unit]').forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      unit = btn.dataset.unit;
    });
  });

  document.getElementById('calcBtn').addEventListener('click', function() {
    var w = parseFloat(document.getElementById('weight').value);
    var r = parseInt(document.getElementById('reps').value, 10);

    if (!w || !r || r < 2 || r > 12) {
      alert('Please enter weight and reps (2-12).');
      return;
    }

    var epley = w * (1 + r / 30);
    var brzycki = w / (1.0278 - 0.0278 * r);
    var lombardi = w * Math.pow(r, 0.10);
    var oconner = w * (1 + r * 0.025);
    var wathan = 100 * w / (48.8 + 53.8 * Math.exp(-0.075 * r));

    var avg = (epley + brzycki + lombardi + oconner + wathan) / 5;

    function fmt(v) { return Math.round(v) + ' ' + unit; }

    document.getElementById('avgMax').textContent = fmt(avg);
    document.getElementById('epley').textContent = fmt(epley);
    document.getElementById('brzycki').textContent = fmt(brzycki);
    document.getElementById('lombardi').textContent = fmt(lombardi);
    document.getElementById('oconner').textContent = fmt(oconner);
    document.getElementById('wathan').textContent = fmt(wathan);

    // Build percentage chart
    var pcts = [95, 90, 85, 80, 75, 70, 65, 60, 55, 50];
    var html = '<table style="width:100%;border-collapse:collapse;margin-top:0.5rem;font-size:0.9rem">';
    html += '<tr style="border-bottom:2px solid #ddd"><th style="text-align:left;padding:4px">%</th><th style="text-align:right;padding:4px">Weight</th></tr>';
    pcts.forEach(function(p) {
      html += '<tr style="border-bottom:1px solid #eee"><td style="padding:4px">' + p + '%</td><td style="text-align:right;padding:4px">' + Math.round(avg * p / 100) + ' ' + unit + '</td></tr>';
    });
    html += '</table>';
    document.getElementById('pctChart').innerHTML = html;

    document.getElementById('result').style.display = '';
  });
})();
