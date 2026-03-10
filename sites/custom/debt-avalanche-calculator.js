(function() {
  'use strict';

  var debtInputs = document.getElementById('debtInputs');
  var addDebtBtn = document.getElementById('addDebtBtn');
  var extraPayment = document.getElementById('extraPayment');
  var calcBtn = document.getElementById('calcBtn');
  var resultDiv = document.getElementById('result');

  var avInterest = document.getElementById('avInterest');
  var sbInterest = document.getElementById('sbInterest');
  var avMonths = document.getElementById('avMonths');
  var sbMonths = document.getElementById('sbMonths');
  var avDate = document.getElementById('avDate');
  var sbDate = document.getElementById('sbDate');
  var avSaved = document.getElementById('avSaved');

  var payoffOrderWrap = document.getElementById('payoffOrderWrap');
  var payoffOrder = document.getElementById('payoffOrder');
  var scheduleWrap = document.getElementById('scheduleWrap');
  var scheduleHead = document.getElementById('scheduleHead');
  var scheduleBody = document.getElementById('scheduleBody');

  var debtCount = 2;

  function fmt(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function monthsToDate(m) {
    var now = new Date();
    var d = new Date(now.getFullYear(), now.getMonth() + m);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[d.getMonth()] + ' ' + d.getFullYear();
  }

  addDebtBtn.addEventListener('click', function() {
    debtCount++;
    var div = document.createElement('div');
    div.className = 'debt-entry';
    div.style.cssText = 'border:2px solid var(--border);border-radius:8px;padding:16px;margin-bottom:12px';
    div.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><strong>Debt #' + debtCount + '</strong><button type="button" class="remove-debt-btn" style="background:none;border:none;color:#dc2626;cursor:pointer;font-size:1.2rem;padding:4px 8px" title="Remove">&times;</button></div>' +
      '<div class="input-group" style="margin-bottom:8px"><label>Name</label><input type="text" class="debt-name" placeholder="e.g. Student Loan"></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">' +
      '<div class="input-group" style="margin-bottom:0"><label>Balance ($)</label><input type="number" class="debt-balance" min="0" step="100" inputmode="decimal"></div>' +
      '<div class="input-group" style="margin-bottom:0"><label>Min Payment ($)</label><input type="number" class="debt-min" min="0" step="10" inputmode="decimal"></div>' +
      '<div class="input-group" style="margin-bottom:0"><label>Rate (%)</label><input type="number" class="debt-rate" min="0" max="50" step="0.01" inputmode="decimal"></div></div>';
    debtInputs.appendChild(div);
  });

  debtInputs.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-debt-btn')) {
      var entry = e.target.closest('.debt-entry');
      if (debtInputs.children.length > 1) entry.remove();
    }
  });

  function getDebts() {
    var entries = debtInputs.querySelectorAll('.debt-entry');
    var debts = [];
    entries.forEach(function(entry) {
      var name = entry.querySelector('.debt-name').value || 'Unnamed';
      var balance = parseFloat(entry.querySelector('.debt-balance').value) || 0;
      var minPay = parseFloat(entry.querySelector('.debt-min').value) || 0;
      var rate = parseFloat(entry.querySelector('.debt-rate').value) || 0;
      if (balance > 0) {
        debts.push({ name: name, balance: balance, minPay: minPay, rate: rate, monthlyRate: rate / 100 / 12 });
      }
    });
    return debts;
  }

  function simulate(debtsInput, extra, sortFn) {
    var d = debtsInput.map(function(x) {
      return { name: x.name, balance: x.balance, minPay: x.minPay, rate: x.rate, monthlyRate: x.monthlyRate, paidOff: false, paidMonth: 0 };
    });
    d.sort(sortFn);

    var totalInterest = 0;
    var month = 0;
    var maxMonths = 600;
    var schedule = [];
    var payoffList = [];

    while (month < maxMonths) {
      if (d.every(function(x) { return x.paidOff; })) break;
      month++;
      var extraLeft = extra;

      d.forEach(function(debt) {
        if (!debt.paidOff) {
          var interest = debt.balance * debt.monthlyRate;
          debt.balance += interest;
          totalInterest += interest;
        }
      });

      d.forEach(function(debt) {
        if (!debt.paidOff) {
          var payment = Math.min(debt.minPay, debt.balance);
          debt.balance -= payment;
          if (debt.balance <= 0.01) {
            debt.balance = 0;
            debt.paidOff = true;
            debt.paidMonth = month;
            extraLeft += debt.minPay - payment;
            payoffList.push({ name: debt.name, month: month });
          }
        }
      });

      for (var i = 0; i < d.length && extraLeft > 0; i++) {
        if (!d[i].paidOff) {
          var pay = Math.min(extraLeft, d[i].balance);
          d[i].balance -= pay;
          extraLeft -= pay;
          if (d[i].balance <= 0.01) {
            d[i].balance = 0;
            d[i].paidOff = true;
            d[i].paidMonth = month;
            extraLeft += d[i].minPay;
            payoffList.push({ name: d[i].name, month: month });
          }
        }
      }

      var row = { month: month };
      d.forEach(function(debt) { row[debt.name] = debt.balance; });
      schedule.push(row);
    }

    return { totalInterest: totalInterest, months: month, schedule: schedule, payoffList: payoffList, debtOrder: d.map(function(x) { return x.name; }) };
  }

  function calculate() {
    var debts = getDebts();
    if (debts.length === 0) return;
    var extra = parseFloat(extraPayment.value) || 0;

    // Avalanche: highest rate first
    var avResult = simulate(debts, extra, function(a, b) { return b.rate - a.rate; });
    // Snowball: lowest balance first
    var sbResult = simulate(debts, extra, function(a, b) { return a.balance - b.balance; });

    avInterest.textContent = fmt(avResult.totalInterest);
    sbInterest.textContent = fmt(sbResult.totalInterest);
    avMonths.textContent = avResult.months + ' months';
    sbMonths.textContent = sbResult.months + ' months';
    avDate.textContent = monthsToDate(avResult.months);
    sbDate.textContent = monthsToDate(sbResult.months);

    var saved = sbResult.totalInterest - avResult.totalInterest;
    avSaved.textContent = 'Avalanche saves ' + fmt(Math.max(saved, 0));
    avSaved.style.color = saved > 0 ? '#059669' : 'var(--text)';

    resultDiv.classList.add('visible');

    // Payoff order
    var orderHTML = '';
    avResult.payoffList.forEach(function(item, i) {
      orderHTML += '<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">' +
        '<span style="background:var(--primary);color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;flex-shrink:0">' + (i + 1) + '</span>' +
        '<span style="flex:1;font-weight:600">' + item.name + '</span>' +
        '<span style="color:var(--text-light);font-size:0.9rem">Month ' + item.month + '</span></div>';
    });
    payoffOrder.innerHTML = orderHTML;
    payoffOrderWrap.style.display = 'block';

    // Schedule
    var names = avResult.debtOrder;
    var headHTML = '<th>Month</th>';
    names.forEach(function(n) { headHTML += '<th>' + n + '</th>'; });
    scheduleHead.innerHTML = headHTML;

    var bodyHTML = '';
    var step = avResult.schedule.length > 36 ? 3 : 1;
    for (var i = 0; i < avResult.schedule.length; i += step) {
      var row = avResult.schedule[i];
      bodyHTML += '<tr><td>' + row.month + '</td>';
      names.forEach(function(n) {
        bodyHTML += '<td>' + (row[n] !== undefined ? fmt(row[n]) : '$0.00') + '</td>';
      });
      bodyHTML += '</tr>';
    }
    if (avResult.schedule.length > 0 && avResult.schedule.length % step !== 1) {
      var lastRow = avResult.schedule[avResult.schedule.length - 1];
      bodyHTML += '<tr><td>' + lastRow.month + '</td>';
      names.forEach(function(n) {
        bodyHTML += '<td>' + (lastRow[n] !== undefined ? fmt(lastRow[n]) : '$0.00') + '</td>';
      });
      bodyHTML += '</tr>';
    }
    scheduleBody.innerHTML = bodyHTML;
    scheduleWrap.style.display = 'block';
  }

  calcBtn.addEventListener('click', calculate);
  calculate();
})();
