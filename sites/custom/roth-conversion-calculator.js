(function() {
  'use strict';

  function fmt(n) {
    return '$' + Math.round(n).toLocaleString();
  }

  function calculate() {
    var balance = parseFloat(document.getElementById('iraBalance').value);
    var conversionInput = document.getElementById('conversionAmount').value;
    var conversionAmount = conversionInput ? parseFloat(conversionInput) : balance;
    var currentRate = parseFloat(document.getElementById('currentBracket').value) / 100;
    var retireRate = parseFloat(document.getElementById('retirementBracket').value) / 100;
    var years = parseInt(document.getElementById('yearsToRetire').value, 10);
    var returnRate = parseFloat(document.getElementById('returnRate').value) / 100;

    if (isNaN(balance) || balance <= 0 || isNaN(years) || years <= 0 || isNaN(returnRate)) return;
    if (isNaN(conversionAmount) || conversionAmount <= 0) conversionAmount = balance;
    conversionAmount = Math.min(conversionAmount, balance);

    // Scenario 1: Convert to Roth now
    var taxOwed = conversionAmount * currentRate;
    var rothAfterConversion = conversionAmount; // full amount goes into Roth
    var rothAtRetirement = rothAfterConversion * Math.pow(1 + returnRate, years);
    // Roth withdrawals are tax-free
    var rothNetValue = rothAtRetirement;

    // Scenario 2: Keep traditional
    var tradAtRetirement = conversionAmount * Math.pow(1 + returnRate, years);
    var tradAfterTax = tradAtRetirement * (1 - retireRate);

    // Advantage
    var advantage = rothNetValue - tradAfterTax - taxOwed;
    // The tax owed reduces your investable assets now, so account for opportunity cost
    var taxOpportunityCost = taxOwed * Math.pow(1 + returnRate, years) * (1 - retireRate);
    var netAdvantage = rothNetValue - tradAfterTax - taxOpportunityCost;

    // Break-even year calculation
    var breakEvenYear = 0;
    if (currentRate < retireRate || currentRate === retireRate) {
      // Always advantageous or neutral from year 1 when current rate <= retirement rate
      breakEvenYear = 0;
    } else {
      // Find when Roth overtakes traditional (accounting for upfront tax cost)
      for (var y = 1; y <= 50; y++) {
        var rv = conversionAmount * Math.pow(1 + returnRate, y);
        var tv = conversionAmount * Math.pow(1 + returnRate, y) * (1 - retireRate);
        var tc = taxOwed * Math.pow(1 + returnRate, y) * (1 - retireRate);
        if (rv - tc > tv) {
          breakEvenYear = y;
          break;
        }
      }
    }

    document.getElementById('taxOwed').textContent = fmt(taxOwed);
    document.getElementById('rothValue').textContent = fmt(rothAtRetirement) + ' (tax-free)';
    document.getElementById('tradPreTax').textContent = fmt(tradAtRetirement);
    document.getElementById('tradAfterTax').textContent = fmt(tradAfterTax) + ' (after ' + (retireRate * 100) + '% tax)';

    if (netAdvantage >= 0) {
      document.getElementById('advantage').textContent = '+' + fmt(netAdvantage) + ' (Roth wins)';
      document.getElementById('advantage').style.color = '#16a34a';
    } else {
      document.getElementById('advantage').textContent = fmt(netAdvantage) + ' (Traditional wins)';
      document.getElementById('advantage').style.color = '#dc2626';
    }

    if (breakEvenYear === 0) {
      document.getElementById('breakEven').textContent = 'Immediate (Roth favored)';
    } else if (breakEvenYear > 50) {
      document.getElementById('breakEven').textContent = '50+ years (Traditional favored)';
    } else {
      document.getElementById('breakEven').textContent = 'Year ' + breakEvenYear + ' (' + (new Date().getFullYear() + breakEvenYear) + ')';
    }

    var tip = 'Converting ' + fmt(conversionAmount) + ' at ' + (currentRate * 100) + '% costs ' + fmt(taxOwed) + ' in tax now. ';
    if (netAdvantage > 0) {
      tip += 'The Roth conversion is projected to be worth ' + fmt(Math.abs(netAdvantage)) + ' more after ' + years + ' years.';
    } else {
      tip += 'Keeping the traditional IRA is projected to be worth ' + fmt(Math.abs(netAdvantage)) + ' more after ' + years + ' years.';
    }
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
