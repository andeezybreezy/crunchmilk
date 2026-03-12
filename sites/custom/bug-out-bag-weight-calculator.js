(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var bodyWeight = parseFloat(document.getElementById('bodyWeight').value) || 0;
    var waterLbs = parseFloat(document.getElementById('waterLbs').value) || 0;
    var foodLbs = parseFloat(document.getElementById('foodLbs').value) || 0;
    var shelterLbs = parseFloat(document.getElementById('shelterLbs').value) || 0;
    var fireLbs = parseFloat(document.getElementById('fireLbs').value) || 0;
    var firstAidLbs = parseFloat(document.getElementById('firstAidLbs').value) || 0;
    var toolsLbs = parseFloat(document.getElementById('toolsLbs').value) || 0;
    var clothingLbs = parseFloat(document.getElementById('clothingLbs').value) || 0;

    // Calculation logic
    var total = waterLbs + foodLbs + shelterLbs + fireLbs + firstAidLbs + toolsLbs + clothingLbs;
    var pct = (total / bodyWeight) * 100;
    var assessment;
    if (pct <= 15) assessment = 'Excellent — comfortable for most fitness levels';
    else if (pct <= 20) assessment = 'Good — manageable for fit adults';
    else if (pct <= 25) assessment = 'Heavy — may slow you down significantly';
    else assessment = 'Too heavy — reduce weight or improve fitness first';
    var cats = [{n:'Water',w:waterLbs},{n:'Food',w:foodLbs},{n:'Shelter',w:shelterLbs},{n:'Fire/Light',w:fireLbs},{n:'First Aid',w:firstAidLbs},{n:'Tools',w:toolsLbs},{n:'Clothing',w:clothingLbs}];
    cats.sort(function(a,b){return b.w-a.w;});
    var heaviest = cats[0].n + ' (' + fmt(cats[0].w, 1) + ' lbs, ' + fmt(cats[0].w/total*100, 0) + '%)';
    document.getElementById('totalWeight').textContent = fmt(total, 1) + ' lbs (' + fmt(total * 0.454, 1) + ' kg)';
    document.getElementById('bodyPct').textContent = fmt(pct, 1) + '% of body weight';
    document.getElementById('assessment').textContent = assessment;
    document.getElementById('heaviestCategory').textContent = heaviest;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['bodyWeight', 'waterLbs', 'foodLbs', 'shelterLbs', 'fireLbs', 'firstAidLbs', 'toolsLbs', 'clothingLbs'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
