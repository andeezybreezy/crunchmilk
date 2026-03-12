(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var cocktail = document.getElementById('cocktail').value;
    var servings = parseFloat(document.getElementById('servings').value) || 0;
    var ozPerDrink = parseFloat(document.getElementById('ozPerDrink').value) || 0;

    // Calculation logic
    var recipes={margarita:{s:2,sec:1,third:1,names:['Tequila','Triple Sec','Lime Juice']},oldfashioned:{s:2,sec:0.5,third:0,names:['Bourbon','Simple Syrup','+ Bitters']},manhattan:{s:2,sec:1,third:0,names:['Rye Whiskey','Sweet Vermouth','+ Bitters']},daiquiri:{s:2,sec:1,third:0.75,names:['White Rum','Lime Juice','Simple Syrup']},gimlet:{s:2,sec:1,third:0,names:['Gin','Lime Cordial','']},negroni:{s:1,sec:1,third:1,names:['Gin','Campari','Sweet Vermouth']}}; var r=recipes[cocktail]; var scale=(ozPerDrink/r.s)*servings; var spirit=r.s*scale; var secondary=r.sec*scale; var third=r.third*scale; var total=spirit+secondary+third;     document.getElementById('spirit').textContent = fmt(spirit,1)+' oz '+r.names[0];
    document.getElementById('secondary').textContent = fmt(secondary,1)+' oz '+r.names[1];
    document.getElementById('third').textContent = third>0?fmt(third,1)+' oz '+r.names[2]:r.names[2];
    document.getElementById('totalOz').textContent = fmt(total,1)+' oz';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['cocktail', 'servings', 'ozPerDrink'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
