(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var bill = parseFloat(document.getElementById('bill').value) || 0;
    var tipPct = parseFloat(document.getElementById('tipPct').value) || 0;
    var people = parseFloat(document.getElementById('people').value) || 0;

    // Calculation logic
    var tip = bill * (tipPct/100); var total = bill + tip; var perPerson = total / people;     document.getElementById('tip').textContent = dollar(tip);
    document.getElementById('total').textContent = dollar(total);
    document.getElementById('perPerson').textContent = dollar(perPerson);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['bill', 'tipPct', 'people'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
