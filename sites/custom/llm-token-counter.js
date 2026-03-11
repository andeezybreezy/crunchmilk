(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var words = parseFloat(document.getElementById('words').value) || 0;
    var method = document.getElementById('method').value;

    // Calculation logic
    var ratios={avg:1.33,code:1.5,simple:1.2}; var ratio=ratios[method]||1.33; var tokens=Math.round(words*ratio); var characters=Math.round(words*5); var pages=fmt(words/250,1); var costHaiku=(tokens/1000000)*0.25; var costSonnet=(tokens/1000000)*3; return {tokens:fmt(tokens,0)+' tokens', characters:fmt(characters,0), pages:pages, costHaiku:'$'+fmt(costHaiku,6), costSonnet:'$'+fmt(costSonnet,6)};

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['words', 'method'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
