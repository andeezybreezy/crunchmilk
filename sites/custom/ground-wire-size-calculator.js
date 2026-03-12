(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var breakerSize = document.getElementById('breakerSize').value;
    var wireType = document.getElementById('wireType').value;

    // Calculation logic
    var copperSizes = {'15':'14','20':'12','30':'10','40':'10','60':'10','100':'8','200':'6','400':'3'};
    var alumSizes = {'15':'12','20':'10','30':'8','40':'8','60':'8','100':'6','200':'4','400':'1'};
    var sizes = wireType === 'copper' ? copperSizes : alumSizes;
    var gauge = sizes[breakerSize];
    document.getElementById('groundSize').textContent = gauge + ' AWG ' + (wireType === 'copper' ? 'Copper' : 'Aluminum');
    document.getElementById('notes').textContent = 'Per NEC Table 250.122. Use copper for wet locations. Ground wire may never be smaller than specified.';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['breakerSize', 'wireType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
