(function() {
  'use strict';

  var procedures = {
    hip: {name:'Hip Replacement',us:40364,mexico:13000,thailand:17000,india:7000,turkey:12000,costarica:14500,recovery:14,travel:{mexico:600,thailand:1200,india:1100,turkey:1000,costarica:700}},
    knee: {name:'Knee Replacement',us:35000,mexico:12000,thailand:14000,india:6500,turkey:10000,costarica:12500,recovery:14,travel:{mexico:600,thailand:1200,india:1100,turkey:1000,costarica:700}},
    heart: {name:'Heart Bypass (CABG)',us:123000,mexico:27000,thailand:15000,india:7900,turkey:14000,costarica:25000,recovery:21,travel:{mexico:600,thailand:1200,india:1100,turkey:1000,costarica:700}},
    dental_implant: {name:'Dental Implant',us:5000,mexico:1800,thailand:2700,india:1200,turkey:1000,costarica:2000,recovery:5,travel:{mexico:400,thailand:1000,india:900,turkey:800,costarica:500}},
    dental_crown: {name:'Dental Crown',us:1500,mexico:350,thailand:500,india:250,turkey:300,costarica:400,recovery:3,travel:{mexico:400,thailand:1000,india:900,turkey:800,costarica:500}},
    tummy: {name:'Tummy Tuck',us:8000,mexico:4500,thailand:5000,india:3500,turkey:3800,costarica:4800,recovery:10,travel:{mexico:500,thailand:1100,india:1000,turkey:900,costarica:600}},
    ivf: {name:'IVF Treatment',us:23000,mexico:6500,thailand:8000,india:4500,turkey:5000,costarica:7000,recovery:7,travel:{mexico:500,thailand:1100,india:1000,turkey:900,costarica:600}},
    lasik: {name:'LASIK (both eyes)',us:4400,mexico:1800,thailand:2200,india:1000,turkey:1200,costarica:2000,recovery:3,travel:{mexico:400,thailand:1000,india:900,turkey:800,costarica:500}}
  };

  var countries = ['mexico','thailand','india','turkey','costarica'];
  var countryNames = {mexico:'Mexico',thailand:'Thailand',india:'India',turkey:'Turkey',costarica:'Costa Rica'};
  var qualityRatings = {mexico:'⭐⭐⭐⭐',thailand:'⭐⭐⭐⭐⭐',india:'⭐⭐⭐⭐',turkey:'⭐⭐⭐⭐',costarica:'⭐⭐⭐⭐'};
  var hotelPerNight = {mexico:80,thailand:60,india:40,turkey:55,costarica:75};

  function fmt(n) { return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmtD(n) { return '$' + fmt(Math.abs(n)); }

  var chartData = [
    ['Hip Replacement','$40,364','$13,000','$17,000','$7,000','$12,000'],
    ['Knee Replacement','$35,000','$12,000','$14,000','$6,500','$10,000'],
    ['Heart Bypass','$123,000','$27,000','$15,000','$7,900','$14,000'],
    ['Dental Implant','$5,000','$1,800','$2,700','$1,200','$1,000'],
    ['Tummy Tuck','$8,000','$4,500','$5,000','$3,500','$3,800'],
    ['LASIK (both)','$4,400','$1,800','$2,200','$1,000','$1,200']
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

  document.getElementById('calcBtn').addEventListener('click', function() {
    var procKey = document.getElementById('procedure').value;
    var insType = document.getElementById('insurance').value;
    var proc = procedures[procKey];

    // Calculate US out-of-pocket based on insurance
    var usOOP;
    if (insType === 'none') {
      usOOP = proc.us;
    } else if (insType === 'high') {
      usOOP = Math.min(proc.us, 5000 + (proc.us - 5000) * 0.20);
      usOOP = Math.min(usOOP, 10000); // out of pocket max
    } else if (insType === 'standard') {
      usOOP = Math.min(proc.us, 2000 + (proc.us - 2000) * 0.20);
      usOOP = Math.min(usOOP, 8000);
    } else {
      usOOP = Math.min(proc.us, 500 + (proc.us - 500) * 0.20);
      usOOP = Math.min(usOOP, 5000);
    }

    // Calculate total cost per country
    var results = [];
    countries.forEach(function(c) {
      var procedureCost = proc[c];
      var travelCost = proc.travel[c];
      var hotel = hotelPerNight[c] * proc.recovery;
      var misc = 300; // food, transport, tips
      var totalTrip = procedureCost + travelCost + hotel + misc;
      var savings = usOOP - totalTrip;
      results.push({
        country: c,
        name: countryNames[c],
        procedure: procedureCost,
        travel: travelCost,
        hotel: hotel,
        total: totalTrip,
        savings: savings,
        pct: (savings / usOOP) * 100,
        quality: qualityRatings[c]
      });
    });

    results.sort(function(a, b) { return b.savings - a.savings; });
    var best = results[0];

    document.getElementById('rUS').textContent = fmtD(usOOP);
    document.getElementById('rUS').style.color = '#dc2626';
    document.getElementById('rBest').textContent = best.name + ': ' + fmtD(best.total);
    document.getElementById('rBest').style.color = '#059669';
    document.getElementById('rSavings').textContent = best.savings > 0 ? fmtD(best.savings) : 'No savings';
    document.getElementById('rSavings').style.color = best.savings > 0 ? '#059669' : '#dc2626';
    document.getElementById('rPct').textContent = best.savings > 0 ? best.pct.toFixed(0) + '%' : '0%';
    document.getElementById('rPct').style.color = best.savings > 0 ? '#059669' : '';

    var d = '';
    d += '<div style="margin-bottom:16px"><strong>' + proc.name + ' — Cost Comparison by Country</strong></div>';

    results.forEach(function(r) {
      var isSaving = r.savings > 0;
      d += '<div style="padding:12px;background:' + (isSaving ? '#f0fdf4' : '#fef2f2') + ';border-radius:8px;margin-bottom:8px">';
      d += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">';
      d += '<strong>' + r.name + '</strong>';
      d += '<span style="color:' + (isSaving ? '#059669' : '#dc2626') + ';font-weight:700">' + (isSaving ? 'Save ' + fmtD(r.savings) : 'No savings') + '</span>';
      d += '</div>';
      d += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:4px;font-size:0.8rem;color:#666">';
      d += '<div>Procedure<br><strong style="color:#111">' + fmtD(r.procedure) + '</strong></div>';
      d += '<div>Flights<br><strong style="color:#111">' + fmtD(r.travel) + '</strong></div>';
      d += '<div>Hotel (' + proc.recovery + 'n)<br><strong style="color:#111">' + fmtD(r.hotel) + '</strong></div>';
      d += '<div>Total<br><strong style="color:#111">' + fmtD(r.total) + '</strong></div>';
      d += '</div>';
      d += '<div style="font-size:0.8rem;margin-top:6px">Quality: ' + r.quality + '</div>';
      d += '</div>';
    });

    d += '<div style="padding:12px;background:#f9fafb;border-radius:8px;font-size:0.85rem;margin-top:12px">';
    d += '<strong>Your U.S. out-of-pocket estimate: ' + fmtD(usOOP) + '</strong>';
    if (insType !== 'none') {
      d += '<br>Full U.S. price: ' + fmtD(proc.us) + ' (insurance covers the rest, but premiums not included)';
    }
    d += '<br>Recovery time abroad: ~' + proc.recovery + ' days';
    d += '<br><em style="color:#666">Note: International prices include procedure at accredited facilities. Always verify credentials and plan follow-up care.</em>';
    d += '</div>';

    document.getElementById('resultDetails').innerHTML = d;
    var res = document.getElementById('result');
    res.classList.add('visible');
    res.style.display = 'block';
    res.scrollIntoView({behavior:'smooth',block:'nearest'});

    shareData = 'A ' + proc.name + ' costs ' + fmtD(usOOP) + ' in the US but only ' + fmtD(best.total) + ' in ' + best.name + ' (including travel). That\'s ' + fmtD(best.savings) + ' in savings! ' + window.location.href;
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
