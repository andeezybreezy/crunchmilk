(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var birthYear = parseFloat(document.getElementById('birthYear').value) || 0;
    var country = document.getElementById('country').value;

    // Calculation logic
    var currentYear = new Date().getFullYear();
    var age = currentYear - birthYear;
    var gen;
    if (birthYear >= 2013) gen = 'Generation Alpha (2013-present)';
    else if (birthYear >= 1997) gen = 'Gen Z (1997-2012)';
    else if (birthYear >= 1981) gen = 'Millennial / Gen Y (1981-1996)';
    else if (birthYear >= 1965) gen = 'Generation X (1965-1980)';
    else if (birthYear >= 1946) gen = 'Baby Boomer (1946-1964)';
    else if (birthYear >= 1928) gen = 'Silent Generation (1928-1945)';
    else gen = 'Greatest Generation (before 1928)';
    var lifeExp = {us: 77, uk: 81, ca: 82, au: 83, jp: 84};
    var le = lifeExp[country];
    var retirement = birthYear + 67;
    var milestone = 'Retirement (age 67): ' + retirement;
    if (age < 18) milestone = 'Turn 18: ' + (birthYear + 18) + ' | College: ' + (birthYear + 18);
    else if (age < 30) milestone = 'Turn 30: ' + (birthYear + 30) + ' | Retirement: ' + retirement;
    var popByDecade = {1940:2300, 1950:2500, 1960:3000, 1970:3700, 1980:4400, 1990:5300, 2000:6100, 2010:6900, 2020:7800, 2030:8500};
    var decade = Math.floor(birthYear / 10) * 10;
    var pop = popByDecade[decade] || 8000;
    document.getElementById('currentAge').textContent = age + ' years old (born ' + birthYear + ')';
    document.getElementById('generation').textContent = gen;
    document.getElementById('lifeExpectancy').textContent = le + ' years (' + (le - age) + ' years remaining on average)';
    document.getElementById('milestones').textContent = milestone;
    document.getElementById('worldPop').textContent = '~' + fmt(pop, 0) + ' million (' + fmt(pop / 1000, 1) + ' billion)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['birthYear', 'country'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
