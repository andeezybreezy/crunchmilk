(function() {
  'use strict';

  var blockHeight = document.getElementById('blockHeight');
  var avgBlockTime = document.getElementById('avgBlockTime');
  var currentPrice = document.getElementById('currentPrice');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function calculate() {
    var height = parseInt(blockHeight.value, 10);
    var blockMin = parseFloat(avgBlockTime.value);
    var price = parseFloat(currentPrice.value);

    if (isNaN(height) || height < 0 || isNaN(blockMin) || blockMin <= 0) return;

    var HALVING_INTERVAL = 210000;
    var era = Math.floor(height / HALVING_INTERVAL);
    var currentReward = 50 / Math.pow(2, era);
    var nextHalvingBlock = (era + 1) * HALVING_INTERVAL;
    var blocksRemaining = nextHalvingBlock - height;
    var minutesRemaining = blocksRemaining * blockMin;
    var daysRemaining = Math.round(minutesRemaining / 1440);
    var halvingDate = new Date(Date.now() + minutesRemaining * 60000);
    var nextReward = currentReward / 2;

    var blocksPerDay = 1440 / blockMin;
    var dailyIssuanceNow = currentReward * blocksPerDay;
    var dailyIssuanceAfter = nextReward * blocksPerDay;

    document.getElementById('rEra').textContent = 'Era ' + era + ' (Halving #' + era + ' passed)';
    document.getElementById('rReward').textContent = currentReward + ' BTC';
    document.getElementById('rNextBlock').textContent = nextHalvingBlock.toLocaleString();
    document.getElementById('rBlocksLeft').textContent = blocksRemaining.toLocaleString();
    document.getElementById('rDate').textContent = halvingDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    document.getElementById('rDays').textContent = daysRemaining.toLocaleString() + ' days';
    document.getElementById('rDailyNow').textContent = dailyIssuanceNow.toFixed(2) + ' BTC ($' + Math.round(dailyIssuanceNow * price).toLocaleString() + ')';
    document.getElementById('rDailyAfter').textContent = dailyIssuanceAfter.toFixed(2) + ' BTC ($' + Math.round(dailyIssuanceAfter * price).toLocaleString() + ')';

    var pct = ((height % HALVING_INTERVAL) / HALVING_INTERVAL * 100).toFixed(1);
    document.getElementById('resultTip').textContent = pct + '% through current halving cycle. Reward drops from ' + currentReward + ' to ' + nextReward + ' BTC at block ' + nextHalvingBlock.toLocaleString() + '.';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  [blockHeight, avgBlockTime, currentPrice].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

  calculate();
})();
