(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var salary1 = parseFloat(document.getElementById('salary1').value) || 0;
    var col1 = parseFloat(document.getElementById('col1').value) || 0;
    var salary2 = parseFloat(document.getElementById('salary2').value) || 0;
    var col2 = parseFloat(document.getElementById('col2').value) || 0;
    var stateTax1 = parseFloat(document.getElementById('stateTax1').value) || 0;
    var stateTax2 = parseFloat(document.getElementById('stateTax2').value) || 0;

    // Calculation logic
    var after1 = salary1 * (1 - stateTax1/100); var after2 = salary2 * (1 - stateTax2/100); var adj1 = after1 / (col1 / 100); var adj2 = after2 / (col2 / 100); document.getElementById('adj1').textContent = dollar(adj1) + ' (adjusted purchasing power)'; document.getElementById('adj2').textContent = dollar(adj2) + ' (adjusted purchasing power)'; document.getElementById('winner').textContent = adj1 > adj2 ? 'Offer 1 has ' + pct((adj1/adj2-1)*100, 1) + ' more purchasing power' : adj2 > adj1 ? 'Offer 2 has ' + pct((adj2/adj1-1)*100, 1) + ' more purchasing power' : 'Both offers are equivalent';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['salary1', 'col1', 'salary2', 'col2', 'stateTax1', 'stateTax2'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
