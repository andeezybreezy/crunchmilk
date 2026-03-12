(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var spice = document.getElementById('spice').value;
    var amount = parseFloat(document.getElementById('amount').value) || 0;

    // Calculation logic
    var subs = {allspice:{s1:'Cinnamon + Cloves (2:1 mix)',r1:0.75,s2:'Pumpkin Pie Spice',r2:1.0,n:'Use slightly less — allspice is potent'},basil_fresh:{s1:'Dried Basil',r1:0.33,s2:'Fresh Oregano',r2:1.0,n:'1 tsp dried = 1 tbsp fresh'},basil_dried:{s1:'Fresh Basil (triple amount)',r1:3.0,s2:'Dried Oregano',r2:1.0,n:'Add fresh basil at end of cooking'},cayenne:{s1:'Red Pepper Flakes',r1:1.5,s2:'Hot Paprika',r2:2.0,n:'Start with less and taste — heat varies'},cilantro:{s1:'Fresh Parsley + Lime Zest',r1:1.0,s2:'Fresh Basil',r2:1.0,n:'Nothing truly replicates cilantro flavor'},cinnamon:{s1:'Allspice',r1:0.5,s2:'Nutmeg',r2:0.25,n:'Use less — substitutes are stronger'},cumin:{s1:'Chili Powder',r1:1.0,s2:'Coriander',r2:0.75,n:'Chili powder contains cumin already'},garlic_fresh:{s1:'Garlic Powder',r1:0.33,s2:'Granulated Garlic',r2:0.5,n:'1 clove = 1/3 tsp powder'},ginger_fresh:{s1:'Ground Ginger',r1:0.25,s2:'Allspice',r2:0.25,n:'1 tbsp fresh = 1/4 tsp ground'},nutmeg:{s1:'Allspice',r1:1.0,s2:'Cinnamon + Ginger (equal parts)',r2:0.5,n:'Use sparingly — a little goes far'},oregano:{s1:'Marjoram',r1:1.0,s2:'Thyme',r2:0.75,n:'Marjoram is the closest match'},paprika:{s1:'Cayenne + Sugar (pinch each)',r1:0.5,s2:'Ancho Chili Powder',r2:1.0,n:'Cayenne is much hotter — use half'},parsley:{s1:'Chervil',r1:1.0,s2:'Cilantro',r2:1.0,n:'For garnish, celery leaves also work'},rosemary:{s1:'Thyme',r1:1.0,s2:'Savory',r2:1.0,n:'Both pair well with roasted meats'},thyme:{s1:'Oregano',r1:0.75,s2:'Rosemary (use less)',r2:0.5,n:'Rosemary is stronger — use half the amount'}}; var s = subs[spice] || {s1:'No data',r1:1,s2:'No data',r2:1,n:'Check a spice reference guide'}; document.getElementById('sub1').textContent = s.s1; document.getElementById('sub1Amt').textContent = fmt(amount * s.r1, 2) + ' tsp'; document.getElementById('sub2').textContent = s.s2; document.getElementById('sub2Amt').textContent = fmt(amount * s.r2, 2) + ' tsp'; document.getElementById('notes').textContent = s.n;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['spice', 'amount'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
