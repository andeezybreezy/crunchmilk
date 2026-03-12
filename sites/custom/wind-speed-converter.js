(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var windValue = parseFloat(document.getElementById('windValue').value) || 0;
    var fromUnit = document.getElementById('fromUnit').value;

    // Calculation logic
    var mphVal;
    if (fromUnit === 'mph') mphVal = windValue;
    else if (fromUnit === 'kmh') mphVal = windValue * 0.621371;
    else if (fromUnit === 'kts') mphVal = windValue * 1.15078;
    else if (fromUnit === 'ms') mphVal = windValue * 2.23694;
    else {
      var beaufortSpeeds = [0,1,4,8,13,19,25,32,39,47,55,64,73];
      var b = Math.min(12, Math.max(0, Math.round(windValue)));
      mphVal = beaufortSpeeds[b];
    }
    var kmhVal = mphVal * 1.60934;
    var ktsVal = mphVal * 0.868976;
    var msVal = mphVal * 0.44704;
    var bft;
    if (mphVal < 1) bft = 0;
    else if (mphVal < 4) bft = 1;
    else if (mphVal < 8) bft = 2;
    else if (mphVal < 13) bft = 3;
    else if (mphVal < 19) bft = 4;
    else if (mphVal < 25) bft = 5;
    else if (mphVal < 32) bft = 6;
    else if (mphVal < 39) bft = 7;
    else if (mphVal < 47) bft = 8;
    else if (mphVal < 55) bft = 9;
    else if (mphVal < 64) bft = 10;
    else if (mphVal < 73) bft = 11;
    else bft = 12;
    var descs = ['Calm','Light air','Light breeze','Gentle breeze','Moderate breeze','Fresh breeze','Strong breeze','Near gale','Gale','Strong gale','Storm','Violent storm','Hurricane force'];
    document.getElementById('mph').textContent = fmt(mphVal, 1) + ' mph';
    document.getElementById('kmh').textContent = fmt(kmhVal, 1) + ' km/h';
    document.getElementById('kts').textContent = fmt(ktsVal, 1) + ' knots';
    document.getElementById('ms').textContent = fmt(msVal, 1) + ' m/s';
    document.getElementById('beaufort').textContent = 'Force ' + bft;
    document.getElementById('description').textContent = descs[bft];

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['windValue', 'fromUnit'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
