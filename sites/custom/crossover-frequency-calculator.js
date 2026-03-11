(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var crossoverFreq = parseFloat(document.getElementById('crossoverFreq').value) || 0;
    var impedance = parseFloat(document.getElementById('impedance').value) || 0;
    var order = document.getElementById('order').value;

    // Calculation logic
    var f = crossoverFreq;
    var z = impedance;
    var ord = parseInt(order);
    var pi = Math.PI;
    var lpC, lpL, hpC, hpL;
    if (ord === 1) {
      lpC = 1 / (2 * pi * f * z);
      lpL = z / (2 * pi * f);
      hpC = lpC;
      hpL = lpL;
    } else if (ord === 2) {
      lpC = Math.sqrt(2) / (4 * pi * f * z);
      lpL = (z * Math.sqrt(2)) / (2 * pi * f);
      hpC = 1 / (Math.sqrt(2) * pi * f * z);
      hpL = z / (Math.sqrt(2) * pi * f);
    } else {
      lpC = 2 / (3 * 2 * pi * f * z);
      lpL = 3 * z / (4 * 2 * pi * f);
      hpC = 1 / (3 * 2 * pi * f * z * 0.5);
      hpL = z / (2 * pi * f * 0.75);
    }
    var uf = function(c) { var v = c * 1e6; return v >= 1 ? fmt(v, 1) + ' µF' : fmt(v * 1000, 1) + ' nF'; };
    var mh = function(l) { var v = l * 1000; return fmt(v, 2) + ' mH'; };
    document.getElementById('lpCap').textContent = uf(lpC);
    document.getElementById('lpInd').textContent = mh(lpL);
    document.getElementById('hpCap').textContent = uf(hpC);
    document.getElementById('hpInd').textContent = mh(hpL);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['crossoverFreq', 'impedance', 'order'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
