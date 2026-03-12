(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var petWeight = parseFloat(document.getElementById('petWeight').value) || 0;
    var medication = document.getElementById('medication').value;
    var tabletStrength = document.getElementById('tabletStrength').value;
    var frequency = document.getElementById('frequency').value;
    var petType = document.getElementById('petType').value;

    // Calculation logic
    var weightKg = petWeight * 0.4536; var doseMgKg = {benadryl:2,pepcid:0.5,aspirin:10,melatonin:0.1,fish_oil:30,glucosamine:20}; var tabletMg = {benadryl:25,pepcid:10,aspirin:325,melatonin:3,fish_oil:1000,glucosamine:500}; var maxMgKg = {benadryl:4,pepcid:1,aspirin:15,melatonin:0.2,fish_oil:50,glucosamine:30}; var catSafe = {benadryl:true,pepcid:true,aspirin:false,melatonin:true,fish_oil:true,glucosamine:true}; if(petType === 'cat' && !catSafe[medication]) { document.getElementById('dosePerAdmin').textContent = 'NOT SAFE FOR CATS'; document.getElementById('dailyDose').textContent = 'Do not administer'; document.getElementById('tabletCount').textContent = 'N/A'; document.getElementById('maxDose').textContent = 'N/A'; document.getElementById('warning').textContent = 'This medication is toxic to cats. Consult your veterinarian immediately.'; return; } var catAdj = petType === 'cat' ? 0.5 : 1.0; var doseMg = weightKg * doseMgKg[medication] * catAdj; var tabSize = tabletStrength === 'extra' ? tabletMg[medication] * 2 : tabletMg[medication]; var tablets = doseMg / tabSize; var freq = parseInt(frequency); var dailyTotal = doseMg * freq; var maxDose = weightKg * maxMgKg[medication]; document.getElementById('dosePerAdmin').textContent = fmt(doseMg, 1) + ' mg'; document.getElementById('dailyDose').textContent = fmt(dailyTotal, 1) + ' mg/day'; document.getElementById('tabletCount').textContent = fmt(tablets, 1) + ' tablet(s)'; document.getElementById('maxDose').textContent = fmt(maxDose, 1) + ' mg per dose'; document.getElementById('warning').textContent = 'Always consult your veterinarian before giving any medication. This calculator provides general guidelines only.';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['petWeight', 'medication', 'tabletStrength', 'frequency', 'petType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
