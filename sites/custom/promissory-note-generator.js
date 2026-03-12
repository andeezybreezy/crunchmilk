(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var lenderName = parseFloat(document.getElementById('lenderName').value) || 0;
    var borrowerName = parseFloat(document.getElementById('borrowerName').value) || 0;
    var principal = parseFloat(document.getElementById('principal').value) || 0;
    var intRate = parseFloat(document.getElementById('intRate').value) || 0;
    var moPayment = parseFloat(document.getElementById('moPayment').value) || 0;
    var termMonths = parseFloat(document.getElementById('termMonths').value) || 0;
    var pnState = parseFloat(document.getElementById('pnState').value) || 0;

    // Calculation logic
    var lenderName = document.getElementById('lenderName').value; var borrowerName = document.getElementById('borrowerName').value; var pnState = document.getElementById('pnState').value; var today = new Date(); var months = ['January','February','March','April','May','June','July','August','September','October','November','December']; var todayStr = months[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear(); var maturityDate = new Date(today); maturityDate.setMonth(maturityDate.getMonth() + Math.round(termMonths)); var maturityStr = months[maturityDate.getMonth()] + ' ' + maturityDate.getDate() + ', ' + maturityDate.getFullYear(); var totalPayments = moPayment * termMonths; var totalInterest = totalPayments - principal; if (totalInterest < 0) totalInterest = principal * (intRate / 100) * (termMonths / 12); var html = '<div style="background:#fff3cd;border:1px solid #ffc107;padding:12px;border-radius:6px;margin-bottom:16px;font-size:0.9em;"><strong>Disclaimer:</strong> This is a template for informational purposes only. It is not legal advice. Consult an attorney for your specific situation.</div>'; html += '<div style="padding:16px;background:#fff;border:1px solid #ddd;border-radius:8px;">'; html += '<h2>PROMISSORY NOTE</h2>'; html += '<p><strong>Date:</strong> ' + todayStr + '<br><strong>Principal Amount:</strong> ' + dollar(principal) + '</p>'; html += '<p><strong>1. PROMISE TO PAY</strong></p>'; html += '<p>FOR VALUE RECEIVED, <strong>' + borrowerName + '</strong> ("Borrower") promises to pay to the order of <strong>' + lenderName + '</strong> ("Lender") the principal sum of <strong>' + dollar(principal) + '</strong>, together with interest thereon as set forth below.</p>'; html += '<p><strong>2. INTEREST</strong></p>'; html += '<p>2.1 Interest shall accrue on the unpaid principal balance at the rate of <strong>' + fmt(intRate, 2) + '% per annum</strong>.</p>'; html += '<p>2.2 Interest shall be calculated on a simple interest basis using a 365-day year.</p>'; html += '<p><strong>3. PAYMENT TERMS</strong></p>'; html += '<p>3.1 The Borrower shall make monthly payments of <strong>' + dollar(moPayment) + '</strong> on the first day of each month, beginning on the first day of the month following the date of this Note.</p>'; html += '<p>3.2 Payments shall be applied first to accrued interest and then to the reduction of principal.</p>'; html += '<p>3.3 The entire remaining balance of principal and accrued interest shall be due and payable on the maturity date of <strong>' + maturityStr + '</strong>.</p>'; html += '<p><strong>4. PREPAYMENT</strong></p>'; html += '<p>4.1 The Borrower may prepay this Note in whole or in part at any time without penalty.</p>'; html += '<p><strong>5. LATE PAYMENT</strong></p>'; html += '<p>5.1 If any payment is not received within ten (10) days of its due date, the Borrower shall pay a late fee of five percent (5%) of the overdue payment amount.</p>'; html += '<p><strong>6. DEFAULT</strong></p>'; html += '<p>6.1 The following shall constitute events of default: (a) failure to make any payment within thirty (30) days of the due date; (b) the Borrower becomes insolvent or files for bankruptcy; (c) any material breach of the terms of this Note.</p>'; html += '<p>6.2 Upon default, the Lender may declare the entire unpaid balance immediately due and payable.</p>'; html += '<p>6.3 In the event of default, the Borrower shall be responsible for all costs of collection, including reasonable attorney fees.</p>'; html += '<p><strong>7. GOVERNING LAW</strong></p>'; html += '<p>7.1 This Promissory Note shall be governed by the laws of the State of ' + pnState + '.</p>'; html += '<p><strong>8. WAIVER</strong></p>'; html += '<p>8.1 The Borrower waives presentment, demand for payment, notice of dishonor, and protest.</p>'; html += '<p>8.2 No waiver by the Lender of any default shall constitute a waiver of any subsequent default.</p>'; html += '<p style="margin-top:20px;padding:12px;background:#f0f0f0;border-radius:6px;"><strong>Loan Summary:</strong><br>Principal: ' + dollar(principal) + '<br>Interest Rate: ' + fmt(intRate, 2) + '%<br>Monthly Payment: ' + dollar(moPayment) + '<br>Term: ' + Math.round(termMonths) + ' months<br>Maturity Date: ' + maturityStr + '</p>'; html += '<p style="margin-top:30px;"><strong>IN WITNESS WHEREOF,</strong> the Borrower has executed this Promissory Note as of the date first written above.</p>'; html += '<p><br>____________________________<br>' + borrowerName + ' (Borrower)</p>'; html += '<p><br>____________________________<br>' + lenderName + ' (Lender)</p>'; html += '</div>'; html += '<button onclick="var t=document.getElementById(\x27documentOutput\x27).innerText;navigator.clipboard.writeText(t).then(function(){alert(\x27Document copied to clipboard!\x27)})">Copy Document</button>'; document.getElementById('documentOutput').innerHTML = html;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['lenderName', 'borrowerName', 'principal', 'intRate', 'moPayment', 'termMonths', 'pnState'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
