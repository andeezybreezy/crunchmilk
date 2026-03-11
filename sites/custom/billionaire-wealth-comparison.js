(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var yourIncome = parseFloat(document.getElementById('yourIncome').value) || 0;
    var billionaire = document.getElementById('billionaire').value;
    var compType = document.getElementById('compType').value;

    // Calculation logic
    var wealth = {musk:230000000000,bezos:200000000000,zuckerberg:180000000000,arnault:170000000000,buffett:130000000000,gates:128000000000}; var names = {musk:'Elon Musk',bezos:'Jeff Bezos',zuckerberg:'Mark Zuckerberg',arnault:'Bernard Arnault',buffett:'Warren Buffett',gates:'Bill Gates'}; var w = wealth[billionaire] || wealth.musk; var name = names[billionaire] || 'Elon Musk'; var ratio = w / yourIncome; var years = ratio; var theirOneDollar = yourIncome / w; var dinnerEquiv = (1000 / w) * yourIncome; var carEquiv = (250000 / w) * yourIncome; var yachtEquiv = (100000000 / w) * yourIncome; var perSecond = w / (40 * 365.25 * 24 * 3600); var yearsStr = ''; if(years > 1000000) { yearsStr = fmt(years / 1000000, 1) + ' million years'; } else if(years > 1000) { yearsStr = fmt(years / 1000, 0) + ' thousand years'; } else { yearsStr = fmt(years, 0) + ' years'; } var perspStr = ''; if(ratio > 1000000) { perspStr = 'If ' + name + ' spent ' + dollar(yourIncome) + ' (your entire annual salary), it would feel like you spending ' + (theirOneDollar * 100 < 0.01 ? 'less than a penny' : fmt(theirOneDollar * yourIncome * 100, 2) + ' cents'); } else { perspStr = 'The wealth gap is ' + fmt(ratio, 0) + ' to 1'; } document.getElementById('yearsToEarn').textContent = yearsStr; document.getElementById('theirDollar').textContent = '$' + (theirOneDollar < 0.01 ? theirOneDollar.toExponential(2) : fmt(theirOneDollar, 6)); document.getElementById('dinner').textContent = dinnerEquiv < 0.01 ? 'Less than a penny' : '$' + fmt(dinnerEquiv, 4); document.getElementById('car').textContent = '$' + fmt(carEquiv, 2); document.getElementById('yacht').textContent = '$' + fmt(yachtEquiv, 2); document.getElementById('ratio').textContent = fmt(ratio, 0) + ' to 1'; document.getElementById('perSecond').textContent = dollar(perSecond) + '/sec (over 40-year career)'; document.getElementById('perspective').textContent = perspStr;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['yourIncome', 'billionaire', 'compType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
