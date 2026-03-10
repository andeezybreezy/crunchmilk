(function() {
  'use strict';

  var improvements = {
    elevate: {name:'Home Elevation', baseCost:60000, premiumReduction:0.50, costScale:0.00015, femaEligible:true},
    barrier: {name:'Flood Barriers/Shields', baseCost:8000, premiumReduction:0.12, costScale:0.00003, femaEligible:false},
    sump: {name:'Sump Pump + Battery Backup', baseCost:2200, premiumReduction:0.06, costScale:0, femaEligible:false},
    backflow: {name:'Backflow Valves', baseCost:350, premiumReduction:0.04, costScale:0, femaEligible:false},
    sealant: {name:'Foundation Sealant', baseCost:5000, premiumReduction:0.07, costScale:0.00001, femaEligible:false}
  };

  var zoneMultipliers = {A:1.0, AE:1.0, V:1.3, X:0.3};

  function fmt(n) { return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmtD(n) { return (n<0?'-':'') + '$' + fmt(Math.abs(n)); }

  var chartData = [
    ['Home Elevation','$50,000-$80,000','$1,000-$1,500','5-8','80-200%'],
    ['Flood Barriers','$5,000-$15,000','$250-$500','10-30','10-60%'],
    ['Sump Pump + Battery','$1,500-$3,000','$100-$200','10-15','30-80%'],
    ['Backflow Valves','$200-$500','$50-$100','3-5','100-400%'],
    ['Foundation Sealant','$3,000-$8,000','$125-$250','12-32','5-50%'],
    ['All Combined','$60,000-$107,000','$1,525-$2,550','4-7','120-300%']
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
    var homeValue = parseFloat(document.getElementById('homeValue').value) || 0;
    var zone = document.getElementById('floodZone').value;
    var premium = parseFloat(document.getElementById('currentPremium').value) || 0;

    if (homeValue <= 0 || premium <= 0) { alert('Please enter home value and current premium.'); return; }

    var checks = {
      elevate: document.getElementById('iElevate').checked,
      barrier: document.getElementById('iBarrier').checked,
      sump: document.getElementById('iSump').checked,
      backflow: document.getElementById('iBackflow').checked,
      sealant: document.getElementById('iSealant').checked
    };

    var selected = Object.keys(checks).filter(function(k) { return checks[k]; });
    if (selected.length === 0) { alert('Please select at least one improvement.'); return; }

    var zm = zoneMultipliers[zone] || 1;
    var totalCost = 0;
    var totalReduction = 0;
    var femaEligibleCost = 0;
    var breakdown = [];

    selected.forEach(function(key) {
      var imp = improvements[key];
      var cost = imp.baseCost + (homeValue * imp.costScale);
      var reduction = premium * imp.premiumReduction * zm;
      // Cap total reduction at 75% of premium
      totalCost += cost;
      totalReduction += reduction;
      if (imp.femaEligible) femaEligibleCost += cost;
      breakdown.push({name:imp.name, cost:cost, annualSave:reduction, fema:imp.femaEligible});
    });

    totalReduction = Math.min(totalReduction, premium * 0.75);
    var paybackYears = totalReduction > 0 ? totalCost / totalReduction : 999;
    var tenYearSavings = (totalReduction * 10) - totalCost;
    var femaGrant = femaEligibleCost * 0.75;
    var costAfterFema = totalCost - femaGrant;
    var paybackAfterFema = totalReduction > 0 ? costAfterFema / totalReduction : 999;

    document.getElementById('rCost').textContent = fmtD(Math.round(totalCost));
    document.getElementById('rSavings').textContent = fmtD(Math.round(totalReduction)) + '/yr';
    document.getElementById('rSavings').style.color = '#059669';
    document.getElementById('rPayback').textContent = paybackYears < 99 ? paybackYears.toFixed(1) + ' years' : 'N/A';
    document.getElementById('rTenYear').textContent = fmtD(Math.round(tenYearSavings));
    document.getElementById('rTenYear').style.color = tenYearSavings > 0 ? '#059669' : '#dc2626';

    var d = '';
    d += '<div style="margin-bottom:16px"><strong>Improvement Breakdown</strong>';
    breakdown.forEach(function(b) {
      d += '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:0.9rem">';
      d += '<span>' + b.name + (b.fema ? ' <span style="background:#dbeafe;color:#1d4ed8;padding:1px 6px;border-radius:4px;font-size:0.7rem">FEMA eligible</span>' : '') + '</span>';
      d += '<span>Cost: <strong>' + fmtD(Math.round(b.cost)) + '</strong> → Save <strong style="color:#059669">' + fmtD(Math.round(b.annualSave)) + '/yr</strong></span>';
      d += '</div>';
    });
    d += '</div>';

    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">';
    d += '<div style="padding:12px;background:#f0f9ff;border-radius:8px">';
    d += '<strong>Without FEMA Grant</strong><br>';
    d += 'Total cost: ' + fmtD(Math.round(totalCost)) + '<br>';
    d += 'Payback: ' + (paybackYears < 99 ? paybackYears.toFixed(1) + ' years' : 'N/A') + '<br>';
    d += '10-year net: ' + fmtD(Math.round(tenYearSavings));
    d += '</div>';

    if (femaEligibleCost > 0) {
      d += '<div style="padding:12px;background:#f0fdf4;border-radius:8px">';
      d += '<strong>With FEMA Grant (75%)</strong><br>';
      d += 'FEMA covers: ' + fmtD(Math.round(femaGrant)) + '<br>';
      d += 'Your cost: ' + fmtD(Math.round(costAfterFema)) + '<br>';
      d += 'Payback: ' + (paybackAfterFema < 99 ? paybackAfterFema.toFixed(1) + ' years' : 'N/A') + '<br>';
      d += '10-year net: ' + fmtD(Math.round(totalReduction * 10 - costAfterFema));
      d += '</div>';
    }
    d += '</div>';

    d += '<div style="padding:12px;background:#f9fafb;border-radius:8px;font-size:0.9rem;margin-bottom:12px">';
    d += '<strong>Your Property Details</strong><br>';
    d += 'Home value: ' + fmtD(homeValue) + ' | Flood zone: ' + zone + '<br>';
    d += 'Current premium: ' + fmtD(premium) + '/yr<br>';
    d += 'New estimated premium: ' + fmtD(Math.round(premium - totalReduction)) + '/yr<br>';
    d += 'Premium reduction: ' + ((totalReduction / premium) * 100).toFixed(0) + '%';
    d += '</div>';

    if (zone === 'X') {
      d += '<div style="padding:10px;background:#fefce8;border-radius:8px;font-size:0.85rem;color:#854d0e">💡 You\'re in Zone X (lower risk). Flood-proofing improvements will have a smaller impact on your already-low premium, but they still protect against damage — 25% of flood claims come from Zone X properties.</div>';
    }

    document.getElementById('resultDetails').innerHTML = d;
    var res = document.getElementById('result');
    res.classList.add('visible');
    res.style.display = 'block';
    res.scrollIntoView({behavior:'smooth',block:'nearest'});

    shareData = 'Flood-proofing my home in Zone ' + zone + ' could save ' + fmtD(Math.round(totalReduction)) + '/year on insurance with a ' + paybackYears.toFixed(1) + '-year payback. Calculate yours: ' + window.location.href;
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
