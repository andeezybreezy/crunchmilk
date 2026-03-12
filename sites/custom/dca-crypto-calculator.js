(function() {
  'use strict';

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 2;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  function fmtD(n) {
    var sign = n < 0 ? '-' : '';
    return sign + '$' + fmt(Math.abs(n), 0).replace(/\..*/, '');
  }

  var cryptoEl = document.getElementById('crypto');
  var amountEl = document.getElementById('dcaAmount');
  var frequencyEl = document.getElementById('frequency');
  var periodsEl = document.getElementById('periods');
  var startPriceEl = document.getElementById('startPrice');
  var endPriceEl = document.getElementById('endPrice');
  var volatilityEl = document.getElementById('volatility');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  // Update period note
  frequencyEl.addEventListener('change', function() {
    var note = document.getElementById('periodNote');
    var labels = { daily: '365 days = 1 year', weekly: '52 weeks = 1 year', biweekly: '26 bi-weeks = 1 year', monthly: '12 months = 1 year' };
    note.textContent = labels[frequencyEl.value] || '';
  });

  // Default prices based on crypto selection
  cryptoEl.addEventListener('change', function() {
    if (cryptoEl.value === 'bitcoin') {
      startPriceEl.placeholder = 'e.g. 42000';
      endPriceEl.placeholder = 'e.g. 95000';
    } else {
      startPriceEl.placeholder = 'e.g. 2200';
      endPriceEl.placeholder = 'e.g. 3500';
    }
  });

  var chartData = [
    ['2023 Recovery', '$16,500', '$42,000', '+112%', '+155%', 'Lump sum wins'],
    ['2024 Bull Run', '$42,000', '$95,000', '+85%', '+126%', 'Lump sum wins'],
    ['2022 Bear Market', '$47,000', '$16,500', '-42%', '-65%', 'DCA loses less'],
    ['2021 Volatile Year', '$29,000', '$46,000', '+68%', '+59%', 'DCA wins'],
    ['Flat + Volatile', '$60,000', '$62,000', '+15%', '+3%', 'DCA wins significantly'],
    ['Crash & Recovery', '$60,000', '$60,000', '+22%', '0%', 'DCA wins significantly']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  // Generate a price path between start and end with given volatility
  function generatePricePath(startPrice, endPrice, periods, volatility) {
    var prices = [];
    var volFactor = { low: 0.03, medium: 0.08, high: 0.18 }[volatility] || 0.08;

    // Use a deterministic "pseudo-random" based on inputs for reproducibility
    var seed = startPrice * 7 + endPrice * 13 + periods * 3;
    function pseudoRandom() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    }

    // Generate random walk that ends at endPrice
    var logStart = Math.log(startPrice);
    var logEnd = Math.log(endPrice);
    var rawPath = [0];

    for (var i = 1; i <= periods; i++) {
      var noise = (pseudoRandom() - 0.5) * 2 * volFactor;
      rawPath.push(rawPath[i - 1] + noise);
    }

    // Adjust path to hit exact start and end
    var rawEnd = rawPath[periods];
    for (var j = 0; j <= periods; j++) {
      var t = j / periods;
      var trendValue = logStart + (logEnd - logStart) * t;
      var adjustedNoise = rawPath[j] - rawPath[0] - (rawEnd - rawPath[0]) * t;
      // Dampen noise at endpoints
      var dampening = 4 * t * (1 - t); // peaks at 0.5
      prices.push(Math.exp(trendValue + adjustedNoise * dampening));
    }

    return prices;
  }

  function getVal(el) { var v = parseFloat(el.value); return isNaN(v) ? 0 : v; }

  function calculate() {
    var amount = getVal(amountEl);
    var periods = getVal(periodsEl);
    var startPrice = getVal(startPriceEl);
    var endPrice = getVal(endPriceEl);
    var volatility = volatilityEl.value;
    var crypto = cryptoEl.value;

    if (amount <= 0 || periods <= 0 || startPrice <= 0 || endPrice <= 0) return;

    var prices = generatePricePath(startPrice, endPrice, periods, volatility);
    var totalInvested = amount * periods;
    var totalCoins = 0;

    var purchases = [];
    for (var i = 0; i < periods; i++) {
      var price = prices[i];
      var coins = amount / price;
      totalCoins += coins;
      purchases.push({ period: i + 1, price: price, coins: coins, totalCoins: totalCoins, totalInvested: amount * (i + 1) });
    }

    var avgCostBasis = totalInvested / totalCoins;
    var currentValue = totalCoins * endPrice;
    var dcaROI = ((currentValue - totalInvested) / totalInvested) * 100;
    var dcaProfit = currentValue - totalInvested;

    // Lump sum comparison
    var lumpCoins = totalInvested / startPrice;
    var lumpValue = lumpCoins * endPrice;
    var lumpROI = ((lumpValue - totalInvested) / totalInvested) * 100;
    var lumpProfit = lumpValue - totalInvested;

    var coinLabel = crypto === 'bitcoin' ? 'BTC' : 'ETH';

    document.getElementById('rInvested').textContent = fmtD(totalInvested);
    document.getElementById('rValue').textContent = fmtD(currentValue);
    document.getElementById('rROI').textContent = (dcaROI >= 0 ? '+' : '') + fmt(dcaROI, 1) + '%';
    document.getElementById('rROI').style.color = dcaROI >= 0 ? '#059669' : '#dc2626';
    document.getElementById('rBasis').textContent = '$' + fmt(avgCostBasis, 2);

    var d = '';

    // DCA vs Lump Sum comparison
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">';

    d += '<div style="padding:14px;background:#fffbeb;border-radius:8px;border-left:4px solid #f59e0b">';
    d += '<strong style="color:#f59e0b">DCA Strategy</strong><br>';
    d += 'Total invested: ' + fmtD(totalInvested) + '<br>';
    d += 'Coins acquired: ' + fmt(totalCoins, 2) + ' ' + coinLabel + '<br>';
    d += 'Avg cost basis: $' + fmt(avgCostBasis, 2) + '<br>';
    d += 'Current value: <strong>' + fmtD(currentValue) + '</strong><br>';
    d += 'Profit/Loss: <strong style="color:' + (dcaProfit >= 0 ? '#059669' : '#dc2626') + '">' + (dcaProfit >= 0 ? '+' : '') + fmtD(dcaProfit) + '</strong><br>';
    d += 'ROI: <strong>' + (dcaROI >= 0 ? '+' : '') + fmt(dcaROI, 1) + '%</strong>';
    d += '</div>';

    d += '<div style="padding:14px;background:#f9fafb;border-radius:8px;border-left:4px solid #6b7280">';
    d += '<strong>Lump Sum (All at Start)</strong><br>';
    d += 'Total invested: ' + fmtD(totalInvested) + '<br>';
    d += 'Coins acquired: ' + fmt(lumpCoins, 2) + ' ' + coinLabel + '<br>';
    d += 'Buy price: $' + fmt(startPrice, 2) + '<br>';
    d += 'Current value: <strong>' + fmtD(lumpValue) + '</strong><br>';
    d += 'Profit/Loss: <strong style="color:' + (lumpProfit >= 0 ? '#059669' : '#dc2626') + '">' + (lumpProfit >= 0 ? '+' : '') + fmtD(lumpProfit) + '</strong><br>';
    d += 'ROI: <strong>' + (lumpROI >= 0 ? '+' : '') + fmt(lumpROI, 1) + '%</strong>';
    d += '</div>';

    d += '</div>';

    // Winner
    var dcaWins = dcaROI > lumpROI;
    d += '<div style="padding:14px;background:' + (dcaWins ? '#fffbeb' : '#f9fafb') + ';border-radius:8px;margin-bottom:16px;font-size:0.9rem">';
    if (dcaWins) {
      d += '<strong style="color:#f59e0b">DCA outperforms lump sum by ' + fmtD(currentValue - lumpValue) + '</strong><br>';
      d += 'The price volatility along the path allowed DCA to accumulate coins at lower average prices.';
    } else {
      d += '<strong>Lump sum outperforms DCA by ' + fmtD(lumpValue - currentValue) + '</strong><br>';
      d += 'The generally upward price path meant buying earlier captured more gains. DCA still reduced timing risk.';
    }
    d += '</div>';

    // Milestone table
    var milestones = [];
    var step = Math.max(1, Math.floor(periods / 8));
    for (var m = step; m < periods; m += step) { milestones.push(m); }
    milestones.push(periods - 1);

    d += '<div style="font-size:0.85rem">';
    d += '<strong>DCA Accumulation Progress</strong>';
    d += '<table style="width:100%;border-collapse:collapse;margin-top:8px">';
    d += '<tr style="border-bottom:2px solid #e5e7eb"><th style="text-align:left;padding:6px">Period</th><th style="text-align:right;padding:6px">Price</th><th style="text-align:right;padding:6px">Total ' + coinLabel + '</th><th style="text-align:right;padding:6px">Invested</th><th style="text-align:right;padding:6px">Value</th></tr>';

    milestones.forEach(function(idx) {
      var p = purchases[idx];
      var val = p.totalCoins * prices[idx];
      d += '<tr style="border-bottom:1px solid #f3f4f6">';
      d += '<td style="padding:6px">' + p.period + '</td>';
      d += '<td style="text-align:right;padding:6px">$' + fmt(p.price, 0) + '</td>';
      d += '<td style="text-align:right;padding:6px">' + fmt(p.totalCoins, 2) + '</td>';
      d += '<td style="text-align:right;padding:6px">' + fmtD(p.totalInvested) + '</td>';
      d += '<td style="text-align:right;padding:6px;color:' + (val >= p.totalInvested ? '#059669' : '#dc2626') + '">' + fmtD(val) + '</td>';
      d += '</tr>';
    });
    d += '</table></div>';

    d += '<div style="padding:12px;background:#fef3c7;border-radius:8px;font-size:0.8rem;margin-top:16px">';
    d += '<strong>Note:</strong> This uses a simulated price path between your start and end prices. Real market paths are unpredictable. Past performance does not indicate future results. Crypto is extremely volatile — never invest more than you can afford to lose. This is not financial advice.';
    d += '</div>';

    document.getElementById('resultDetails').innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  [amountEl, periodsEl, startPriceEl, endPriceEl].forEach(function(inp) {
    if (inp) {
      inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
    }
  });

})();
