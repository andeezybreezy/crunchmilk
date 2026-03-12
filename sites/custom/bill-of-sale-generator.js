(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var sellerName = parseFloat(document.getElementById('sellerName').value) || 0;
    var buyerName = parseFloat(document.getElementById('buyerName').value) || 0;
    var itemDesc = parseFloat(document.getElementById('itemDesc').value) || 0;
    var salePrice = parseFloat(document.getElementById('salePrice').value) || 0;
    var saleDate = parseFloat(document.getElementById('saleDate').value) || 0;
    var bosState = parseFloat(document.getElementById('bosState').value) || 0;

    // Calculation logic
    var sellerName = document.getElementById('sellerName').value; var buyerName = document.getElementById('buyerName').value; var itemDesc = document.getElementById('itemDesc').value; var saleDate = document.getElementById('saleDate').value; var bosState = document.getElementById('bosState').value; var html = '<div style="background:#fff3cd;border:1px solid #ffc107;padding:12px;border-radius:6px;margin-bottom:16px;font-size:0.9em;"><strong>Disclaimer:</strong> This is a template for informational purposes only. It is not legal advice. Consult an attorney for your specific situation.</div>'; html += '<div style="padding:16px;background:#fff;border:1px solid #ddd;border-radius:8px;">'; html += '<h2>BILL OF SALE</h2>'; html += '<p><strong>Date:</strong> ' + saleDate + '</p>'; html += '<p><strong>1. PARTIES</strong></p>'; html += '<p><strong>Seller:</strong> ' + sellerName + '<br><strong>Buyer:</strong> ' + buyerName + '</p>'; html += '<p><strong>2. PROPERTY DESCRIPTION</strong></p>'; html += '<p>The Seller hereby sells, transfers, and conveys to the Buyer the following described personal property:</p>'; html += '<p style="margin-left:20px;padding:10px;background:#f9f9f9;border-left:3px solid #333;">' + itemDesc + '</p>'; html += '<p><strong>3. PURCHASE PRICE</strong></p>'; html += '<p>The total purchase price for the above-described property is <strong>' + dollar(salePrice) + '</strong> (the "Purchase Price"), which the Buyer has paid to the Seller in full as of the date of this Bill of Sale.</p>'; html += '<p><strong>4. AS-IS CONDITION</strong></p>'; html += '<p>4.1 The property is sold "AS IS" and "WHERE IS," with all faults and without any warranty, express or implied, including but not limited to any warranty of merchantability or fitness for a particular purpose.</p>'; html += '<p>4.2 The Buyer acknowledges that they have inspected the property and accept it in its present condition.</p>'; html += '<p><strong>5. TITLE AND OWNERSHIP</strong></p>'; html += '<p>5.1 The Seller represents and warrants that they are the lawful owner of the above-described property and have the legal right to sell it.</p>'; html += '<p>5.2 The Seller represents that the property is free and clear of all liens, encumbrances, and claims of any kind.</p>'; html += '<p>5.3 The Seller agrees to defend the title to the property against all claims and demands.</p>'; html += '<p><strong>6. TRANSFER</strong></p>'; html += '<p>6.1 Upon receipt of the Purchase Price, the Seller hereby transfers and conveys all right, title, and interest in the described property to the Buyer.</p>'; html += '<p><strong>7. GOVERNING LAW</strong></p>'; html += '<p>7.1 This Bill of Sale shall be governed by the laws of the State of ' + bosState + '.</p>'; html += '<p style="margin-top:30px;"><strong>IN WITNESS WHEREOF,</strong> the parties have executed this Bill of Sale on the date written above.</p>'; html += '<p><br>____________________________<br>' + sellerName + ' (Seller)</p>'; html += '<p><br>____________________________<br>' + buyerName + ' (Buyer)</p>'; html += '<p style="margin-top:20px;font-size:0.9em;"><em>Witness (optional):</em></p>'; html += '<p><br>____________________________<br>Witness Name and Signature</p>'; html += '</div>'; html += '<button onclick="var t=document.getElementById(\x27documentOutput\x27).innerText;navigator.clipboard.writeText(t).then(function(){alert(\x27Document copied to clipboard!\x27)})">Copy Document</button>'; document.getElementById('documentOutput').innerHTML = html;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['sellerName', 'buyerName', 'itemDesc', 'salePrice', 'saleDate', 'bosState'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
