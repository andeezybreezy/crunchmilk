(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var species = document.getElementById('species').value;
    var cords = parseFloat(document.getElementById('cords').value) || 0;
    var stoveEff = parseFloat(document.getElementById('stoveEff').value) || 0;
    var homeSquareFt = parseFloat(document.getElementById('homeSquareFt').value) || 0;

    // Calculation logic
    var btuMap = {oak:29100000,hickory:30600000,maple:25500000,ash:24200000,birch:23600000,pine:17100000,cedar:13000000}; var btuPerCord = btuMap[species] || 25000000; var gross = btuPerCord * cords; var usable = gross * (stoveEff / 100); var dailyBTU = homeSquareFt * 35; var heatDays = usable / dailyBTU; var propaneGal = usable / 91500; var propaneCost = propaneGal * 2.75; document.getElementById('grossBTU').textContent = fmt(gross/1000000, 1) + 'M BTU'; document.getElementById('usableBTU').textContent = fmt(usable/1000000, 1) + 'M BTU'; document.getElementById('heatingDays').textContent = fmt(heatDays, 0) + ' days'; document.getElementById('costEquiv').textContent = dollar(propaneCost) + ' propane equiv';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['species', 'cords', 'stoveEff', 'homeSquareFt'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
