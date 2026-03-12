(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var goldPrice = parseFloat(document.getElementById('goldPrice').value) || 0;
    var oilPrice = parseFloat(document.getElementById('oilPrice').value) || 0;

    // Calculation logic
    var ratio = goldPrice / oilPrice; var avgRatio = 16; var signal = ''; var interp = ''; if (ratio > 30) { signal = 'Extreme Fear — gold very expensive vs oil'; interp = 'Markets pricing in severe economic risk or oil demand destruction. Similar to 2020 COVID crash.'; } else if (ratio > 22) { signal = 'Elevated Stress — risk-off sentiment'; interp = 'Investors prefer safe havens over growth assets. Potential recession indicator.'; } else if (ratio > 12) { signal = 'Normal Range'; interp = 'Markets balanced between growth and safety expectations.'; } else { signal = 'Risk-On — oil expensive vs gold'; interp = 'Strong economic activity driving oil demand. Similar to 2008 pre-crisis or commodity booms.'; }     document.getElementById('ratio').textContent = ratio.toFixed(1) + ':1';
    document.getElementById('historicalAvg').textContent = avgRatio + ':1 (40-year average)';
    document.getElementById('signal').textContent = signal;
    document.getElementById('barrelsPerOz').textContent = '1 oz gold buys ' + ratio.toFixed(1) + ' barrels of oil';
    document.getElementById('interpretation').textContent = interp;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['goldPrice', 'oilPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
