(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  var hiveBase = {
    langstroth: 50,
    topbar: 25,
    warre: 30
  };

  var regionFactor = {
    northern: 0.7,
    temperate: 1.0,
    southern: 1.2,
    arid: 0.6
  };

  var experienceFactor = {
    beginner: 0.5,
    intermediate: 0.85,
    experienced: 1.3
  };

  function val(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) || v <= 0 ? 0 : v;
  }

  function sel(id) {
    return document.getElementById(id).value;
  }

  function fmt(n) {
    return Math.round(n).toLocaleString('en-US');
  }

  function calculate() {
    var hives = val('hiveCount');
    var region = sel('region');
    var hiveType = sel('hiveType');
    var experience = sel('experience');

    if (hives <= 0) return;

    var base = hiveBase[hiveType];
    var rf = regionFactor[region];
    var ef = experienceFactor[experience];

    var perHiveLbs = base * rf * ef;
    var totalLbs = perHiveLbs * hives;

    var jars12oz = Math.floor(totalLbs * 16 / 12); // 16 oz per lb, 12 oz jars
    var jars16oz = Math.floor(totalLbs); // 1 lb jars

    var revenue = totalLbs * 10; // $10/lb local price
    var waxLbs = totalLbs / 6.5; // 1 lb wax per 6.5 lbs honey

    document.getElementById('honeyYield').textContent = fmt(totalLbs) + ' lbs';
    document.getElementById('jars12').textContent = fmt(jars12oz) + ' jars';
    document.getElementById('jars16').textContent = fmt(jars16oz) + ' jars';
    document.getElementById('revenue').textContent = '$' + fmt(revenue);
    document.getElementById('waxYield').textContent = waxLbs.toFixed(1) + ' lbs (~$' + fmt(waxLbs * 12) + ')';
    document.getElementById('perHive').textContent = perHiveLbs.toFixed(1) + ' lbs/hive';

    var tip = hives + ' ' + hiveType + ' hive' + (hives > 1 ? 's' : '') + ' in ' + region + ' climate. ';
    if (experience === 'beginner') {
      tip += 'First-year hives may produce little surplus — avoid harvesting if stores are low.';
    } else {
      tip += 'Total revenue with wax: ~$' + fmt(revenue + waxLbs * 12) + ' at market prices.';
    }
    document.getElementById('resultTip').textContent = tip;

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  document.querySelectorAll('input[type="number"]').forEach(function(el) {
    el.addEventListener('input', calculate);
  });
  document.querySelectorAll('select').forEach(function(el) {
    el.addEventListener('change', calculate);
  });

  calculate();
})();
