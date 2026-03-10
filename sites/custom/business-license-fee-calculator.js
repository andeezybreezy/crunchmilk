(function() {
  'use strict';

  var states = [
    'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia',
    'Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland',
    'Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
    'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
    'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
  ];

  // [llc_filing, llc_annual, corp_filing, corp_annual, sole_prop_dba, partnership_filing, nonprofit_filing]
  var stateData = {
    'Alabama':[236,0,236,0,30,236,236],'Alaska':[250,100,250,100,25,250,250],
    'Arizona':[50,0,60,45,5,50,50],'Arkansas':[45,150,45,150,25,45,45],
    'California':[70,800,100,25,20,70,30],'Colorado':[50,10,50,10,20,50,50],
    'Connecticut':[120,80,250,150,15,120,50],'Delaware':[90,300,89,225,25,200,90],
    'Florida':[125,139,70,150,10,125,70],'Georgia':[100,50,100,50,10,100,100],
    'Hawaii':[50,15,50,15,25,50,25],'Idaho':[100,0,100,0,25,100,30],
    'Illinois':[150,75,150,75,10,150,50],'Indiana':[95,31,95,31,25,95,30],
    'Iowa':[50,60,50,60,10,50,20],'Kansas':[160,55,90,55,10,160,25],
    'Kentucky':[40,15,50,15,20,40,8],'Louisiana':[100,35,75,35,15,100,75],
    'Maine':[175,85,145,85,25,175,40],'Maryland':[100,300,120,300,25,100,170],
    'Massachusetts':[500,500,275,125,25,500,35],'Michigan':[50,25,60,25,10,50,20],
    'Minnesota':[155,0,160,0,20,155,70],'Mississippi':[50,0,50,25,10,50,50],
    'Missouri':[50,0,58,0,15,50,25],'Montana':[70,20,70,20,10,70,20],
    'Nebraska':[105,10,60,26,15,105,10],'Nevada':[75,350,75,350,25,75,75],
    'New Hampshire':[100,100,100,100,15,100,25],'New Jersey':[125,75,125,75,10,125,75],
    'New Mexico':[50,0,100,25,20,50,25],'New York':[200,9,125,9,25,200,75],
    'North Carolina':[125,200,125,200,10,125,60],'North Dakota':[135,50,100,25,10,135,40],
    'Ohio':[99,0,99,0,25,99,99],'Oklahoma':[100,25,50,25,10,100,25],
    'Oregon':[100,100,100,100,20,100,50],'Pennsylvania':[125,70,125,70,10,125,125],
    'Rhode Island':[150,50,230,50,20,150,25],'South Carolina':[110,0,135,0,10,110,25],
    'South Dakota':[150,50,150,50,10,150,30],'Tennessee':[300,300,100,20,15,300,100],
    'Texas':[300,0,300,0,15,300,25],'Utah':[54,20,70,15,10,54,30],
    'Vermont':[125,35,125,45,20,125,20],'Virginia':[100,50,75,25,10,100,75],
    'Washington':[200,60,180,60,15,200,30],'West Virginia':[100,25,50,25,15,100,25],
    'Wisconsin':[130,25,100,25,15,130,35],'Wyoming':[100,60,100,50,10,100,25]
  };

  var entityIndex = { 'llc': [0,1], 'corporation': [2,3], 'sole_proprietorship': [4,-1], 'partnership': [5,1], 'nonprofit': [6,3] };

  var sel = document.getElementById('blState');
  states.forEach(function(s) {
    var o = document.createElement('option');
    o.value = s; o.textContent = s;
    sel.appendChild(o);
  });

  var chartData = [
    ['California','$70','$800','$100','$25'],
    ['Texas','$300','$0','$300','$0'],
    ['New York','$200','$9','$125','$9'],
    ['Florida','$125','$139','$70','$150'],
    ['Illinois','$150','$75','$150','$75'],
    ['Delaware','$90','$300','$89','$225'],
    ['Nevada','$75','$350','$75','$350'],
    ['Ohio','$99','$0','$99','$0'],
    ['Georgia','$100','$50','$100','$50'],
    ['Wyoming','$100','$60','$100','$50']
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
    var state = document.getElementById('blState').value;
    var entity = document.getElementById('entityType').value;
    var revenue = parseFloat(document.getElementById('annualRevenue').value) || 0;

    if (!state) return;

    var data = stateData[state];
    if (!data) return;

    var indices = entityIndex[entity];
    var filing = data[indices[0]];
    var annual = indices[1] >= 0 ? data[indices[1]] : 0;

    // Business license fee estimate based on revenue
    var licenseFee = 0;
    if (revenue > 0) {
      if (revenue <= 25000) licenseFee = 50;
      else if (revenue <= 50000) licenseFee = 75;
      else if (revenue <= 100000) licenseFee = 150;
      else if (revenue <= 250000) licenseFee = 250;
      else if (revenue <= 500000) licenseFee = 400;
      else if (revenue <= 1000000) licenseFee = 600;
      else licenseFee = 600 + Math.floor((revenue - 1000000) / 500000) * 200;
    }

    var total = filing + annual + licenseFee;

    document.getElementById('filingFee').textContent = fmt(filing);
    document.getElementById('annualFee').textContent = annual > 0 ? fmt(annual) + '/yr' : 'None required';
    document.getElementById('licenseFee').textContent = licenseFee > 0 ? fmt(licenseFee) + ' (est.)' : 'Varies by city';
    document.getElementById('totalCost').textContent = fmt(total);

    var entityLabel = entity.replace(/_/g, ' ');
    entityLabel = entityLabel.charAt(0).toUpperCase() + entityLabel.slice(1);
    var tip = entityLabel + ' in ' + state + ': ' + fmt(filing) + ' filing + ' + fmt(annual) + ' annual report. ';
    tip += 'City/county business licenses and industry-specific permits are additional.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
