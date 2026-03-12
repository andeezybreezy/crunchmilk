(function() {
  'use strict';

  var tipPct = 20;
  var isCustom = false;
  var lastCalc = null;

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

  function updateWhatIf() {
    if (!lastCalc) return;
    var toggle = document.getElementById('whatIfToggle');
    if (!toggle.checked) return;

    var wiPct = parseFloat(document.getElementById('wiTip').value) || 0;
    var wiTip = lastCalc.bill * (wiPct / 100);
    var wiTotal = lastCalc.bill + wiTip;
    var wiPerPerson = wiTotal / lastCalc.people;
    var diff = wiTip - lastCalc.tip;

    document.getElementById('wiOriginal').textContent = fmt(lastCalc.tip);
    document.getElementById('wiNew').textContent = fmt(wiTip);
    document.getElementById('wiDelta').textContent = (diff >= 0 ? '+' : '-') + fmt(Math.abs(diff));
    document.getElementById('wiDelta').style.color = diff >= 0 ? '#dc2626' : '#059669';
    document.getElementById('wiPerPerson').textContent = fmt(wiPerPerson);
  }

  var wiToggle = document.getElementById('whatIfToggle');
  if (wiToggle) {
    wiToggle.addEventListener('change', function() {
      document.getElementById('whatIfControls').style.display = this.checked ? 'block' : 'none';
      if (this.checked) updateWhatIf();
    });
  }
  var wiTip = document.getElementById('wiTip');
  if (wiTip) {
    wiTip.addEventListener('input', function() {
      document.getElementById('wiTipVal').textContent = this.value;
      updateWhatIf();
    });
  }

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

    lastCalc = { bill: bill, people: people, pct: pct, tip: tip };
    document.getElementById('whatIfSection').style.display = 'block';
    // Set slider to current pct
    var wiSlider = document.getElementById('wiTip');
    if (wiSlider) {
      wiSlider.value = pct;
      document.getElementById('wiTipVal').textContent = pct;
    }
    updateWhatIf();
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);

  var inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') calculate();
    });
  });
})();
