(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var guestCount = parseFloat(document.getElementById('guestCount').value) || 0;
    var venue1 = document.getElementById('venue1').value;
    var venue2 = document.getElementById('venue2').value;
    var season = document.getElementById('season').value;
    var dayOfWeek = document.getElementById('dayOfWeek').value;

    // Calculation logic
    var rentalFees = {backyard:500,park:1500,restaurant:2000,banquet:4000,hotel:6000,barn:5000,estate:7500,rooftop:6500}; var cateringPG = {backyard:55,park:60,restaurant:75,banquet:65,hotel:85,barn:60,estate:80,rooftop:80}; var hiddenCosts = {backyard:3500,park:2500,restaurant:500,banquet:1000,hotel:1500,barn:3000,estate:2000,rooftop:1500}; var seasonMult = {off:0.75,shoulder:0.90,peak:1.0}; var dayMult = {weekday:0.70,friday:0.85,saturday:1.0,sunday:0.80}; var sm = seasonMult[season] || 1.0; var dm = dayMult[dayOfWeek] || 1.0; var mult = sm * dm; var r1 = (rentalFees[venue1] || 4000) * mult; var c1 = (cateringPG[venue1] || 65) * guestCount; var h1 = (hiddenCosts[venue1] || 1500) * mult; var t1 = r1 + c1 + h1; var r2 = (rentalFees[venue2] || 4000) * mult; var c2 = (cateringPG[venue2] || 65) * guestCount; var h2 = (hiddenCosts[venue2] || 1500) * mult; var t2 = r2 + c2 + h2; var diff = Math.abs(t1 - t2); var cheaper = t1 < t2 ? 'Venue 1 saves ' + dollar(diff) : 'Venue 2 saves ' + dollar(diff); var hiddenNote = {backyard:'Tent, tables, chairs, restrooms, power',park:'Permit, tent, catering setup, generators',restaurant:'Usually all-inclusive — fewer hidden costs',banquet:'Service charge, overtime fees, cake cutting fee',hotel:'Valet, resort fee, corkage, service charge',barn:'Restrooms, power, lighting, HVAC rental',estate:'Grounds fee, insurance, vendor meals',rooftop:'Weather backup plan, elevator logistics'}; document.getElementById('venue1Total').textContent = dollar(t1); document.getElementById('venue2Total').textContent = dollar(t2); document.getElementById('venue1Rental').textContent = dollar(r1); document.getElementById('venue2Rental').textContent = dollar(r2); document.getElementById('savings').textContent = cheaper; document.getElementById('hiddenCosts').textContent = hiddenNote[venue1] || 'Ask about service charges and overtime';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['guestCount', 'venue1', 'venue2', 'season', 'dayOfWeek'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
