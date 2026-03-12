(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var senderName = parseFloat(document.getElementById('senderName').value) || 0;
    var recipientName = parseFloat(document.getElementById('recipientName').value) || 0;
    var amountOwed = parseFloat(document.getElementById('amountOwed').value) || 0;
    var reason = parseFloat(document.getElementById('reason').value) || 0;
    var deadlineDays = parseFloat(document.getElementById('deadlineDays').value) || 0;
    var senderState = parseFloat(document.getElementById('senderState').value) || 0;

    // Calculation logic
    var senderName = document.getElementById('senderName').value; var recipientName = document.getElementById('recipientName').value; var reason = document.getElementById('reason').value; var senderState = document.getElementById('senderState').value; var today = new Date(); var deadlineDate = new Date(today); deadlineDate.setDate(deadlineDate.getDate() + deadlineDays); var months = ['January','February','March','April','May','June','July','August','September','October','November','December']; var todayStr = months[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear(); var deadlineStr = months[deadlineDate.getMonth()] + ' ' + deadlineDate.getDate() + ', ' + deadlineDate.getFullYear(); var html = '<div style="background:#fff3cd;border:1px solid #ffc107;padding:12px;border-radius:6px;margin-bottom:16px;font-size:0.9em;"><strong>Disclaimer:</strong> This is a template for informational purposes only. It is not legal advice. Consult an attorney for your specific situation.</div>'; html += '<div style="font-family:Georgia,serif;line-height:1.8;padding:20px;background:#fff;border:1px solid #ddd;border-radius:8px;">'; html += '<p style="text-align:right;">' + todayStr + '</p>'; html += '<p>' + recipientName + '<br>Via Certified Mail</p>'; html += '<p><strong>RE: DEMAND FOR PAYMENT — ' + dollar(amountOwed) + '</strong></p>'; html += '<p>Dear ' + recipientName + ',</p>'; html += '<p>1. I, ' + senderName + ', am writing to formally demand payment in the amount of <strong>' + dollar(amountOwed) + '</strong> for the following: ' + reason + '.</p>'; html += '<p>2. This amount is due and owing, and despite prior requests, payment has not been received. This letter serves as a formal demand for the full amount owed.</p>'; html += '<p>3. <strong>You are hereby demanded to remit payment of ' + dollar(amountOwed) + ' no later than ' + deadlineStr + '</strong> (' + Math.round(deadlineDays) + ' days from the date of this letter).</p>'; html += '<p>4. Payment should be made payable to ' + senderName + ' and delivered to the address listed below.</p>'; html += '<p>5. If payment is not received by the above deadline, I reserve the right to pursue all available legal remedies under the laws of the State of ' + senderState + ', including but not limited to filing a lawsuit to recover the amount owed, plus applicable interest, court costs, and attorney fees as permitted by law.</p>'; html += '<p>6. This letter is written without prejudice to any and all rights and remedies available to me, all of which are expressly reserved.</p>'; html += '<p>I strongly urge you to resolve this matter promptly to avoid further action.</p>'; html += '<p>Sincerely,</p>'; html += '<p><br>____________________________<br>' + senderName + '</p>'; html += '</div>'; html += '<button onclick="var t=document.getElementById(\x27documentOutput\x27).innerText;navigator.clipboard.writeText(t).then(function(){alert(\x27Document copied to clipboard!\x27)})" style="margin-top:12px;padding:10px 20px;background:#1e3a5f;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:1em;">Copy Document</button>'; document.getElementById('documentOutput').innerHTML = html;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['senderName', 'recipientName', 'amountOwed', 'reason', 'deadlineDays', 'senderState'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
