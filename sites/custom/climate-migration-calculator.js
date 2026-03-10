(function() {
  'use strict';

  var cities = {
    'Miami, FL': {flood:95,wildfire:15,hurricane:90,heat:85,drought:40,overall:82,col:120,insurance:4200,medianHome:550000},
    'Houston, TX': {flood:90,wildfire:10,hurricane:80,heat:90,drought:50,overall:76,col:96,insurance:3800,medianHome:320000},
    'New Orleans, LA': {flood:95,wildfire:5,hurricane:85,heat:80,drought:25,overall:78,col:95,insurance:4500,medianHome:280000},
    'Phoenix, AZ': {flood:20,wildfire:40,hurricane:5,heat:98,drought:90,overall:62,col:103,insurance:1800,medianHome:420000},
    'Las Vegas, NV': {flood:15,wildfire:35,hurricane:5,heat:95,drought:95,overall:60,col:102,insurance:1500,medianHome:400000},
    'Los Angeles, CA': {flood:25,wildfire:85,hurricane:5,heat:70,drought:80,overall:58,col:166,insurance:2800,medianHome:950000},
    'San Francisco, CA': {flood:30,wildfire:60,hurricane:5,heat:30,drought:75,overall:46,col:180,insurance:2200,medianHome:1200000},
    'Jacksonville, FL': {flood:80,wildfire:20,hurricane:75,heat:80,drought:30,overall:70,col:95,insurance:3500,medianHome:310000},
    'Tampa, FL': {flood:85,wildfire:15,hurricane:80,heat:82,drought:35,overall:74,col:100,insurance:4000,medianHome:380000},
    'Dallas, TX': {flood:45,wildfire:25,hurricane:30,heat:88,drought:60,overall:55,col:102,insurance:2800,medianHome:350000},
    'Atlanta, GA': {flood:40,wildfire:15,hurricane:35,heat:78,drought:40,overall:45,col:107,insurance:1800,medianHome:380000},
    'Nashville, TN': {flood:50,wildfire:10,hurricane:20,heat:72,drought:35,overall:40,col:102,insurance:1600,medianHome:400000},
    'Denver, CO': {flood:30,wildfire:50,hurricane:5,heat:45,drought:55,overall:35,col:112,insurance:1800,medianHome:550000},
    'Portland, OR': {flood:25,wildfire:55,hurricane:5,heat:40,drought:35,overall:33,col:115,insurance:1200,medianHome:520000},
    'Seattle, WA': {flood:25,wildfire:40,hurricane:5,heat:30,drought:30,overall:28,col:150,insurance:1100,medianHome:780000},
    'Chicago, IL': {flood:40,wildfire:5,hurricane:5,heat:50,drought:25,overall:28,col:107,insurance:1400,medianHome:310000},
    'Boston, MA': {flood:45,wildfire:5,hurricane:30,heat:45,drought:20,overall:32,col:148,insurance:1800,medianHome:680000},
    'Minneapolis, MN': {flood:35,wildfire:10,hurricane:5,heat:30,drought:20,overall:22,col:103,insurance:1200,medianHome:330000},
    'Madison, WI': {flood:30,wildfire:5,hurricane:5,heat:28,drought:18,overall:20,col:105,insurance:1000,medianHome:340000},
    'Buffalo, NY': {flood:30,wildfire:5,hurricane:10,heat:20,drought:15,overall:18,col:87,insurance:900,medianHome:220000},
    'Burlington, VT': {flood:25,wildfire:5,hurricane:10,heat:18,drought:12,overall:16,col:112,insurance:800,medianHome:380000},
    'Duluth, MN': {flood:20,wildfire:15,hurricane:5,heat:10,drought:15,overall:14,col:92,insurance:700,medianHome:220000},
    'Portland, ME': {flood:30,wildfire:5,hurricane:15,heat:20,drought:10,overall:18,col:110,insurance:900,medianHome:400000},
    'Asheville, NC': {flood:35,wildfire:10,hurricane:15,heat:35,drought:25,overall:25,col:105,insurance:1100,medianHome:370000},
    'Pittsburgh, PA': {flood:35,wildfire:5,hurricane:5,heat:35,drought:15,overall:22,col:93,insurance:1000,medianHome:230000},
    'Richmond, VA': {flood:45,wildfire:10,hurricane:35,heat:65,drought:30,overall:42,col:99,insurance:1500,medianHome:320000},
    'Charlotte, NC': {flood:35,wildfire:10,hurricane:30,heat:70,drought:35,overall:40,col:100,insurance:1400,medianHome:370000},
    'Raleigh, NC': {flood:35,wildfire:10,hurricane:35,heat:70,drought:30,overall:40,col:102,insurance:1300,medianHome:380000},
    'Salt Lake City, UT': {flood:20,wildfire:45,hurricane:5,heat:50,drought:65,overall:38,col:105,insurance:1200,medianHome:480000},
    'Boise, ID': {flood:20,wildfire:55,hurricane:5,heat:50,drought:50,overall:38,col:104,insurance:1100,medianHome:430000}
  };

  var cityNames = Object.keys(cities).sort();
  var selectors = ['currentCity','targetCity1','targetCity2','targetCity3'];
  selectors.forEach(function(id, si) {
    var sel = document.getElementById(id);
    if (si > 1) {
      var o0 = document.createElement('option');
      o0.value = '';
      o0.textContent = '— None —';
      sel.appendChild(o0);
    }
    cityNames.forEach(function(c) {
      var o = document.createElement('option');
      o.value = c;
      o.textContent = c;
      sel.appendChild(o);
    });
  });

  function fmt(n) { return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmtD(n) { return (n<0?'-':'') + '$' + fmt(Math.abs(n)); }

  var chartData = [
    ['Miami, FL','95','15','90','85','82'],
    ['Houston, TX','90','10','80','90','76'],
    ['Phoenix, AZ','20','40','5','98','62'],
    ['Los Angeles, CA','25','85','5','70','58'],
    ['Denver, CO','30','50','5','45','35'],
    ['Minneapolis, MN','35','10','5','30','22'],
    ['Duluth, MN','20','15','5','10','14']
  ];
  var cb = document.getElementById('chartBody');
  if (cb) {
    chartData.forEach(function(r) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td><td>'+r[4]+'</td>';
      cb.appendChild(tr);
    });
  }

  var shareData = '';

  function riskColor(score) {
    if (score >= 70) return '#dc2626';
    if (score >= 50) return '#ea580c';
    if (score >= 30) return '#ca8a04';
    return '#16a34a';
  }

  function riskLabel(score) {
    if (score >= 70) return 'High Risk';
    if (score >= 50) return 'Moderate-High';
    if (score >= 30) return 'Moderate';
    if (score >= 15) return 'Low-Moderate';
    return 'Low Risk';
  }

  document.getElementById('calcBtn').addEventListener('click', function() {
    var current = document.getElementById('currentCity').value;
    var targets = [];
    ['targetCity1','targetCity2','targetCity3'].forEach(function(id) {
      var v = document.getElementById(id).value;
      if (v && v !== current) targets.push(v);
    });

    var income = parseFloat(document.getElementById('hhIncome').value) || 75000;

    if (!current || targets.length === 0) { alert('Please select your current city and at least one target.'); return; }

    var cc = cities[current];

    // Find best target
    var bestTarget = targets[0];
    var bestData = cities[targets[0]];
    targets.forEach(function(t) {
      if (cities[t].overall < cities[bestTarget].overall) {
        bestTarget = t;
        bestData = cities[t];
      }
    });

    var riskReduction = cc.overall - bestData.overall;
    var movingCost = 8000 + income * 0.05; // base + adjustment

    document.getElementById('rCurrentRisk').textContent = cc.overall + '/100';
    document.getElementById('rCurrentRisk').style.color = riskColor(cc.overall);
    document.getElementById('rTargetRisk').textContent = bestData.overall + '/100';
    document.getElementById('rTargetRisk').style.color = riskColor(bestData.overall);
    document.getElementById('rReduction').textContent = riskReduction > 0 ? '-' + riskReduction + ' points' : '+' + Math.abs(riskReduction) + ' points';
    document.getElementById('rReduction').style.color = riskReduction > 0 ? '#16a34a' : '#dc2626';
    document.getElementById('rMoveCost').textContent = fmtD(Math.round(movingCost));

    var d = '';

    // Current city card
    d += '<div style="padding:12px;background:#fef2f2;border-radius:8px;margin-bottom:12px">';
    d += '<strong>' + current + ' — ' + riskLabel(cc.overall) + ' (' + cc.overall + '/100)</strong><br>';
    d += '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-top:8px;font-size:0.75rem;text-align:center">';
    d += '<div>Flood<br><strong style="color:' + riskColor(cc.flood) + '">' + cc.flood + '</strong></div>';
    d += '<div>Fire<br><strong style="color:' + riskColor(cc.wildfire) + '">' + cc.wildfire + '</strong></div>';
    d += '<div>Hurricane<br><strong style="color:' + riskColor(cc.hurricane) + '">' + cc.hurricane + '</strong></div>';
    d += '<div>Heat<br><strong style="color:' + riskColor(cc.heat) + '">' + cc.heat + '</strong></div>';
    d += '<div>Drought<br><strong style="color:' + riskColor(cc.drought) + '">' + cc.drought + '</strong></div>';
    d += '</div>';
    d += '<div style="margin-top:8px;font-size:0.85rem">Insurance: ' + fmtD(cc.insurance) + '/yr | COL Index: ' + cc.col + ' | Median Home: ' + fmtD(cc.medianHome) + '</div>';
    d += '</div>';

    // Target cities
    targets.forEach(function(t) {
      var tc = cities[t];
      var isBest = t === bestTarget;
      var colDiff = ((tc.col - cc.col) / cc.col) * 100;
      var insuranceSave = cc.insurance - tc.insurance;
      var incomeAdj = income * (tc.col / cc.col);

      d += '<div style="padding:12px;background:' + (isBest ? '#f0fdf4' : '#f9fafb') + ';border-radius:8px;margin-bottom:12px;border:' + (isBest ? '2px solid #16a34a' : 'none') + '">';
      d += '<strong>' + t + ' — ' + riskLabel(tc.overall) + ' (' + tc.overall + '/100)' + (isBest ? ' ⭐ Best Option' : '') + '</strong><br>';
      d += '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-top:8px;font-size:0.75rem;text-align:center">';
      d += '<div>Flood<br><strong style="color:' + riskColor(tc.flood) + '">' + tc.flood + '</strong></div>';
      d += '<div>Fire<br><strong style="color:' + riskColor(tc.wildfire) + '">' + tc.wildfire + '</strong></div>';
      d += '<div>Hurricane<br><strong style="color:' + riskColor(tc.hurricane) + '">' + tc.hurricane + '</strong></div>';
      d += '<div>Heat<br><strong style="color:' + riskColor(tc.heat) + '">' + tc.heat + '</strong></div>';
      d += '<div>Drought<br><strong style="color:' + riskColor(tc.drought) + '">' + tc.drought + '</strong></div>';
      d += '</div>';
      d += '<div style="margin-top:8px;font-size:0.85rem">';
      d += 'Insurance: ' + fmtD(tc.insurance) + '/yr (' + (insuranceSave > 0 ? '<span style="color:#16a34a">save ' + fmtD(insuranceSave) + '</span>' : '<span style="color:#dc2626">+' + fmtD(Math.abs(insuranceSave)) + '</span>') + ')<br>';
      d += 'COL Index: ' + tc.col + ' (' + (colDiff > 0 ? '+' : '') + colDiff.toFixed(1) + '%) | Median Home: ' + fmtD(tc.medianHome) + '<br>';
      d += 'Income equivalent needed: ' + fmtD(Math.round(incomeAdj));
      d += '</div></div>';
    });

    d += '<div style="padding:12px;background:#f0fdf4;border-radius:8px;font-size:0.9rem">';
    d += '<strong>Recommendation</strong><br>';
    if (riskReduction >= 30) {
      d += 'Moving to ' + bestTarget + ' would significantly reduce your climate risk by ' + riskReduction + ' points. ';
    } else if (riskReduction >= 15) {
      d += 'Moving to ' + bestTarget + ' offers a moderate climate risk improvement of ' + riskReduction + ' points. ';
    } else {
      d += 'The climate risk difference to ' + bestTarget + ' is modest (' + riskReduction + ' points). ';
    }
    var bestInsuranceSave = cc.insurance - bestData.insurance;
    if (bestInsuranceSave > 500) {
      d += 'You could also save ~' + fmtD(bestInsuranceSave) + '/yr on insurance.';
    }
    d += '</div>';

    document.getElementById('resultDetails').innerHTML = d;
    var res = document.getElementById('result');
    res.classList.add('visible');
    res.style.display = 'block';
    res.scrollIntoView({behavior:'smooth',block:'nearest'});

    shareData = 'My city (' + current + ') has a climate risk score of ' + cc.overall + '/100. Moving to ' + bestTarget + ' would drop it to ' + bestData.overall + '/100. Check your city\'s risk: ' + window.location.href;
  });

  document.getElementById('shareBtn').addEventListener('click', function() {
    if (!shareData) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareData).then(function() {
        var btn = document.getElementById('shareBtn');
        btn.textContent = '✓ Copied to clipboard!';
        setTimeout(function() { btn.textContent = '📋 Share Your Result'; }, 2000);
      });
    } else {
      var ta = document.createElement('textarea');
      ta.value = shareData;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      var btn = document.getElementById('shareBtn');
      btn.textContent = '✓ Copied to clipboard!';
      setTimeout(function() { btn.textContent = '📋 Share Your Result'; }, 2000);
    }
  });

})();
