(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var salary = parseFloat(document.getElementById('salary').value) || 0;
    var filing = document.getElementById('filing').value;
    var state = document.getElementById('state').value;

    // Calculation logic
    var std = {single:14600,married:29200,hoh:21900}; var taxable = Math.max(0, salary - (std[filing] || 14600)); var fed = 0; if(filing === 'married') { if(taxable <= 23200) fed = taxable * 0.10; else if(taxable <= 94300) fed = 2320 + (taxable - 23200) * 0.12; else if(taxable <= 201050) fed = 10852 + (taxable - 94300) * 0.22; else if(taxable <= 383900) fed = 34337 + (taxable - 201050) * 0.24; else if(taxable <= 487450) fed = 78221 + (taxable - 383900) * 0.32; else if(taxable <= 731200) fed = 111357 + (taxable - 487450) * 0.35; else fed = 196670 + (taxable - 731200) * 0.37; } else if(filing === 'hoh') { if(taxable <= 16550) fed = taxable * 0.10; else if(taxable <= 63100) fed = 1655 + (taxable - 16550) * 0.12; else if(taxable <= 100500) fed = 7241 + (taxable - 63100) * 0.22; else if(taxable <= 191950) fed = 15469 + (taxable - 100500) * 0.24; else if(taxable <= 243725) fed = 37417 + (taxable - 191950) * 0.32; else if(taxable <= 609350) fed = 53985 + (taxable - 243725) * 0.35; else fed = 181954 + (taxable - 609350) * 0.37; } else { if(taxable <= 11600) fed = taxable * 0.10; else if(taxable <= 47150) fed = 1160 + (taxable - 11600) * 0.12; else if(taxable <= 100525) fed = 5426 + (taxable - 47150) * 0.22; else if(taxable <= 191950) fed = 17169 + (taxable - 100525) * 0.24; else if(taxable <= 243725) fed = 39111 + (taxable - 191950) * 0.32; else if(taxable <= 609350) fed = 55679 + (taxable - 243725) * 0.35; else fed = 183647 + (taxable - 609350) * 0.37; } var stateRates = {CA:0.0725,NY:0.0685,FL:0,TX:0,WA:0,IL:0.0495,PA:0.0307,OH:0.04,GA:0.055,NC:0.0475,NJ:0.0637,VA:0.0575,MA:0.05,CO:0.044,NV:0,TN:0,WY:0,AK:0,NH:0,SD:0}; var stRate = stateRates[state] || 0; var st = salary * stRate; var ssWage = Math.min(salary, 168600); var ss = ssWage * 0.062; var mc = salary * 0.0145; if(salary > 200000) mc += (salary - 200000) * 0.009; var ficaTotal = ss + mc; var totalTax = fed + st + ficaTotal; var takeHome = salary - totalTax; var effRate = salary > 0 ? (totalTax / salary) * 100 : 0; document.getElementById('gross').textContent = dollar(salary); document.getElementById('fedTax').textContent = dollar(fed); document.getElementById('stateTax').textContent = dollar(st); document.getElementById('fica').textContent = dollar(ficaTotal); document.getElementById('totalTax').textContent = dollar(totalTax); document.getElementById('takeHomeAnnual').textContent = dollar(takeHome); document.getElementById('takeHomeMonthly').textContent = dollar(takeHome / 12); document.getElementById('takeHomeBiweekly').textContent = dollar(takeHome / 26); document.getElementById('effectiveRate').textContent = pct(effRate, 1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['salary', 'filing', 'state'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
