(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var birthYear = parseFloat(document.getElementById('birthYear').value) || 0;
    var partnerYear = parseFloat(document.getElementById('partnerYear').value) || 0;

    // Calculation logic
    var animals = ['Monkey','Rooster','Dog','Pig','Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat'];
    var elements = ['Metal','Metal','Water','Water','Wood','Wood','Fire','Fire','Earth','Earth'];
    var traits = {'Rat':'Clever, resourceful, versatile','Ox':'Dependable, strong, determined','Tiger':'Brave, confident, competitive','Rabbit':'Gentle, elegant, alert','Dragon':'Confident, ambitious, energetic','Snake':'Wise, intuitive, graceful','Horse':'Active, energetic, free-spirited','Goat':'Calm, gentle, creative','Monkey':'Witty, intelligent, playful','Rooster':'Observant, hardworking, courageous','Dog':'Loyal, honest, kind','Pig':'Compassionate, generous, diligent'};
    var idx = birthYear % 12;
    var animal = animals[idx];
    var elemIdx = birthYear % 10;
    var element = elements[elemIdx];
    var pIdx = partnerYear % 12;
    var pAnimal = animals[pIdx];
    var bestMatch = {'Rat':'Dragon, Monkey, Ox','Ox':'Rat, Snake, Rooster','Tiger':'Horse, Dog, Pig','Rabbit':'Goat, Dog, Pig','Dragon':'Rat, Monkey, Rooster','Snake':'Ox, Rooster, Monkey','Horse':'Tiger, Goat, Dog','Goat':'Rabbit, Horse, Pig','Monkey':'Rat, Dragon, Snake','Rooster':'Ox, Dragon, Snake','Dog':'Tiger, Rabbit, Horse','Pig':'Tiger, Rabbit, Goat'};
    var best = bestMatch[animal] || '';
    var isMatch = best.indexOf(pAnimal) !== -1;
    document.getElementById('animal').textContent = animal + ' (' + birthYear + ')';
    document.getElementById('element').textContent = element + ' ' + animal;
    document.getElementById('traits').textContent = traits[animal];
    document.getElementById('compatibility').textContent = animal + ' + ' + pAnimal + ': ' + (isMatch ? 'Excellent match!' : 'Challenging — requires understanding') + ' | Best matches for ' + animal + ': ' + best;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['birthYear', 'partnerYear'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
