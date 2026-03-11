(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var height = parseFloat(document.getElementById('height').value) || 0;
    var wingspan = parseFloat(document.getElementById('wingspan').value) || 0;
    var oppHeight = parseFloat(document.getElementById('oppHeight').value) || 0;
    var oppWingspan = parseFloat(document.getElementById('oppWingspan').value) || 0;

    // Calculation logic
    var reach = wingspan / 2;
    var oppReach = oppWingspan / 2;
    var apeIndex = wingspan - height;
    var oppApe = oppWingspan - oppHeight;
    var advantage = wingspan - oppWingspan;
    var strategy;
    if (advantage > 3) strategy = 'Strong reach advantage — fight at distance, use jabs and straight punches';
    else if (advantage > 0) strategy = 'Slight reach advantage — mix distance fighting with combinations';
    else if (advantage > -3) strategy = 'Similar reach — versatile approach, focus on timing and footwork';
    else strategy = 'Reach disadvantage — work inside, cut angles, use body shots and hooks';
    document.getElementById('reach').textContent = fmt(reach, 1) + '" (' + fmt(wingspan, 1) + '" wingspan)';
    document.getElementById('apeIndex').textContent = (apeIndex >= 0 ? '+' : '') + fmt(apeIndex, 1) + '" (avg is 0, positive is advantageous)';
    document.getElementById('reachAdvantage').textContent = (advantage >= 0 ? '+' : '') + fmt(advantage, 1) + '" over opponent';
    document.getElementById('optimalRange').textContent = strategy;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['height', 'wingspan', 'oppHeight', 'oppWingspan'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
