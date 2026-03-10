(function() {
  'use strict';

  // City data: col index, state tax rate on retirement income, housing index, healthcare score (1-5), climate type
  var cities = {
    scottsdale:  { name: 'Scottsdale, AZ',    col: 118, tax: 0.025, health: 5, climate: 'dry' },
    sarasota:    { name: 'Sarasota, FL',       col: 108, tax: 0,     health: 4, climate: 'warm' },
    asheville:   { name: 'Asheville, NC',      col: 105, tax: 0.045, health: 4, climate: 'mild' },
    sanantonio:  { name: 'San Antonio, TX',    col: 88,  tax: 0,     health: 4, climate: 'warm' },
    boise:       { name: 'Boise, ID',          col: 108, tax: 0.058, health: 4, climate: 'mild' },
    charleston:  { name: 'Charleston, SC',     col: 112, tax: 0.065, health: 4, climate: 'warm' },
    lasvegas:    { name: 'Las Vegas, NV',      col: 102, tax: 0,     health: 3, climate: 'dry' },
    savannah:    { name: 'Savannah, GA',       col: 96,  tax: 0.055, health: 3, climate: 'warm' },
    stgeorge:    { name: 'St. George, UT',     col: 100, tax: 0.0465,health: 3, climate: 'dry' },
    fortmyers:   { name: 'Fort Myers, FL',     col: 100, tax: 0,     health: 4, climate: 'warm' },
    tucson:      { name: 'Tucson, AZ',         col: 94,  tax: 0.025, health: 4, climate: 'dry' },
    knoxville:   { name: 'Knoxville, TN',      col: 86,  tax: 0,     health: 3, climate: 'mild' }
  };

  var retIncome = document.getElementById('retIncome');
  var savings = document.getElementById('savings');
  var retCity1 = document.getElementById('retCity1');
  var retCity2 = document.getElementById('retCity2');
  var climatePref = document.getElementById('climatePref');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function calcCity(city, income, totalSavings) {
    // Baseline retirement spending at national average = $48,000/yr
    var baseSpend = 48000;
    var annualCost = Math.round(baseSpend * (city.col / 100));
    var taxAmount = Math.round(income * city.tax);
    var totalAnnual = annualCost + taxAmount;
    var deficit = totalAnnual - income;
    var yearsLast = deficit > 0 ? totalSavings / deficit : 99;
    return { annualCost: annualCost, tax: taxAmount, totalAnnual: totalAnnual, yearsLast: yearsLast };
  }

  function calculate() {
    var income = parseFloat(retIncome.value);
    var totalSav = parseFloat(savings.value);
    var c1 = cities[retCity1.value];
    var c2 = cities[retCity2.value];
    var pref = climatePref.value;

    if (!c1 || !c2 || isNaN(income) || isNaN(totalSav)) return;

    var r1 = calcCity(c1, income, totalSav);
    var r2 = calcCity(c2, income, totalSav);

    document.getElementById('rCity1Label').textContent = c1.name + ' — Annual Cost';
    document.getElementById('rCity2Label').textContent = c2.name + ' — Annual Cost';

    document.getElementById('rCost1').textContent = '$' + r1.totalAnnual.toLocaleString() + '/yr';
    document.getElementById('rCost2').textContent = '$' + r2.totalAnnual.toLocaleString() + '/yr';

    document.getElementById('rTax1').textContent = c1.tax === 0 ? 'None ($0)' : (c1.tax * 100).toFixed(1) + '% ($' + r1.tax.toLocaleString() + '/yr)';
    document.getElementById('rTax2').textContent = c2.tax === 0 ? 'None ($0)' : (c2.tax * 100).toFixed(1) + '% ($' + r2.tax.toLocaleString() + '/yr)';

    document.getElementById('rYears1').textContent = r1.yearsLast >= 99 ? 'Indefinitely' : r1.yearsLast.toFixed(1) + ' years';
    document.getElementById('rYears2').textContent = r2.yearsLast >= 99 ? 'Indefinitely' : r2.yearsLast.toFixed(1) + ' years';

    var diff = r1.totalAnnual - r2.totalAnnual;
    var cheaper = diff > 0 ? c2.name : c1.name;
    document.getElementById('rDiff').textContent = '$' + Math.abs(diff).toLocaleString() + '/yr — ' + cheaper + ' is cheaper';
    document.getElementById('rDiff').style.color = '#0369a1';

    // Recommendation based on cost + climate match
    var score1 = 0, score2 = 0;
    if (r1.totalAnnual < r2.totalAnnual) score1 += 2; else score2 += 2;
    if (pref !== 'any') {
      if (c1.climate === pref) score1 += 1;
      if (c2.climate === pref) score2 += 1;
    }
    if (c1.health > c2.health) score1 += 1; else if (c2.health > c1.health) score2 += 1;

    var rec = score1 >= score2 ? c1.name : c2.name;
    document.getElementById('rRec').textContent = rec;

    var tenYearDiff = Math.abs(diff) * 10;
    document.getElementById('resultTip').textContent = 'Over 10 years, choosing ' + cheaper + ' saves ~$' + tenYearDiff.toLocaleString() + ' vs ' + (diff > 0 ? c1.name : c2.name) + '. Factor in healthcare access, proximity to family, and personal preferences.';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  [retIncome, savings, retCity1, retCity2, climatePref].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

  calculate();
})();
