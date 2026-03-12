(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var copyrightOwner = parseFloat(document.getElementById('copyrightOwner').value) || 0;
    var infringingUrl = parseFloat(document.getElementById('infringingUrl').value) || 0;
    var origWorkDesc = parseFloat(document.getElementById('origWorkDesc').value) || 0;
    var contactEmail = parseFloat(document.getElementById('contactEmail').value) || 0;

    // Calculation logic
    var copyrightOwner = document.getElementById('copyrightOwner').value; var infringingUrl = document.getElementById('infringingUrl').value; var origWorkDesc = document.getElementById('origWorkDesc').value; var contactEmail = document.getElementById('contactEmail').value; var today = new Date(); var months = ['January','February','March','April','May','June','July','August','September','October','November','December']; var todayStr = months[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear(); var html = '<div style="background:#fff3cd;border:1px solid #ffc107;padding:12px;border-radius:6px;margin-bottom:16px;font-size:0.9em;"><strong>Disclaimer:</strong> This is a template for informational purposes only. It is not legal advice. Filing a false DMCA notice can result in liability for damages. Consult an attorney if you are unsure whether the use constitutes infringement.</div>'; html += '<div style="font-family:Georgia,serif;line-height:1.8;padding:20px;background:#fff;border:1px solid #ddd;border-radius:8px;">'; html += '<h2 style="text-align:center;border-bottom:2px solid #333;padding-bottom:10px;">DMCA TAKEDOWN NOTICE</h2>'; html += '<p style="text-align:right;">' + todayStr + '</p>'; html += '<p>To Whom It May Concern (Designated DMCA Agent):</p>'; html += '<p>This letter serves as a notification of claimed copyright infringement pursuant to <strong>Section 512(c) of the Digital Millennium Copyright Act (17 U.S.C. § 512)</strong>.</p>'; html += '<p><strong>1. IDENTIFICATION OF COPYRIGHTED WORK</strong></p>'; html += '<p>The copyrighted work that has been infringed is described as follows:</p>'; html += '<p style="margin-left:20px;padding:10px;background:#f9f9f9;border-left:3px solid #333;">' + origWorkDesc + '</p>'; html += '<p>This work is owned by <strong>' + copyrightOwner + '</strong>.</p>'; html += '<p><strong>2. IDENTIFICATION OF INFRINGING MATERIAL</strong></p>'; html += '<p>The material that is infringing the above-described copyrighted work is located at the following URL(s):</p>'; html += '<p style="margin-left:20px;padding:10px;background:#f9f9f9;border-left:3px solid #333;word-break:break-all;">' + infringingUrl + '</p>'; html += '<p>I request that this material be removed or access to it be disabled.</p>'; html += '<p><strong>3. CONTACT INFORMATION</strong></p>'; html += '<p>Name: ' + copyrightOwner + '<br>Email: ' + contactEmail + '</p>'; html += '<p><strong>4. GOOD FAITH STATEMENT</strong></p>'; html += '<p>I have a good faith belief that the use of the copyrighted material described above is not authorized by the copyright owner, its agent, or the law (e.g., as a fair use).</p>'; html += '<p><strong>5. ACCURACY STATEMENT</strong></p>'; html += '<p>The information in this notification is accurate, and <strong>under penalty of perjury</strong>, I am the copyright owner or am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</p>'; html += '<p><strong>6. SIGNATURE</strong></p>'; html += '<p>I declare under penalty of perjury that the foregoing is true and correct.</p>'; html += '<p><br>____________________________<br>' + copyrightOwner + '<br>' + contactEmail + '<br>' + todayStr + '</p>'; html += '<p style="margin-top:20px;padding:12px;background:#f0f0f0;border-radius:6px;font-size:0.9em;"><strong>How to Submit:</strong> Send this notice to the website\'s designated DMCA agent. For major platforms:<br>- <strong>Google:</strong> Use the Google DMCA form at google.com/legal<br>- <strong>Facebook/Instagram:</strong> Use the IP Report Form in Help Center<br>- <strong>YouTube:</strong> Use the Copyright Complaint form<br>- <strong>Other sites:</strong> Check the site\'s Terms of Service or DMCA policy page for their designated agent\'s contact information, or search the U.S. Copyright Office\'s directory at dmca.copyright.gov</p>'; html += '</div>'; html += '<button onclick="var t=document.getElementById(\x27documentOutput\x27).innerText;navigator.clipboard.writeText(t).then(function(){alert(\x27Document copied to clipboard!\x27)})" style="margin-top:12px;padding:10px 20px;background:#1e3a5f;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:1em;">Copy Document</button>'; document.getElementById('documentOutput').innerHTML = html;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['copyrightOwner', 'infringingUrl', 'origWorkDesc', 'contactEmail'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
