(function() {
  'use strict';

  var states = [
    'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia',
    'Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland',
    'Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
    'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
    'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
  ];

  var sel = document.getElementById('stState');
  states.forEach(function(s) {
    var o = document.createElement('option');
    o.value = s; o.textContent = s;
    sel.appendChild(o);
  });

  function fmt(n) {
    return '$' + Math.round(n).toLocaleString();
  }

  function calculate() {
    var limit = parseInt(document.getElementById('speedLimit').value, 10);
    var actual = parseInt(document.getElementById('actualSpeed').value, 10);
    var zone = document.getElementById('zoneType').value;

    if (isNaN(limit) || isNaN(actual) || actual <= limit) {
      document.getElementById('resultTip').textContent = 'Enter a speed higher than the speed limit.';
      document.getElementById('result').classList.add('visible');
      return;
    }

    var over = actual - limit;
    var fineLow, fineHigh, points, consequences;

    if (over <= 5) {
      fineLow = 50; fineHigh = 100; points = 1;
      consequences = 'Fine only';
    } else if (over <= 10) {
      fineLow = 100; fineHigh = 150; points = 2;
      consequences = 'Fine only';
    } else if (over <= 15) {
      fineLow = 150; fineHigh = 200; points = 3;
      consequences = 'Fine, possible traffic school';
    } else if (over <= 20) {
      fineLow = 200; fineHigh = 300; points = 4;
      consequences = 'Fine, insurance increase likely';
    } else if (over <= 25) {
      fineLow = 300; fineHigh = 400; points = 5;
      consequences = 'Possible reckless driving charge';
    } else if (over <= 30) {
      fineLow = 400; fineHigh = 500; points = 6;
      consequences = 'Reckless driving in many states';
    } else if (over <= 40) {
      fineLow = 500; fineHigh = 1000; points = 6;
      consequences = 'Reckless driving, possible suspension';
    } else {
      fineLow = 1000; fineHigh = 2500; points = 6;
      consequences = 'Criminal charge, license suspension';
    }

    var multiplier = 1;
    if (zone === 'school') multiplier = 2;
    else if (zone === 'construction') multiplier = 2;

    fineLow = Math.round(fineLow * multiplier);
    fineHigh = Math.round(fineHigh * multiplier);

    document.getElementById('fineRange').textContent = fmt(fineLow) + ' – ' + fmt(fineHigh);
    document.getElementById('mphOver').textContent = over + ' mph over';
    document.getElementById('points').textContent = points + ' point' + (points !== 1 ? 's' : '');
    document.getElementById('consequences').textContent = consequences;

    var tip = 'Estimate does not include court costs, surcharges, or fees. Actual fines vary by jurisdiction.';
    if (zone !== 'regular') {
      tip = zone.charAt(0).toUpperCase() + zone.slice(1) + ' zone: fines doubled. ' + tip;
    }
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
