(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var procedure = document.getElementById('procedure').value;
    var petType = document.getElementById('petType').value;
    var petSize = document.getElementById('petSize').value;
    var clinicType = document.getElementById('clinicType').value;
    var region = document.getElementById('region').value;

    // Calculation logic
    var costs = {wellness:{low:50,mid:75,high:125},vaccines:{low:75,mid:120,high:200},dental:{low:300,mid:600,high:1200},spay_neuter:{low:200,mid:400,high:800},xray:{low:150,mid:300,high:500},blood_work:{low:100,mid:200,high:400},emergency:{low:500,mid:1500,high:4000},acl:{low:2500,mid:4000,high:6500},mass_removal:{low:500,mid:1500,high:4000},fracture:{low:1500,mid:3500,high:7000}}; var sizeMult = {small:0.85,medium:1.0,large:1.15,giant:1.35}; var clinicMult = {low_cost:0.6,general:1.0,specialty:1.8,emergency:1.6}; var regionMult = {rural:0.75,average:1.0,hcol:1.45}; var catDiscount = petType === 'cat' ? 0.80 : 1.0; var base = costs[procedure] || costs.wellness; var sm = sizeMult[petSize] || 1.0; var cm = clinicMult[clinicType] || 1.0; var rm = regionMult[region] || 1.0; var mult = sm * cm * rm * catDiscount; var low = base.low * mult; var mid = base.mid * mult; var high = base.high * mult; var includes = {wellness:'Exam, basic assessment, recommendations',vaccines:'Core vaccines, exam fee, booster schedule',dental:'Anesthesia, cleaning, polishing, X-rays',spay_neuter:'Surgery, anesthesia, pain medication, recovery',xray:'2-3 views, radiologist interpretation',blood_work:'CBC, chemistry panel, interpretation',emergency:'Triage, exam, stabilization, diagnostics',acl:'Surgery, anesthesia, imaging, follow-up visits',mass_removal:'Biopsy, surgery, anesthesia, histopathology',fracture:'Surgery, hardware, casting, follow-ups'}; var extras = {wellness:'Blood work, fecal test, heartworm test',vaccines:'Non-core vaccines (Lyme, Lepto, flu)',dental:'Extractions ($50-$300 each), antibiotics',spay_neuter:'Pre-surgical blood work, e-collar, gastropexy',xray:'Sedation, additional views, ultrasound',blood_work:'Urinalysis, thyroid panel, specialty tests',emergency:'Surgery, hospitalization, specialist referral',acl:'Post-op rehab, braces, physical therapy',mass_removal:'CT scan, oncology consult, chemotherapy',fracture:'Pins/plates, physical therapy, cage rest supplies'}; document.getElementById('lowEstimate').textContent = dollar(low); document.getElementById('midEstimate').textContent = dollar(mid); document.getElementById('highEstimate').textContent = dollar(high); document.getElementById('includesNote').textContent = includes[procedure] || 'Standard procedure costs'; document.getElementById('additionalCosts').textContent = extras[procedure] || 'Ask your vet for a detailed estimate';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['procedure', 'petType', 'petSize', 'clinicType', 'region'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
