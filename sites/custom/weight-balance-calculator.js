(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var emptyWeight = parseFloat(document.getElementById('emptyWeight').value) || 0;
    var emptyArm = parseFloat(document.getElementById('emptyArm').value) || 0;
    var frontSeat = parseFloat(document.getElementById('frontSeat').value) || 0;
    var frontArm = parseFloat(document.getElementById('frontArm').value) || 0;
    var rearSeat = parseFloat(document.getElementById('rearSeat').value) || 0;
    var rearArm = parseFloat(document.getElementById('rearArm').value) || 0;
    var baggage = parseFloat(document.getElementById('baggage').value) || 0;
    var baggageArm = parseFloat(document.getElementById('baggageArm').value) || 0;
    var fuelGallons = parseFloat(document.getElementById('fuelGallons').value) || 0;
    var fuelArm = parseFloat(document.getElementById('fuelArm').value) || 0;

    // Calculation logic
    var fuelWeight = fuelGallons * 6; var emptyMoment = emptyWeight * emptyArm; var frontMoment = frontSeat * frontArm; var rearMoment = rearSeat * rearArm; var bagMoment = baggage * baggageArm; var fuelMoment = fuelWeight * fuelArm; var totalWeight = emptyWeight + frontSeat + rearSeat + baggage + fuelWeight; var totalMom = emptyMoment + frontMoment + rearMoment + bagMoment + fuelMoment; var cgPos = totalWeight > 0 ? totalMom / totalWeight : 0; var maxGross = 2550; var fwdLimit = 35; var aftLimit = 47.3; var overweight = totalWeight > maxGross; var cgForward = cgPos < fwdLimit; var cgAft = cgPos > aftLimit; var statusMsg = ''; if(overweight && (cgForward || cgAft)) { statusMsg = 'UNSAFE — Over max gross weight AND CG out of limits'; } else if(overweight) { statusMsg = 'OVER WEIGHT by ' + fmt(totalWeight - maxGross, 0) + ' lbs — reduce load'; } else if(cgForward) { statusMsg = 'CG TOO FAR FORWARD — move weight aft or reduce front load'; } else if(cgAft) { statusMsg = 'CG TOO FAR AFT — move weight forward or reduce rear load'; } else { statusMsg = 'WITHIN LIMITS — ' + fmt(maxGross - totalWeight, 0) + ' lbs under max gross (C172 defaults)'; } document.getElementById('grossWeight').textContent = fmt(totalWeight, 0) + ' lbs'; document.getElementById('totalMoment').textContent = fmt(totalMom, 0) + ' lb-in'; document.getElementById('cg').textContent = fmt(cgPos, 1) + ' inches aft of datum'; document.getElementById('usefulLoad').textContent = fmt(totalWeight - emptyWeight, 0) + ' lbs'; document.getElementById('fuelWeight').textContent = fmt(fuelWeight, 0) + ' lbs (' + fmt(fuelGallons, 0) + ' gal)'; document.getElementById('status').textContent = statusMsg;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['emptyWeight', 'emptyArm', 'frontSeat', 'frontArm', 'rearSeat', 'rearArm', 'baggage', 'baggageArm', 'fuelGallons', 'fuelArm'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
