(function() {
  'use strict';

  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var monthSel = document.getElementById('birthMonth');
  months.forEach(function(m, i) {
    var o = document.createElement('option');
    o.value = i + 1;
    o.textContent = m;
    monthSel.appendChild(o);
  });

  var chartData = [
    ['1969','195','283,586','Born 1944-1950','Active combat'],
    ['1970','195','162,746','Born 1951','Active combat'],
    ['1971','125','94,092','Born 1952','Winding down'],
    ['1972','95','49,514','Born 1953','Near end'],
    ['1973','None called','646','Born 1954','Draft ended'],
    ['2026','N/A','0','All-volunteer','No active draft']
  ];
  var cb = document.getElementById('chartBody');
  if (cb) {
    chartData.forEach(function(r) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td><td>'+r[4]+'</td>';
      cb.appendChild(tr);
    });
  }

  function hashDate(month, day) {
    // Deterministic lottery number 1-366 from month/day
    var dayOfYear = 0;
    var daysInMonth = [31,29,31,30,31,30,31,31,30,31,30,31];
    for (var i = 0; i < month - 1; i++) dayOfYear += daysInMonth[i];
    dayOfYear += day;

    // Use a simple hash to shuffle (mimics random draw)
    var seed = dayOfYear * 2654435761;
    seed = seed ^ (seed >>> 16);
    seed = Math.abs(seed);
    return (seed % 366) + 1;
  }

  var shareData = '';

  document.getElementById('calcBtn').addEventListener('click', function() {
    var month = parseInt(monthSel.value);
    var day = parseInt(document.getElementById('birthDay').value) || 0;
    var year = parseInt(document.getElementById('birthYear').value) || 0;
    var gender = document.getElementById('gender').value;

    if (!month || day < 1 || day > 31 || year < 1944 || year > 2010) {
      alert('Please enter a valid birthday.');
      return;
    }

    var lotteryNum = hashDate(month, day);
    var currentYear = 2026;
    var age = currentYear - year;

    // Risk assessment
    var riskLevel, riskColor;
    if (lotteryNum <= 95) {
      riskLevel = 'HIGH — Called in all Vietnam draft years';
      riskColor = '#dc2626';
    } else if (lotteryNum <= 125) {
      riskLevel = 'MEDIUM-HIGH — Called in most draft years';
      riskColor = '#ea580c';
    } else if (lotteryNum <= 195) {
      riskLevel = 'MEDIUM — Called in peak draft years only';
      riskColor = '#ca8a04';
    } else if (lotteryNum <= 250) {
      riskLevel = 'LOW — Unlikely to be called';
      riskColor = '#16a34a';
    } else {
      riskLevel = 'VERY LOW — Not called in any Vietnam year';
      riskColor = '#059669';
    }

    // Selective Service status
    var ssStatus;
    if (gender !== 'male') {
      ssStatus = 'Not currently required to register (females/non-binary)';
    } else if (age >= 18 && age <= 25) {
      ssStatus = 'REQUIRED to be registered with Selective Service';
    } else if (age < 18) {
      ssStatus = 'Must register at age 18';
    } else if (age <= 30) {
      ssStatus = 'Past registration age — should have registered at 18';
    } else {
      ssStatus = 'Past Selective Service age';
    }

    // Vietnam era threshold context
    var thresholdText;
    if (lotteryNum <= 95) thresholdText = 'Below ALL Vietnam-era thresholds';
    else if (lotteryNum <= 125) thresholdText = 'Below 1971 threshold (125)';
    else if (lotteryNum <= 195) thresholdText = 'Below 1969-70 threshold (195)';
    else thresholdText = 'Above all Vietnam thresholds';

    document.getElementById('rNumber').textContent = '#' + lotteryNum;
    document.getElementById('rNumber').style.color = riskColor;
    document.getElementById('rRisk').textContent = lotteryNum <= 195 ? 'Would have been called' : 'Likely safe';
    document.getElementById('rRisk').style.color = riskColor;
    document.getElementById('rStatus').textContent = ssStatus;
    document.getElementById('rThreshold').textContent = thresholdText;

    var d = '';
    d += '<div style="padding:16px;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:10px;margin-bottom:16px;text-align:center">';
    d += '<div style="font-size:3rem;font-weight:800;color:#78350f">#' + lotteryNum + '</div>';
    d += '<div style="font-size:1.1rem;color:#92400e">' + months[month-1] + ' ' + day + ' — Lottery Number ' + lotteryNum + ' of 366</div>';
    d += '</div>';

    // Visual bar showing where they fall
    d += '<div style="margin-bottom:16px">';
    d += '<div style="display:flex;justify-content:space-between;font-size:0.75rem;color:#666;margin-bottom:4px"><span>1 (Called first)</span><span>366 (Called last)</span></div>';
    d += '<div style="position:relative;height:30px;background:linear-gradient(to right,#dc2626,#ea580c,#ca8a04,#16a34a,#059669);border-radius:8px;overflow:hidden">';
    var pct = ((lotteryNum - 1) / 365) * 100;
    d += '<div style="position:absolute;left:' + pct + '%;top:0;bottom:0;width:3px;background:#000"></div>';
    d += '<div style="position:absolute;left:' + Math.max(0, pct - 3) + '%;top:-2px;font-size:1.5rem">▼</div>';
    d += '</div>';
    d += '<div style="display:flex;font-size:0.7rem;margin-top:2px"><span style="width:26%;color:#dc2626">High risk (1-95)</span><span style="width:8%;color:#ea580c">Med (96-125)</span><span style="width:19%;color:#ca8a04">Mod (126-195)</span><span style="width:47%;color:#059669;text-align:right">Low risk (196-366)</span></div>';
    d += '</div>';

    d += '<div style="padding:12px;background:#f9fafb;border-radius:8px;margin-bottom:12px">';
    d += '<strong>Historical Context</strong><br>';
    d += 'During the Vietnam War (1964-1975), approximately 2.2 million Americans were drafted. ';
    if (lotteryNum <= 195) {
      d += 'With lottery number #' + lotteryNum + ', you <strong>would have been called</strong> during the peak draft years of 1969-1970.';
    } else {
      d += 'With lottery number #' + lotteryNum + ', you likely <strong>would not have been called</strong>, as the highest threshold was 195.';
    }
    d += '</div>';

    d += '<div style="padding:12px;background:#eff6ff;border-radius:8px;font-size:0.9rem">';
    d += '<strong>Current Status (2026)</strong><br>';
    d += 'Age: ' + age + ' | Gender: ' + gender.charAt(0).toUpperCase() + gender.slice(1) + '<br>';
    d += 'Selective Service: ' + ssStatus + '<br>';
    d += 'There is currently <strong>no active draft</strong>. The U.S. has maintained an all-volunteer military since 1973.';
    d += '</div>';

    document.getElementById('resultDetails').innerHTML = d;
    var res = document.getElementById('result');
    res.classList.add('visible');
    res.style.display = 'block';
    res.scrollIntoView({behavior:'smooth',block:'nearest'});

    shareData = 'My draft lottery number is #' + lotteryNum + ' — ' + (lotteryNum <= 195 ? 'I would have been called during Vietnam.' : 'I would have been safe during Vietnam.') + ' What\'s yours? ' + window.location.href;
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
