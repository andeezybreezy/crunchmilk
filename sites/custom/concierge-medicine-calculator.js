(function() {
  'use strict';

  function fmt(n) { return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmtD(n) { return (n<0?'-':'') + '$' + fmt(Math.abs(n)); }

  var chartData = [
    ['Low (2 visits/yr)','$6,400','$4,800','$1,600','Concierge'],
    ['Moderate (6 visits/yr)','$7,600','$4,800','$2,800','Concierge'],
    ['High (12 visits/yr)','$9,200','$4,800','$4,400','Concierge'],
    ['Chronic condition','$11,500','$8,200','$3,300','Concierge'],
    ['Major surgery year','$13,000','$14,500','-$1,500','Traditional'],
    ['Multiple specialists','$14,800','$12,000','$2,800','Concierge']
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
    var age = parseInt(document.getElementById('age').value) || 40;
    var premium = parseFloat(document.getElementById('premium').value) || 0;
    var deductible = parseFloat(document.getElementById('deductible').value) || 0;
    var copays = parseFloat(document.getElementById('copays').value) || 0;
    var rxMonthly = parseFloat(document.getElementById('rxMonthly').value) || 0;
    var visits = parseInt(document.getElementById('visits').value) || 4;

    if (premium <= 0) { alert('Please enter your monthly premium.'); return; }

    // Traditional insurance annual cost
    var tradPremiums = premium * 12;
    var tradDeductibleSpend = Math.min(deductible, deductible * 0.6); // avg person spends ~60% of deductible
    var tradCopays = copays;
    var tradRx = rxMonthly * 12;
    var tradTotal = tradPremiums + tradDeductibleSpend + tradCopays + tradRx;

    // Concierge/DPC costs
    var dpcMonthly = age < 30 ? 150 : age < 50 ? 200 : age < 65 ? 250 : 300;
    var dpcAnnual = dpcMonthly * 12;

    // Catastrophic plan premium (varies by age)
    var catMonthly = age < 30 ? 150 : age < 40 ? 180 : age < 50 ? 220 : age < 60 ? 280 : 350;
    var catAnnual = catMonthly * 12;
    var catDeductible = 9200; // typical catastrophic deductible

    // DPC Rx savings (wholesale pricing typically 50-70% cheaper)
    var dpcRx = rxMonthly * 12 * 0.35;

    var conciergeTotal = dpcAnnual + catAnnual + dpcRx;

    var savings = tradTotal - conciergeTotal;
    var savingsPerMonth = savings / 12;

    // Break-even: at how many visits does concierge become better?
    // In traditional: each visit costs copay (~$30-50)
    // In concierge: visits are free (included in membership)
    var copayPerVisit = visits > 0 ? copays / visits : 35;
    var fixedDiff = (tradPremiums + tradRx) - (dpcAnnual + catAnnual + dpcRx);
    var breakEvenVisits = copayPerVisit > 0 ? Math.ceil(Math.abs(fixedDiff) / copayPerVisit) : 'N/A';

    document.getElementById('rTraditional').textContent = fmtD(Math.round(tradTotal));
    document.getElementById('rTraditional').style.color = tradTotal > conciergeTotal ? '#dc2626' : '#059669';
    document.getElementById('rConcierge').textContent = fmtD(Math.round(conciergeTotal));
    document.getElementById('rConcierge').style.color = conciergeTotal < tradTotal ? '#059669' : '#dc2626';
    document.getElementById('rSavings').textContent = savings > 0 ? fmtD(Math.round(savings)) + '/yr' : '-' + fmtD(Math.round(Math.abs(savings))) + '/yr';
    document.getElementById('rSavings').style.color = savings > 0 ? '#059669' : '#dc2626';
    document.getElementById('rBreakeven').textContent = typeof breakEvenVisits === 'number' ? breakEvenVisits + ' visits' : breakEvenVisits;

    var winner = savings > 0 ? 'Concierge' : 'Traditional';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">';

    d += '<div style="padding:12px;background:' + (savings <= 0 ? '#f0fdf4' : '#fef2f2') + ';border-radius:8px">';
    d += '<strong>Traditional Insurance</strong><br>';
    d += 'Premiums: ' + fmtD(tradPremiums) + '/yr<br>';
    d += 'Deductible spending: ~' + fmtD(Math.round(tradDeductibleSpend)) + '<br>';
    d += 'Copays (' + visits + ' visits): ' + fmtD(tradCopays) + '<br>';
    d += 'Prescriptions: ' + fmtD(tradRx) + '<br>';
    d += '<strong style="font-size:1.1rem">Total: ' + fmtD(Math.round(tradTotal)) + '/yr</strong>';
    d += '</div>';

    d += '<div style="padding:12px;background:' + (savings > 0 ? '#f0fdf4' : '#fef2f2') + ';border-radius:8px">';
    d += '<strong>Concierge + Catastrophic</strong><br>';
    d += 'DPC membership: ' + fmtD(dpcAnnual) + '/yr (' + fmtD(dpcMonthly) + '/mo)<br>';
    d += 'Catastrophic plan: ' + fmtD(catAnnual) + '/yr (' + fmtD(catMonthly) + '/mo)<br>';
    d += 'Rx (wholesale): ' + fmtD(Math.round(dpcRx)) + '<br>';
    d += 'Copays: $0 (unlimited visits)<br>';
    d += '<strong style="font-size:1.1rem">Total: ' + fmtD(Math.round(conciergeTotal)) + '/yr</strong>';
    d += '</div></div>';

    d += '<div style="padding:12px;background:#f5f3ff;border-radius:8px;margin-bottom:12px">';
    d += '<strong style="color:#7c3aed">' + winner + ' wins by ' + fmtD(Math.round(Math.abs(savings))) + '/year</strong>';
    if (savings > 0) {
      d += ' (' + fmtD(Math.round(savingsPerMonth)) + '/month)';
    }
    d += '</div>';

    d += '<div style="padding:12px;background:#f9fafb;border-radius:8px;margin-bottom:12px">';
    d += '<strong>What Concierge/DPC Includes</strong>';
    d += '<ul style="margin:8px 0 0 0;padding-left:20px;font-size:0.9rem">';
    d += '<li>Unlimited office visits (same-day/next-day available)</li>';
    d += '<li>30-60 minute appointments (vs 7-15 min traditional)</li>';
    d += '<li>Direct phone/text/email access to your doctor</li>';
    d += '<li>Basic lab work and screenings included</li>';
    d += '<li>Wholesale prescription pricing (50-90% off retail)</li>';
    d += '<li>Minor procedures included (stitches, joint injections, etc.)</li>';
    d += '</ul></div>';

    d += '<div style="padding:10px;background:#fefce8;border-radius:8px;font-size:0.85rem;color:#854d0e">';
    d += '⚠️ <strong>Important:</strong> Catastrophic plans have high deductibles (~' + fmtD(catDeductible) + '). You\'d pay more out-of-pocket for hospitalizations, surgery, or specialist care until reaching the deductible. Best for generally healthy individuals.';
    d += '</div>';

    document.getElementById('resultDetails').innerHTML = d;
    var res = document.getElementById('result');
    res.classList.add('visible');
    res.style.display = 'block';
    res.scrollIntoView({behavior:'smooth',block:'nearest'});

    shareData = 'Switching to concierge medicine could ' + (savings > 0 ? 'save me ' + fmtD(Math.round(savings)) + '/year' : 'cost me ' + fmtD(Math.round(Math.abs(savings))) + ' more/year') + ' compared to traditional insurance. Compare yours: ' + window.location.href;
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
