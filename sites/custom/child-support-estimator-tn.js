(function() {
  'use strict';

  var states = [
    'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia',
    'Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland',
    'Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
    'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
    'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
  ];

  var stateSelect = document.getElementById('csState');
  states.forEach(function(s) {
    var opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    stateSelect.appendChild(opt);
  });

  var childRates = { 1: 0.185, 2: 0.25, 3: 0.29, 4: 0.31, 5: 0.35 };

  function fmt(n) {
    return '$' + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function calculate() {
    var income1 = parseFloat(document.getElementById('income1').value);
    var income2 = parseFloat(document.getElementById('income2').value);
    var numChildren = parseInt(document.getElementById('numChildren').value, 10);
    var custody = document.getElementById('custody').value;

    if (isNaN(income1) || income1 < 0 || isNaN(income2) || income2 < 0) return;

    var rate = childRates[numChildren] || 0.35;
    var combinedIncome = income1 + income2;
    var ncShare = combinedIncome > 0 ? income1 / combinedIncome : 0.5;

    var baseObligation = combinedIncome * rate;
    var ncObligation = baseObligation * ncShare;

    if (custody === 'joint') {
      ncObligation = Math.max(0, (income1 - income2) * rate * 0.5);
    } else if (custody === 'split') {
      ncObligation = ncObligation * 0.75;
    }

    ncObligation = Math.max(0, Math.round(ncObligation));

    document.getElementById('monthlySupport').textContent = fmt(ncObligation);
    document.getElementById('annualSupport').textContent = fmt(ncObligation * 12);
    document.getElementById('perChild').textContent = fmt(ncObligation / numChildren);
    document.getElementById('pctIncome').textContent = income1 > 0 ? (ncObligation / income1 * 100).toFixed(1) + '%' : 'N/A';

    var tip = 'Based on simplified percentage-of-income model. Actual amounts depend on state guidelines, deductions, and court discretion.';
    if (custody === 'joint') {
      tip = 'Joint custody adjustment applied. The higher earner typically pays the income difference share.';
    }
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
