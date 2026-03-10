(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function fmtDollars(n) {
    var sign = n < 0 ? '-' : '';
    return sign + '$' + fmt(Math.abs(n), 0).replace(/\..*/, '');
  }

  // DOM refs
  var arv = document.getElementById('arv');
  var repairCosts = document.getElementById('repairCosts');
  var wholesaleFee = document.getElementById('wholesaleFee');
  var askingPrice = document.getElementById('askingPrice');
  var arvRule = document.getElementById('arvRule');
  var closingCosts = document.getElementById('closingCosts');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rMAO = document.getElementById('rMAO');
  var rFee = document.getElementById('rFee');
  var rProfit = document.getElementById('rProfit');
  var rViable = document.getElementById('rViable');
  var resultDetails = document.getElementById('resultDetails');

  // Chart
  var chartData = [
    ['$150,000', '$20,000', '$75,000', '$75,000', '$35,000'],
    ['$200,000', '$30,000', '$100,000', '$100,000', '$50,000'],
    ['$250,000', '$40,000', '$125,000', '$125,000', '$65,000'],
    ['$300,000', '$50,000', '$150,000', '$150,000', '$80,000'],
    ['$400,000', '$60,000', '$210,000', '$210,000', '$110,000'],
    ['$500,000', '$75,000', '$265,000', '$265,000', '$140,000']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td><td>' + row[4] + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function getVal(el) {
    var v = parseFloat(el.value);
    return isNaN(v) ? 0 : v;
  }

  function calculate() {
    var arvVal = getVal(arv);
    var repairs = getVal(repairCosts);
    var fee = getVal(wholesaleFee);
    var asking = getVal(askingPrice);
    var rulePct = parseInt(arvRule.value) / 100;
    var closing = getVal(closingCosts);

    if (arvVal <= 0) { hideResult(); return; }

    // MAO = ARV × rule% − repairs − wholesale fee
    var mao = (arvVal * rulePct) - repairs - fee;

    // End buyer's purchase price = MAO + fee (what they pay the wholesaler)
    var endBuyerPrice = mao + fee;

    // End buyer's total cost = purchase + repairs + closing
    var endBuyerTotalCost = endBuyerPrice + repairs + closing;

    // End buyer's potential profit = ARV − total cost
    var endBuyerProfit = arvVal - endBuyerTotalCost;

    // Deal viability
    var isViable = asking > 0 ? asking <= mao : mao > 0;
    var spread = asking > 0 ? mao - asking : 0;

    rMAO.textContent = fmtDollars(Math.max(0, mao));
    rFee.textContent = fmtDollars(fee);
    rFee.style.color = '#059669';
    rProfit.textContent = fmtDollars(endBuyerProfit);
    rProfit.style.color = endBuyerProfit > 0 ? '#059669' : '#dc2626';

    if (asking > 0) {
      rViable.textContent = isViable ? 'YES' : 'NO';
      rViable.style.color = isViable ? '#059669' : '#dc2626';
    } else {
      rViable.textContent = mao > 0 ? 'Possible' : 'Unlikely';
      rViable.style.color = mao > 0 ? '#d97706' : '#dc2626';
    }

    var d = '';

    // Deal breakdown
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>ARV</strong><br>' + fmtDollars(arvVal) + '</div>';
    d += '<div><strong>ARV &times; ' + (rulePct * 100) + '%</strong><br>' + fmtDollars(arvVal * rulePct) + '</div>';
    d += '<div><strong>Minus Repairs</strong><br>-' + fmtDollars(repairs) + '</div>';
    d += '<div><strong>Minus Your Fee</strong><br>-' + fmtDollars(fee) + '</div>';
    d += '<div><strong>= MAO (Your Max Offer)</strong><br><span style="font-weight:700;font-size:1.1rem">' + fmtDollars(Math.max(0, mao)) + '</span></div>';
    if (asking > 0) {
      d += '<div><strong>Seller Asking</strong><br>' + fmtDollars(asking) + '</div>';
    }
    d += '</div>';

    // Viability analysis
    if (asking > 0) {
      d += '<div style="margin-top:16px;padding:12px;border-radius:8px;font-size:0.9rem;';
      if (isViable) {
        d += 'background:#ecfdf5;color:#065f46">';
        d += '<strong>Deal is viable!</strong> Asking price is ' + fmtDollars(Math.abs(spread)) + ' below your MAO. ';
        d += 'You have room to negotiate. ';
        if (spread > fee) {
          d += 'You could even increase your fee to ' + fmtDollars(fee + spread) + '.';
        }
      } else {
        d += 'background:#fef2f2;color:#991b1b">';
        d += '<strong>Deal does NOT work at asking price.</strong> Seller wants ' + fmtDollars(Math.abs(spread)) + ' more than your MAO. ';
        d += 'You\'d need to negotiate the price down to ' + fmtDollars(Math.max(0, mao)) + ' or reduce your fee.';
      }
      d += '</div>';
    }

    // Cash needed
    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Cash Needed to Close</strong>';
    d += '<div style="font-size:0.9rem;margin-top:8px">';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
    d += '<div style="padding:8px;background:#f9fafb;border-radius:6px"><strong>Assignment (you)</strong><br>Earnest money: $500-$2,000<br>Marketing costs: varies</div>';
    d += '<div style="padding:8px;background:#f9fafb;border-radius:6px"><strong>End buyer</strong><br>Purchase: ' + fmtDollars(endBuyerPrice) + '<br>Repairs: ' + fmtDollars(repairs) + '<br>Closing: ' + fmtDollars(closing) + '<br><strong>Total: ' + fmtDollars(endBuyerTotalCost) + '</strong></div>';
    d += '</div></div></div>';

    // End buyer ROI
    if (endBuyerProfit > 0) {
      var roi = (endBuyerProfit / endBuyerTotalCost) * 100;
      d += '<div style="margin-top:12px;padding:12px;background:#f9fafb;border-radius:8px;font-size:0.9rem">';
      d += '<strong>End Buyer ROI:</strong> ' + fmt(roi, 1) + '% (' + fmtDollars(endBuyerProfit) + ' profit on ' + fmtDollars(endBuyerTotalCost) + ' invested)';
      d += '</div>';
    }

    resultDetails.innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  function hideResult() {
    resultEl.classList.remove('visible');
    resultEl.style.display = 'none';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  var inputs = [arv, repairCosts, wholesaleFee, askingPrice, closingCosts];
  inputs.forEach(function(inp) {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') calculate();
      });
    }
  });
  arvRule.addEventListener('change', calculate);

})();
