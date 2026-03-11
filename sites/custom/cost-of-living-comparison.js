(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var currentCity = document.getElementById('currentCity').value;
    var targetCity = document.getElementById('targetCity').value;
    var currentSalary = parseFloat(document.getElementById('currentSalary').value) || 0;

    // Calculation logic
    var indices = {NYC:100,SanJose:95,Boston:82,Seattle:80,LA:78,SanDiego:75,Miami:72,Denver:72,Austin:68,Chicago:65,Portland:67,Philadelphia:65,Dallas:60,Phoenix:58,Houston:57,SanAntonio:52}; var housing = {NYC:100,SanJose:110,Boston:85,Seattle:88,LA:90,SanDiego:82,Miami:78,Denver:72,Austin:65,Chicago:55,Portland:62,Philadelphia:55,Dallas:48,Phoenix:50,Houston:45,SanAntonio:40}; var ci = indices[currentCity] || 65; var ti = indices[targetCity] || 65; var ch = housing[currentCity] || 55; var th = housing[targetCity] || 55; var ratio = ti / ci; var equivSal = currentSalary * ratio; var diff = equivSal - currentSalary; var housingPctDiff = ((th - ch) / ch) * 100; var monthlySave = (currentSalary - equivSal) / 12; var ppChange = ((ci - ti) / ci) * 100; var assessStr = ''; if(ti < ci) { var savePct = ((ci - ti) / ci * 100); assessStr = 'Moving saves you ' + fmt(savePct, 0) + '% on cost of living. Your ' + dollar(currentSalary) + ' goes further in the new city.'; } else if(ti > ci) { var costPct = ((ti - ci) / ci * 100); assessStr = 'The target city is ' + fmt(costPct, 0) + '% more expensive. You would need a raise to maintain your standard of living.'; } else { assessStr = 'Similar cost of living — your salary maintains roughly the same purchasing power.'; } document.getElementById('equivSalary').textContent = dollar(equivSal); document.getElementById('difference').textContent = (diff >= 0 ? '+' : '') + dollar(diff) + (diff > 0 ? ' more needed' : ' less needed'); document.getElementById('currentIndex').textContent = ci + ' (NYC = 100 baseline)'; document.getElementById('targetIndex').textContent = ti + ' (NYC = 100 baseline)'; document.getElementById('housingDiff').textContent = (housingPctDiff >= 0 ? '+' : '') + fmt(housingPctDiff, 0) + '% housing cost difference'; document.getElementById('monthlySavings').textContent = monthlySave > 0 ? dollar(monthlySave) + '/mo potential savings' : dollar(Math.abs(monthlySave)) + '/mo additional cost'; document.getElementById('purchasingPower').textContent = ppChange > 0 ? '+' + fmt(ppChange, 0) + '% more purchasing power' : fmt(ppChange, 0) + '% less purchasing power'; document.getElementById('assessment').textContent = assessStr;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['currentCity', 'targetCity', 'currentSalary'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
