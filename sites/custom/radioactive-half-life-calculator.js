(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var initial = parseFloat(document.getElementById('initial').value) || 0;
    var halfLife = parseFloat(document.getElementById('halfLife').value) || 0;
    var elapsed = parseFloat(document.getElementById('elapsed').value) || 0;

    // Calculation logic
    var halvings = elapsed / halfLife; var remaining = initial * Math.pow(0.5, halvings); var decayed = initial - remaining; return {remaining: fmt(remaining,4), decayed: fmt(decayed,4), halvings: fmt(halvings,2)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['initial', 'halfLife', 'elapsed'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
