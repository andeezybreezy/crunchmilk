(function() {
  'use strict';

  var fixedCosts = document.getElementById('fixedCosts');
  var variableCost = document.getElementById('variableCost');
  var sellingPrice = document.getElementById('sellingPrice');
  var calcBtn = document.getElementById('calcBtn');
  var resultDiv = document.getElementById('result');

  var breakEvenUnits = document.getElementById('breakEvenUnits');
  var breakEvenRevenue = document.getElementById('breakEvenRevenue');
  var contribMargin = document.getElementById('contribMargin');
  var contribMarginPct = document.getElementById('contribMarginPct');
  var markupPct = document.getElementById('markupPct');
  var profitTableWrap = document.getElementById('profitTableWrap');
  var profitTableBody = document.getElementById('profitTableBody');

  function fmt(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function fmtInt(n) {
    return Math.ceil(n).toLocaleString('en-US');
  }

  function calculate() {
    var fc = parseFloat(fixedCosts.value) || 0;
    var vc = parseFloat(variableCost.value) || 0;
    var sp = parseFloat(sellingPrice.value) || 0;

    if (sp <= vc) {
      breakEvenUnits.textContent = 'N/A';
      breakEvenRevenue.textContent = 'Price must exceed variable cost';
      contribMargin.textContent = '—';
      contribMarginPct.textContent = '—';
      markupPct.textContent = '—';
      resultDiv.classList.add('visible');
      profitTableWrap.style.display = 'none';
      return;
    }

    var cm = sp - vc;
    var beUnits = Math.ceil(fc / cm);
    var beRevenue = beUnits * sp;
    var cmPct = (cm / sp) * 100;
    var mu = vc > 0 ? ((sp - vc) / vc) * 100 : 0;

    breakEvenUnits.textContent = fmtInt(beUnits);
    breakEvenRevenue.textContent = fmt(beRevenue);
    contribMargin.textContent = fmt(cm) + ' / unit';
    contribMarginPct.textContent = cmPct.toFixed(1) + '%';
    markupPct.textContent = mu.toFixed(1) + '%';

    resultDiv.classList.add('visible');

    // Profit / Loss table at different sales levels
    var levels = [0];
    var quarter = Math.round(beUnits * 0.25);
    var half = Math.round(beUnits * 0.5);
    var threequarter = Math.round(beUnits * 0.75);
    if (quarter > 0) levels.push(quarter);
    if (half > 0 && half !== quarter) levels.push(half);
    if (threequarter > 0 && threequarter !== half) levels.push(threequarter);
    levels.push(beUnits);
    levels.push(Math.round(beUnits * 1.25));
    levels.push(Math.round(beUnits * 1.5));
    levels.push(Math.round(beUnits * 2));

    var rows = '';
    levels.forEach(function(units) {
      var revenue = units * sp;
      var totalCost = fc + (units * vc);
      var profit = revenue - totalCost;
      var profitColor = profit >= 0 ? '#059669' : '#dc2626';
      rows += '<tr><td>' + fmtInt(units) + '</td><td>' + fmt(revenue) + '</td><td>' + fmt(totalCost) + '</td>' +
        '<td style="color:' + profitColor + ';font-weight:700">' + (profit >= 0 ? '+' : '') + fmt(profit) + '</td></tr>';
    });

    profitTableBody.innerHTML = rows;
    profitTableWrap.style.display = 'block';
  }

  calcBtn.addEventListener('click', calculate);

  [fixedCosts, variableCost, sellingPrice].forEach(function(el) {
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });

  calculate();
})();
