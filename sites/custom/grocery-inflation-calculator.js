(function() {
  'use strict';

  var items = [
    {name:'Eggs (dozen)',p2020:1.48,p2026:3.89,unit:'dozen'},
    {name:'Milk (gallon)',p2020:3.32,p2026:4.15,unit:'gallon'},
    {name:'Bread (loaf)',p2020:1.98,p2026:2.68,unit:'loaf'},
    {name:'Ground Beef (lb)',p2020:4.17,p2026:5.65,unit:'lb'},
    {name:'Chicken Breast (lb)',p2020:3.24,p2026:4.29,unit:'lb'},
    {name:'Butter (lb)',p2020:3.44,p2026:4.89,unit:'lb'},
    {name:'Bacon (lb)',p2020:5.83,p2026:7.49,unit:'lb'},
    {name:'Cheese (lb)',p2020:5.54,p2026:6.89,unit:'lb'},
    {name:'Rice (5lb bag)',p2020:3.49,p2026:4.29,unit:'bag'},
    {name:'Pasta (1lb box)',p2020:1.28,p2026:1.69,unit:'box'},
    {name:'Canned Beans',p2020:0.89,p2026:1.19,unit:'can'},
    {name:'Bananas (lb)',p2020:0.57,p2026:0.69,unit:'lb'},
    {name:'Apples (lb)',p2020:1.62,p2026:2.09,unit:'lb'},
    {name:'Potatoes (5lb bag)',p2020:2.97,p2026:3.89,unit:'bag'},
    {name:'Onions (lb)',p2020:1.04,p2026:1.39,unit:'lb'},
    {name:'Tomatoes (lb)',p2020:1.98,p2026:2.49,unit:'lb'},
    {name:'Frozen Pizza',p2020:4.49,p2026:5.99,unit:'each'},
    {name:'Cereal (box)',p2020:3.28,p2026:4.49,unit:'box'},
    {name:'Coffee (12oz bag)',p2020:5.49,p2026:7.99,unit:'bag'},
    {name:'Orange Juice (64oz)',p2020:3.49,p2026:4.79,unit:'bottle'},
    {name:'Peanut Butter (16oz)',p2020:2.99,p2026:3.89,unit:'jar'},
    {name:'Sugar (4lb)',p2020:2.49,p2026:3.39,unit:'bag'},
    {name:'Cooking Oil (48oz)',p2020:3.29,p2026:4.89,unit:'bottle'},
    {name:'Yogurt (32oz)',p2020:3.29,p2026:4.19,unit:'tub'},
    {name:'Gas (gallon)',p2020:2.17,p2026:3.29,unit:'gallon'}
  ];

  var sel = document.getElementById('itemSelect');
  items.forEach(function(item, idx) {
    var o = document.createElement('option');
    o.value = idx;
    o.textContent = item.name + ' — $' + item.p2026.toFixed(2);
    sel.appendChild(o);
  });

  var basket = [];
  var basketEl = document.getElementById('basketItems');

  function renderBasket() {
    if (basket.length === 0) {
      basketEl.innerHTML = '<p style="text-align:center;color:var(--text-light);font-size:0.9rem;padding:20px;background:#f9fafb;border-radius:8px">Your basket is empty. Add items above.</p>';
      return;
    }
    var h = '<div style="background:#f9fafb;border-radius:8px;padding:12px;margin-bottom:8px">';
    h += '<div style="display:flex;justify-content:space-between;font-weight:600;font-size:0.8rem;color:var(--text-light);padding-bottom:8px;border-bottom:1px solid #e5e7eb;margin-bottom:4px"><span>Item</span><span>Qty</span></div>';
    basket.forEach(function(b, i) {
      h += '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #f3f4f6">';
      h += '<span style="font-size:0.9rem">' + items[b.idx].name + '</span>';
      h += '<span style="display:flex;align-items:center;gap:8px"><span>' + b.qty + '</span><button type="button" onclick="window._removeBasket(' + i + ')" style="background:none;border:none;color:#dc2626;cursor:pointer;font-size:1.1rem;padding:0 4px">✕</button></span>';
      h += '</div>';
    });
    h += '</div>';
    basketEl.innerHTML = h;
  }

  window._removeBasket = function(i) {
    basket.splice(i, 1);
    renderBasket();
  };

  renderBasket();

  document.getElementById('addItemBtn').addEventListener('click', function() {
    var idx = parseInt(sel.value);
    var qty = parseInt(document.getElementById('itemQty').value) || 1;
    // Check if already in basket
    var existing = basket.find(function(b) { return b.idx === idx; });
    if (existing) {
      existing.qty += qty;
    } else {
      basket.push({idx: idx, qty: qty});
    }
    renderBasket();
  });

  function fmt(n) { return n.toFixed(2); }
  function fmtD(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  var chartData = [
    ['Eggs (dozen)','$1.48','$3.89','$2.41','163%'],
    ['Milk (gallon)','$3.32','$4.15','$0.83','25%'],
    ['Bread (loaf)','$1.98','$2.68','$0.70','35%'],
    ['Ground Beef (lb)','$4.17','$5.65','$1.48','35%'],
    ['Chicken Breast (lb)','$3.24','$4.29','$1.05','32%'],
    ['Butter (lb)','$3.44','$4.89','$1.45','42%'],
    ['Gas (gallon)','$2.17','$3.29','$1.12','52%']
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
    if (basket.length === 0) { alert('Please add items to your basket first.'); return; }

    var total2020 = 0, total2026 = 0;
    var breakdown = [];

    basket.forEach(function(b) {
      var item = items[b.idx];
      var cost2020 = item.p2020 * b.qty;
      var cost2026 = item.p2026 * b.qty;
      total2020 += cost2020;
      total2026 += cost2026;
      var pctInc = ((cost2026 - cost2020) / cost2020) * 100;
      breakdown.push({name: item.name, qty: b.qty, c2020: cost2020, c2026: cost2026, pct: pctInc});
    });

    var totalIncrease = total2026 - total2020;
    var pctIncrease = ((totalIncrease) / total2020) * 100;
    var annualized = (Math.pow(total2026 / total2020, 1/6) - 1) * 100;
    var weeklyExtra = totalIncrease;
    var yearlyExtra = weeklyExtra * 52;

    document.getElementById('rThen').textContent = fmtD(total2020);
    document.getElementById('rNow').textContent = fmtD(total2026);
    document.getElementById('rNow').style.color = '#dc2626';
    document.getElementById('rIncrease').textContent = '+' + fmtD(totalIncrease);
    document.getElementById('rIncrease').style.color = '#dc2626';
    document.getElementById('rRate').textContent = pctIncrease.toFixed(1) + '%';
    document.getElementById('rRate').style.color = '#dc2626';

    // Sort breakdown by pct increase descending
    breakdown.sort(function(a, b) { return b.pct - a.pct; });

    var d = '';
    d += '<div style="margin-bottom:16px"><strong>Item-by-Item Breakdown</strong>';
    breakdown.forEach(function(item) {
      d += '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f3f4f6;font-size:0.9rem">';
      d += '<span>' + item.name + ' ×' + item.qty + '</span>';
      d += '<span>' + fmtD(item.c2020) + ' → <strong style="color:#dc2626">' + fmtD(item.c2026) + '</strong> <span style="color:#dc2626;font-size:0.8rem">(+' + item.pct.toFixed(0) + '%)</span></span>';
      d += '</div>';
    });
    d += '</div>';

    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">';
    d += '<div style="padding:12px;background:#fef2f2;border-radius:8px;text-align:center">';
    d += '<div style="font-size:0.85rem;color:#991b1b">Extra Per Week</div>';
    d += '<div style="font-size:1.3rem;font-weight:700;color:#dc2626">+' + fmtD(weeklyExtra) + '</div>';
    d += '</div>';
    d += '<div style="padding:12px;background:#fef2f2;border-radius:8px;text-align:center">';
    d += '<div style="font-size:0.85rem;color:#991b1b">Extra Per Year</div>';
    d += '<div style="font-size:1.3rem;font-weight:700;color:#dc2626">+' + fmtD(yearlyExtra) + '</div>';
    d += '</div></div>';

    d += '<div style="padding:12px;background:#f9fafb;border-radius:8px;font-size:0.9rem">';
    d += '<strong>Your Personal Inflation</strong>: ' + pctIncrease.toFixed(1) + '% total (' + annualized.toFixed(1) + '% annualized over 6 years)<br>';
    d += '<strong>Official CPI (food)</strong>: ~25% total (~3.8% annualized)<br>';
    d += 'Your basket is ' + (pctIncrease > 25 ? '<strong style="color:#dc2626">' + (pctIncrease - 25).toFixed(0) + '% above</strong>' : '<strong style="color:#059669">' + (25 - pctIncrease).toFixed(0) + '% below</strong>') + ' the official average.';
    d += '</div>';

    document.getElementById('resultDetails').innerHTML = d;
    var res = document.getElementById('result');
    res.classList.add('visible');
    res.style.display = 'block';
    res.scrollIntoView({behavior:'smooth',block:'nearest'});

    shareData = 'My grocery basket costs ' + pctIncrease.toFixed(0) + '% more than in 2020 — that\'s +' + fmtD(yearlyExtra) + '/year extra. What\'s yours? ' + window.location.href;
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
