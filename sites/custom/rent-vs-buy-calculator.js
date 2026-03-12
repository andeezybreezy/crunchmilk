(function() {
  'use strict';

  var lastCalc = null;

  function fmt(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function fmtD(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function calcMortgagePayment(principal, annualRate, years) {
    var r = annualRate / 100 / 12;
    var n = years * 12;
    if (r === 0) return principal / n;
    return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  function runCalc(homePrice, downPct, mortRate, loanTerm, propTaxRate, insurance, maintPct, monthlyRent, rentIncrease, investReturn, years, appreciationRate) {
    var downPayment = homePrice * (downPct / 100);
    var loanAmount = homePrice - downPayment;
    var monthlyMortgage = calcMortgagePayment(loanAmount, mortRate, loanTerm);
    var monthlyPropTax = (homePrice * propTaxRate / 100) / 12;
    var monthlyInsurance = insurance / 12;
    var monthlyMaint = (homePrice * maintPct / 100) / 12;
    var totalMonthlyBuy = monthlyMortgage + monthlyPropTax + monthlyInsurance + monthlyMaint;

    var totalBuyCost = downPayment;
    var totalRentCost = 0;
    var balance = loanAmount;
    var monthlyR = mortRate / 100 / 12;
    var investBalance = downPayment;
    var monthlyInvestR = investReturn / 100 / 12;
    var currentRent = monthlyRent;
    var currentHomeValue = homePrice;
    var breakEvenYear = 0;

    for (var y = 1; y <= years; y++) {
      for (var m = 0; m < 12; m++) {
        var interestPayment = balance * monthlyR;
        var principalPayment = monthlyMortgage - interestPayment;
        if (principalPayment > balance) principalPayment = balance;
        balance -= principalPayment;
        totalBuyCost += monthlyMortgage + monthlyPropTax + monthlyInsurance + monthlyMaint;
        totalRentCost += currentRent;
        var monthlySavings = totalMonthlyBuy - currentRent;
        if (monthlySavings > 0) {
          investBalance = investBalance * (1 + monthlyInvestR) + monthlySavings;
        } else {
          investBalance = investBalance * (1 + monthlyInvestR);
        }
      }
      currentRent *= (1 + rentIncrease / 100);
      if (appreciationRate !== undefined) {
        currentHomeValue *= (1 + appreciationRate / 100);
      }
    }

    var finalEquity = downPayment + (loanAmount - balance);
    if (appreciationRate !== undefined) {
      finalEquity = currentHomeValue - balance;
    }
    var netBuyFinal = totalBuyCost - finalEquity;
    var netRentFinal = totalRentCost;
    var advantage = netRentFinal - netBuyFinal;

    return {
      totalMonthlyBuy: totalMonthlyBuy,
      monthlyMortgage: monthlyMortgage,
      totalBuyCost: totalBuyCost,
      totalRentCost: totalRentCost,
      finalEquity: finalEquity,
      investBalance: investBalance,
      advantage: advantage,
      homeValue: currentHomeValue
    };
  }

  function calculate() {
    var homePrice = parseFloat(document.getElementById('homePrice').value) || 0;
    var downPct = parseFloat(document.getElementById('downPayment').value) || 20;
    var mortRate = parseFloat(document.getElementById('mortgageRate').value) || 7;
    var loanTerm = parseInt(document.getElementById('loanTerm').value) || 30;
    var propTaxRate = parseFloat(document.getElementById('propTaxRate').value) || 1.2;
    var insurance = parseFloat(document.getElementById('insurance').value) || 1800;
    var maintPct = parseFloat(document.getElementById('maintenance').value) || 1;
    var monthlyRent = parseFloat(document.getElementById('monthlyRent').value) || 0;
    var rentIncrease = parseFloat(document.getElementById('rentIncrease').value) || 3;
    var investReturn = parseFloat(document.getElementById('investReturn').value) || 7;
    var years = parseInt(document.getElementById('compareYears').value) || 10;

    if (homePrice <= 0 || monthlyRent <= 0) return;

    // Run original calculation (no appreciation for backward compat on main display)
    var downPayment = homePrice * (downPct / 100);
    var loanAmount = homePrice - downPayment;
    var monthlyMortgage = calcMortgagePayment(loanAmount, mortRate, loanTerm);
    var monthlyPropTax = (homePrice * propTaxRate / 100) / 12;
    var monthlyInsurance = insurance / 12;
    var monthlyMaint = (homePrice * maintPct / 100) / 12;
    var totalMonthlyBuy = monthlyMortgage + monthlyPropTax + monthlyInsurance + monthlyMaint;

    var totalBuyCost = downPayment;
    var totalRentCost = 0;
    var balance = loanAmount;
    var monthlyR = mortRate / 100 / 12;
    var investBalance = downPayment;
    var monthlyInvestR = investReturn / 100 / 12;
    var currentRent = monthlyRent;
    var breakEvenYear = 0;

    var tbody = document.getElementById('yearlyBody');
    tbody.innerHTML = '';

    for (var y = 1; y <= years; y++) {
      for (var m = 0; m < 12; m++) {
        var interestPayment = balance * monthlyR;
        var principalPayment = monthlyMortgage - interestPayment;
        if (principalPayment > balance) principalPayment = balance;
        balance -= principalPayment;
        totalBuyCost += monthlyMortgage + monthlyPropTax + monthlyInsurance + monthlyMaint;
        totalRentCost += currentRent;
        var monthlySavings = totalMonthlyBuy - currentRent;
        if (monthlySavings > 0) {
          investBalance = investBalance * (1 + monthlyInvestR) + monthlySavings;
        } else {
          investBalance = investBalance * (1 + monthlyInvestR);
        }
      }
      totalBuyCost += 0;
      currentRent *= (1 + rentIncrease / 100);
      var equity = downPayment + (loanAmount - balance);
      var netBuy = totalBuyCost - equity;
      var netRent = totalRentCost - (investBalance - downPayment);
      if (breakEvenYear === 0 && netBuy <= netRent) {
        breakEvenYear = y;
      }
      var tr = document.createElement('tr');
      tr.innerHTML = '<td style="padding:6px;border-bottom:1px solid #eee">' + y + '</td>' +
        '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + fmt(totalBuyCost) + '</td>' +
        '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + fmt(totalRentCost) + '</td>' +
        '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right">' + fmt(equity) + '</td>';
      tbody.appendChild(tr);
    }

    var finalEquity = downPayment + (loanAmount - balance);
    var netBuyFinal = totalBuyCost - finalEquity;
    var netRentFinal = totalRentCost;
    var advantage = netRentFinal - netBuyFinal;
    var advantageLabel = advantage > 0 ? 'Buying saves ' + fmt(Math.abs(advantage)) : 'Renting saves ' + fmt(Math.abs(advantage));

    document.getElementById('mortgagePayment').textContent = fmtD(totalMonthlyBuy);
    document.getElementById('rentPayment').textContent = fmtD(monthlyRent);
    document.getElementById('totalBuy').textContent = fmt(totalBuyCost);
    document.getElementById('totalRent').textContent = fmt(totalRentCost);
    document.getElementById('equityBuilt').textContent = fmt(finalEquity);
    document.getElementById('investValue').textContent = fmt(investBalance);
    document.getElementById('netAdvantage').textContent = advantageLabel;
    document.getElementById('breakEven').textContent = breakEvenYear > 0 ? 'Year ' + breakEvenYear : 'Not within ' + years + ' years';
    document.getElementById('result').classList.add('visible');

    lastCalc = {
      homePrice: homePrice, downPct: downPct, mortRate: mortRate, loanTerm: loanTerm,
      propTaxRate: propTaxRate, insurance: insurance, maintPct: maintPct,
      monthlyRent: monthlyRent, rentIncrease: rentIncrease, investReturn: investReturn,
      years: years, advantage: advantage
    };
    document.getElementById('whatIfSection').style.display = 'block';
    updateWhatIf();
  }

  function updateWhatIf() {
    if (!lastCalc) return;
    var toggle = document.getElementById('whatIfToggle');
    if (!toggle.checked) return;

    var appreciationRate = parseFloat(document.getElementById('wiApprec').value) || 0;
    var rateChange = parseFloat(document.getElementById('wiRate').value) || 0;
    var newRate = lastCalc.mortRate + rateChange;
    if (newRate < 0) newRate = 0;

    var wiResult = runCalc(lastCalc.homePrice, lastCalc.downPct, newRate, lastCalc.loanTerm,
      lastCalc.propTaxRate, lastCalc.insurance, lastCalc.maintPct,
      lastCalc.monthlyRent, lastCalc.rentIncrease, lastCalc.investReturn,
      lastCalc.years, appreciationRate);

    var origLabel = lastCalc.advantage > 0 ? 'Buying saves ' + fmt(Math.abs(lastCalc.advantage)) : 'Renting saves ' + fmt(Math.abs(lastCalc.advantage));
    var newLabel = wiResult.advantage > 0 ? 'Buying saves ' + fmt(Math.abs(wiResult.advantage)) : 'Renting saves ' + fmt(Math.abs(wiResult.advantage));

    document.getElementById('wiOriginal').textContent = origLabel;
    document.getElementById('wiNew').textContent = newLabel;
    document.getElementById('wiHomeValue').textContent = fmt(wiResult.homeValue);
  }

  var wiToggle = document.getElementById('whatIfToggle');
  if (wiToggle) {
    wiToggle.addEventListener('change', function() {
      document.getElementById('whatIfControls').style.display = this.checked ? 'block' : 'none';
      if (this.checked) updateWhatIf();
    });
  }
  var wiApprec = document.getElementById('wiApprec');
  var wiRate = document.getElementById('wiRate');
  if (wiApprec) {
    wiApprec.addEventListener('input', function() {
      document.getElementById('wiApprecVal').textContent = this.value;
      updateWhatIf();
    });
  }
  if (wiRate) {
    wiRate.addEventListener('input', function() {
      var v = parseFloat(this.value);
      document.getElementById('wiRateVal').textContent = (v >= 0 ? '+' : '') + v.toFixed(2);
      updateWhatIf();
    });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
