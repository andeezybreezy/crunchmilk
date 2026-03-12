(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var driverSize = parseFloat(document.getElementById('driverSize').value) || 0;
    var vas = parseFloat(document.getElementById('vas').value) || 0;
    var qts = parseFloat(document.getElementById('qts').value) || 0;
    var boxType = document.getElementById('boxType').value;

    // Calculation logic
    var vol, f3Info;
    if (boxType === 'sealed') {
      vol = vas * Math.pow(qts, 2.87) * 0.7;
      var qtc = 0.707;
      f3Info = 'F3 ≈ ' + fmt(42 * Math.pow(12 / driverSize, 0.8) / qtc, 0) + ' Hz (Butterworth alignment)';
    } else {
      vol = vas * 1.0;
      var fb = 28 * Math.pow(12 / driverSize, 0.5);
      var portDia = driverSize * 0.4;
      var portLen = (23562 * portDia * portDia) / (vol * 1000 * fb * fb) - 0.825 * portDia;
      f3Info = 'Tune: ' + fmt(fb, 0) + ' Hz | Port: ' + fmt(portDia, 1) + '" dia × ' + fmt(Math.abs(portLen), 1) + '" long';
    }
    var volCuFt = vol / 28.317;
    var side = Math.pow(vol * 1000, 1/3) / 10;
    var w = side * 1.0;
    var h = side * 1.2;
    var d = side * 0.8;
    var eff = boxType === 'ported' ? '+3 dB vs sealed' : 'Reference';
    document.getElementById('boxVolume').textContent = fmt(vol, 1) + ' L (' + fmt(volCuFt, 2) + ' cu ft)';
    document.getElementById('boxDimensions').textContent = fmt(w * 2.54, 1) + '" W × ' + fmt(h * 2.54, 1) + '" H × ' + fmt(d * 2.54, 1) + '" D (internal)';
    document.getElementById('portInfo').textContent = f3Info;
    document.getElementById('efficiency').textContent = eff;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['driverSize', 'vas', 'qts', 'boxType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
