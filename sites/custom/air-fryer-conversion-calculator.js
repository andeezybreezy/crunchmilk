(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var ovenTemp = parseFloat(document.getElementById('ovenTemp').value) || 0;
    var ovenTime = parseFloat(document.getElementById('ovenTime').value) || 0;
    var foodType = document.getElementById('foodType').value;

    // Calculation logic
    var tempReduce = 25; var timeMult = foodType === 'baked' ? 0.80 : foodType === 'frozen' ? 0.75 : foodType === 'veggies' ? 0.70 : 0.75; var afTemp = ovenTemp - tempReduce; var afTime = Math.round(ovenTime * timeMult); var saved = ovenTime - afTime; var tips = {meat:'Flip halfway through. Use a meat thermometer to check doneness.',fish:'Lightly spray basket with oil. Fish cooks fast — check 2 min early.',veggies:'Shake basket halfway through for even crisping. Do not overcrowd.',frozen:'No need to thaw. Single layer works best for crispy results.',baked:'Use parchment with holes. Check 5 min early as centers cook faster.'}; document.getElementById('afTemp').textContent = afTemp + ' F'; document.getElementById('afTime').textContent = afTime + ' min'; document.getElementById('timeSaved').textContent = saved + ' min'; document.getElementById('tip').textContent = tips[foodType] || 'Shake basket halfway through cooking.';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['ovenTemp', 'ovenTime', 'foodType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
