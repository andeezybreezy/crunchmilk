(function() {
  'use strict';

  var tipPct = 20;
  var isCustom = false;

  function fmt(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Tip toggle
  var tipBtns = document.querySelectorAll('#tipToggle button');
  tipBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      tipBtns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      var val = btn.getAttribute('data-tip');
      if (val === 'custom') {
        isCustom = true;
        document.getElementById('customTipGroup').style.display = '';
      } else {
        isCustom = false;
        tipPct = parseFloat(val);
        document.getElementById('customTipGroup').style.display = 'none';
      }
    });
  });

  function calculate() {
    var bill = parseFloat(document.getElementById('billAmount').value) || 0;
    var people = parseInt(document.getElementById('numPeople').value) || 1;
    if (bill <= 0) return;

    var pct = isCustom ? (parseFloat(document.getElementById('customTip').value) || 0) : tipPct;

    var tip = bill * (pct / 100);
    var total = bill + tip;
    var tipPerPerson = tip / people;
    var totalPerPerson = total / people;

    document.getElementById('tipAmount').textContent = fmt(tip);
    document.getElementById('totalBill').textContent = fmt(total);
    document.getElementById('tipPerson').textContent = fmt(tipPerPerson);
    document.getElementById('totalPerson').textContent = fmt(totalPerPerson);

    // Comparison table
    var comparePcts = [15, 18, 20, 25];
    if (pct && comparePcts.indexOf(pct) === -1) {
      comparePcts.push(pct);
      comparePcts.sort(function(a, b) { return a - b; });
    }

    var tbody = document.getElementById('compareBody');
    tbody.innerHTML = '';
    comparePcts.forEach(function(p) {
      var t = bill * (p / 100);
      var tot = bill + t;
      var pp = tot / people;
      var tr = document.createElement('tr');
      var highlight = (p === pct) ? 'font-weight:bold;' : '';
      tr.innerHTML = '<td style="padding:6px;border-bottom:1px solid #eee;' + highlight + '">' + p + '%</td>' +
        '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right;' + highlight + '">' + fmt(t) + '</td>' +
        '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right;' + highlight + '">' + fmt(tot) + '</td>' +
        '<td style="padding:6px;border-bottom:1px solid #eee;text-align:right;' + highlight + '">' + fmt(pp) + '</td>';
      tbody.appendChild(tr);
    });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
