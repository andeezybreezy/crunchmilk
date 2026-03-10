(function() {
  'use strict';

  var states = [
    'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia',
    'Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland',
    'Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
    'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
    'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
  ];

  // Effective income tax rate at $100k income (simplified), and COL index (100 = national avg)
  var stateData = {
    'Alabama':       {rate:0.040,col:89}, 'Alaska':        {rate:0,col:127},
    'Arizona':       {rate:0.025,col:103},'Arkansas':      {rate:0.039,col:87},
    'California':    {rate:0.058,col:142},'Colorado':      {rate:0.041,col:105},
    'Connecticut':   {rate:0.050,col:131},'Delaware':      {rate:0.048,col:103},
    'Florida':       {rate:0,col:103},    'Georgia':       {rate:0.042,col:92},
    'Hawaii':        {rate:0.063,col:190},'Idaho':         {rate:0.050,col:97},
    'Illinois':      {rate:0.046,col:93}, 'Indiana':       {rate:0.031,col:90},
    'Iowa':          {rate:0.044,col:90}, 'Kansas':        {rate:0.042,col:88},
    'Kentucky':      {rate:0.040,col:90}, 'Louisiana':     {rate:0.035,col:92},
    'Maine':         {rate:0.054,col:113},'Maryland':      {rate:0.048,col:120},
    'Massachusetts': {rate:0.050,col:135},'Michigan':      {rate:0.043,col:90},
    'Minnesota':     {rate:0.053,col:99}, 'Mississippi':   {rate:0.047,col:84},
    'Missouri':      {rate:0.042,col:89}, 'Montana':       {rate:0.049,col:100},
    'Nebraska':      {rate:0.049,col:92}, 'Nevada':        {rate:0,col:104},
    'New Hampshire': {rate:0,col:115},    'New Jersey':    {rate:0.051,col:130},
    'New Mexico':    {rate:0.041,col:93}, 'New York':      {rate:0.055,col:139},
    'North Carolina':{rate:0.045,col:96}, 'North Dakota':  {rate:0.019,col:93},
    'Ohio':          {rate:0.035,col:90}, 'Oklahoma':      {rate:0.035,col:86},
    'Oregon':        {rate:0.076,col:113},'Pennsylvania':  {rate:0.031,col:101},
    'Rhode Island':  {rate:0.048,col:109},'South Carolina':{rate:0.044,col:95},
    'South Dakota':  {rate:0,col:93},     'Tennessee':     {rate:0,col:90},
    'Texas':         {rate:0,col:92},     'Utah':          {rate:0.047,col:101},
    'Vermont':       {rate:0.054,col:114},'Virginia':      {rate:0.046,col:104},
    'Washington':    {rate:0,col:111},    'West Virginia': {rate:0.047,col:84},
    'Wisconsin':     {rate:0.050,col:95}, 'Wyoming':       {rate:0,col:96}
  };

  // Moving cost estimates by home size (base cost, per-mile rate, weight)
  var moveCosts = {
    studio: { base: 1500, perMile: 0.40, weight: 2000 },
    small:  { base: 2500, perMile: 0.55, weight: 4000 },
    medium: { base: 3500, perMile: 0.70, weight: 6500 },
    large:  { base: 5000, perMile: 0.85, weight: 9000 }
  };

  ['fromState','toState'].forEach(function(id) {
    var sel = document.getElementById(id);
    states.forEach(function(s) {
      var o = document.createElement('option');
      o.value = s; o.textContent = s;
      sel.appendChild(o);
    });
  });

  var chartData = [
    ['California','13.3%','5.8%','142','No'],
    ['Texas','0%','0%','92','Yes'],
    ['New York','10.9%','5.5%','139','No'],
    ['Florida','0%','0%','103','Yes'],
    ['Illinois','4.95%','4.6%','93','No'],
    ['Tennessee','0%','0%','90','Yes'],
    ['Colorado','4.4%','4.1%','105','No'],
    ['Washington','0%','0%','111','Yes'],
    ['Nevada','0%','0%','104','Yes'],
    ['Georgia','5.49%','4.2%','92','No']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function fmt(n) { return '$' + Math.round(n).toLocaleString(); }

  function calculate() {
    var from = document.getElementById('fromState').value;
    var to = document.getElementById('toState').value;
    var income = parseFloat(document.getElementById('annualIncome').value) || 0;
    var size = document.getElementById('homeSize').value;
    var distance = parseFloat(document.getElementById('moveDistance').value) || 0;

    if (!from || !to || income <= 0) return;

    var fromData = stateData[from];
    var toData = stateData[to];
    if (!fromData || !toData) return;

    // Moving costs
    var mc = moveCosts[size];
    var moverCost = mc.base + (distance * mc.perMile) + (mc.weight * 0.50);
    var diyCost = Math.round(moverCost * 0.40);
    if (distance <= 0) {
      moverCost = mc.base + mc.weight * 0.50;
      diyCost = Math.round(moverCost * 0.40);
    }

    // Tax comparison
    var fromTax = income * fromData.rate;
    var toTax = income * toData.rate;
    var taxDiff = toTax - fromTax;

    // COL comparison
    var colRatio = toData.col / fromData.col;
    var equivSalary = income * colRatio;
    var colPctChange = ((colRatio - 1) * 100);

    document.getElementById('moverCost').textContent = fmt(moverCost);
    document.getElementById('diyTruck').textContent = fmt(diyCost);

    var taxStr = taxDiff < 0 ? 'Save ' + fmt(Math.abs(taxDiff)) + '/yr' : taxDiff > 0 ? 'Pay ' + fmt(taxDiff) + ' more/yr' : 'No change';
    document.getElementById('taxDiff').textContent = taxStr;
    document.getElementById('taxDiff').style.color = taxDiff < 0 ? '#16a34a' : taxDiff > 0 ? '#dc2626' : '';

    document.getElementById('rateComp').textContent = (fromData.rate * 100).toFixed(1) + '% \u2192 ' + (toData.rate * 100).toFixed(1) + '%';

    var colDir = colPctChange >= 0 ? '+' : '';
    document.getElementById('colChange').textContent = colDir + colPctChange.toFixed(1) + '% (' + fromData.col + ' \u2192 ' + toData.col + ')';
    document.getElementById('colChange').style.color = colPctChange > 5 ? '#dc2626' : colPctChange < -5 ? '#16a34a' : '';

    document.getElementById('equivSalary').textContent = fmt(equivSalary) + ' in ' + to;

    var tip = 'Moving from ' + from + ' to ' + to + ': ';
    if (taxDiff < 0) tip += 'You\'d save ' + fmt(Math.abs(taxDiff)) + '/yr in state income tax. ';
    else if (taxDiff > 0) tip += 'You\'d pay ' + fmt(taxDiff) + ' more in state income tax. ';
    if (Math.abs(colPctChange) > 5) {
      tip += 'Cost of living is ' + Math.abs(colPctChange).toFixed(0) + '% ' + (colPctChange > 0 ? 'higher' : 'lower') + '. ';
    }
    tip += 'Does not include property tax, sales tax, or city-level differences.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
