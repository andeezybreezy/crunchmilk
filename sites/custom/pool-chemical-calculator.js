(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  var gallonsEl = document.getElementById('poolGallons');
  var chemEl = document.getElementById('chemType');
  var currentEl = document.getElementById('currentLevel');
  var targetEl = document.getElementById('targetLevel');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  // Chemical dosing data per 10,000 gallons
  var chemData = {
    chlorine: {
      name: 'Liquid Chlorine (12.5%)',
      perPPMper10k: 10,         // fl oz per 1 ppm per 10k gal
      unit: 'fl oz',
      range: '1-3 ppm FC',
      notes: 'Add in evening. Run pump 30 min after.'
    },
    ph_up: {
      name: 'Soda Ash (sodium carbonate)',
      perPPMper10k: 30,         // oz per 1.0 pH unit per 10k gal (6 oz per 0.2)
      unit: 'oz',
      range: 'pH 7.4-7.6',
      notes: 'Dissolve in bucket first. Add slowly.'
    },
    ph_down: {
      name: 'Muriatic Acid (31.45%)',
      perPPMper10k: 60,         // fl oz per 1.0 pH unit per 10k gal (12 oz per 0.2)
      unit: 'fl oz',
      range: 'pH 7.4-7.6',
      notes: 'Pour in front of return jet. Retest in 4 hrs.'
    },
    alkalinity: {
      name: 'Baking Soda (sodium bicarbonate)',
      perPPMper10k: 0.15,      // lbs per 1 ppm per 10k gal (1.5 lbs per 10 ppm)
      unit: 'lbs',
      range: '80-120 ppm TA',
      notes: 'Broadcast across surface. Max 2 lbs per 10k at once.'
    },
    cya: {
      name: 'Cyanuric Acid (stabilizer)',
      perPPMper10k: 0.8125,    // oz per 1 ppm per 10k gal (13 oz per 16 ppm ~ 0.8125)
      unit: 'oz',
      range: '30-50 ppm CYA',
      notes: 'Dissolve in sock in skimmer. Takes 3-7 days to register.'
    },
    calcium: {
      name: 'Calcium Chloride (77%)',
      perPPMper10k: 0.0125,    // lbs per 1 ppm per 10k gal (1.25 lbs per 100 ppm... no, per 10 ppm)
      unit: 'lbs',
      range: '200-400 ppm CH',
      notes: 'Dissolve in bucket first. Add slowly, generates heat.'
    }
  };

  // Fix calcium: 1.25 lbs per 10k raises by 10 ppm, so 0.125 lbs per ppm per 10k
  chemData.calcium.perPPMper10k = 0.125;

  var chartData = [
    ['Free Chlorine', '1-3 ppm', '1 ppm', '5 ppm', 'Daily'],
    ['pH', '7.4-7.6', '7.2', '7.8', 'Daily'],
    ['Total Alkalinity', '80-120 ppm', '60 ppm', '180 ppm', 'Weekly'],
    ['CYA (Stabilizer)', '30-50 ppm', '20 ppm', '80 ppm', 'Monthly'],
    ['Calcium Hardness', '200-400 ppm', '150 ppm', '500 ppm', 'Monthly'],
    ['Salt (SWG pools)', '2700-3400 ppm', '2500 ppm', '3500 ppm', 'Monthly']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getVal(el) { var v = parseFloat(el.value); return isNaN(v) ? 0 : v; }

  // Update defaults when chemical type changes
  chemEl.addEventListener('change', function() {
    var chem = chemEl.value;
    if (chem === 'chlorine') { currentEl.value = '1'; targetEl.value = '3'; }
    else if (chem === 'ph_up') { currentEl.value = '7.0'; targetEl.value = '7.5'; }
    else if (chem === 'ph_down') { currentEl.value = '8.0'; targetEl.value = '7.5'; }
    else if (chem === 'alkalinity') { currentEl.value = '60'; targetEl.value = '100'; }
    else if (chem === 'cya') { currentEl.value = '10'; targetEl.value = '40'; }
    else if (chem === 'calcium') { currentEl.value = '100'; targetEl.value = '250'; }
  });

  function calculate() {
    var gallons = getVal(gallonsEl);
    var chem = chemData[chemEl.value];
    var current = getVal(currentEl);
    var target = getVal(targetEl);

    if (gallons <= 0 || !chem) return;

    var diff = target - current;
    // For pH down, the difference should be negative (lowering)
    if (chemEl.value === 'ph_down') {
      diff = current - target;
    }

    if (diff <= 0) {
      document.getElementById('rAmount').textContent = 'No adjustment needed';
      document.getElementById('rChemName').textContent = chem.name;
      document.getElementById('rPPM').textContent = '0';
      document.getElementById('rVolume').textContent = fmt(gallons, 0) + ' gal';
      document.getElementById('rRange').textContent = chem.range;
      document.getElementById('rNotes').textContent = 'Current level is already at or past target.';
      resultEl.classList.add('visible');
      resultEl.style.display = 'block';
      return;
    }

    var factor = gallons / 10000;
    var amount = diff * chem.perPPMper10k * factor;

    // Convert large oz to lbs for display
    var displayAmount;
    if (chem.unit === 'oz' && amount >= 16) {
      displayAmount = fmt(amount / 16, 2) + ' lbs (' + fmt(amount, 1) + ' oz)';
    } else if (chem.unit === 'fl oz' && amount >= 128) {
      displayAmount = fmt(amount / 128, 2) + ' gal (' + fmt(amount, 0) + ' fl oz)';
    } else if (chem.unit === 'fl oz' && amount >= 32) {
      displayAmount = fmt(amount / 32, 2) + ' qt (' + fmt(amount, 0) + ' fl oz)';
    } else {
      displayAmount = fmt(amount, 1) + ' ' + chem.unit;
    }

    document.getElementById('rAmount').textContent = displayAmount;
    document.getElementById('rChemName').textContent = chem.name;
    document.getElementById('rPPM').textContent = (chemEl.value === 'ph_down' ? '-' : '+') + fmt(diff, 1);
    document.getElementById('rVolume').textContent = fmt(gallons, 0) + ' gal';
    document.getElementById('rRange').textContent = chem.range;
    document.getElementById('rNotes').textContent = chem.notes;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [gallonsEl, chemEl, currentEl, targetEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
