(function() {
  'use strict';

  var states = [
    'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia',
    'Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland',
    'Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
    'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
    'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
  ];

  // DUI data by state: [firstFine, secondFine, thirdFine, insurancePctIncrease, interlockRequired(1=yes), reinstateeFee, suspensionFirst(months), suspensionSecond, suspensionThird]
  var duiData = {
    'Alabama':       [1500,5000,10000,70,0,275,90,365,1095],
    'Alaska':        [1500,3000,10000,65,1,200,90,365,1095],
    'Arizona':       [2500,4500,12000,80,1,350,90,365,1095],
    'Arkansas':      [1500,3000,5000,60,0,150,180,730,1095],
    'California':    [1800,2500,10000,75,1,200,180,730,1095],
    'Colorado':      [1200,3000,5000,55,1,200,270,365,730],
    'Connecticut':   [1500,3000,8000,65,1,175,365,1095,1095],
    'Delaware':      [1500,3000,5000,65,0,200,365,545,730],
    'Florida':       [1500,4000,5000,65,1,200,180,365,730],
    'Georgia':       [1000,2000,5000,70,1,250,365,1095,1825],
    'Hawaii':        [1000,3000,5000,60,1,100,90,365,1095],
    'Idaho':         [1000,5000,10000,65,1,175,90,365,1825],
    'Illinois':      [2500,5000,10000,50,1,500,365,1825,3650],
    'Indiana':       [1000,5000,10000,55,0,300,90,365,1095],
    'Iowa':          [1250,5000,9000,60,1,200,180,730,2190],
    'Kansas':        [1750,3500,5000,55,1,200,30,365,1095],
    'Kentucky':      [1000,3000,5000,55,1,175,120,545,730],
    'Louisiana':     [1000,3000,5000,60,1,250,90,730,1825],
    'Maine':         [2000,3000,5000,55,0,100,150,545,1825],
    'Maryland':      [1000,2000,5000,60,1,175,180,365,545],
    'Massachusetts': [2000,5000,10000,75,1,500,365,730,2920],
    'Michigan':      [1500,5000,10000,85,1,375,180,365,1825],
    'Minnesota':     [1000,3000,7000,60,1,430,90,365,1095],
    'Mississippi':   [1000,5000,10000,65,1,175,90,730,1825],
    'Missouri':      [1000,2000,5000,55,1,100,90,365,1825],
    'Montana':       [1000,2000,5000,55,1,200,180,365,1095],
    'Nebraska':      [1000,3000,5000,55,1,125,180,545,1825],
    'Nevada':        [1000,2000,5000,60,1,120,185,365,1095],
    'New Hampshire': [1000,2000,5000,55,1,100,180,1095,1095],
    'New Jersey':    [1000,2000,5000,70,1,200,90,730,2920],
    'New Mexico':    [1000,2000,5000,55,1,150,365,730,1095],
    'New York':      [1000,4000,10000,85,1,375,180,365,365],
    'North Carolina':[2000,4000,10000,75,0,100,365,1460,1095],
    'North Dakota':  [1000,3000,5000,55,1,100,91,365,1095],
    'Ohio':          [1075,2750,10000,60,1,475,180,365,1095],
    'Oklahoma':      [1000,2500,5000,55,1,400,180,365,1095],
    'Oregon':        [2000,5000,10000,65,1,225,365,1095,1825],
    'Pennsylvania':  [2500,5000,10000,65,1,100,365,365,545],
    'Rhode Island':  [1000,3000,5000,55,1,200,90,365,1095],
    'South Carolina':[1000,5000,10000,55,1,200,180,365,1095],
    'South Dakota':  [2000,3000,5000,55,0,200,365,365,1095],
    'Tennessee':     [1500,3500,5000,60,1,100,365,730,1825],
    'Texas':         [2000,4000,10000,55,1,300,180,730,1095],
    'Utah':          [1500,5000,10000,60,1,300,120,730,1460],
    'Vermont':       [1000,3000,5000,55,1,100,90,545,1095],
    'Virginia':      [2500,5000,10000,80,1,300,365,1095,1095],
    'Washington':    [1500,5000,10000,70,1,225,90,730,1095],
    'West Virginia': [1000,3000,5000,55,1,100,180,365,1095],
    'Wisconsin':     [1500,3000,10000,60,1,200,180,545,1095],
    'Wyoming':       [1250,3000,5000,55,1,200,90,365,1095]
  };

  var sel = document.getElementById('duiState');
  states.forEach(function(s) {
    var o = document.createElement('option');
    o.value = s; o.textContent = s;
    sel.appendChild(o);
  });

  var chartData = [
    ['California','$1,800','$5,000','$8,100','$2,800','$17,700'],
    ['Texas','$2,000','$5,000','$6,000','$3,000','$16,000'],
    ['New York','$1,000','$5,500','$9,600','$2,400','$18,500'],
    ['Florida','$1,500','$4,000','$6,900','$2,200','$14,600'],
    ['Arizona','$2,500','$5,000','$7,500','$3,500','$18,500'],
    ['Georgia','$1,000','$3,500','$7,200','$2,000','$13,700'],
    ['Colorado','$1,200','$4,500','$6,300','$2,500','$14,500'],
    ['Illinois','$2,500','$5,000','$5,400','$2,800','$15,700'],
    ['Virginia','$2,500','$5,000','$8,400','$2,600','$18,500'],
    ['Michigan','$1,500','$4,000','$9,000','$2,200','$16,700']
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
    var state = document.getElementById('duiState').value;
    var offense = document.getElementById('offenseNum').value;
    var bac = document.getElementById('bacLevel').value;
    var currentIns = parseFloat(document.getElementById('currentInsurance').value) || 1800;

    if (!state) return;

    var data = duiData[state];
    if (!data) return;

    // Base fine by offense
    var baseFine;
    var suspDays;
    if (offense === 'first') {
      baseFine = data[0]; suspDays = data[6];
    } else if (offense === 'second') {
      baseFine = data[1]; suspDays = data[7];
    } else {
      baseFine = data[2]; suspDays = data[8];
    }

    // BAC multiplier
    var bacMult = 1;
    if (bac === 'mid') bacMult = 1.5;
    else if (bac === 'high') bacMult = 2.0;

    var courtFines = Math.round(baseFine * bacMult);

    // Attorney fees
    var attorneyBase = offense === 'first' ? 4500 : offense === 'second' ? 7500 : 12000;
    if (bac === 'high') attorneyBase *= 1.3;
    var attorneyFees = Math.round(attorneyBase);

    // Insurance increase over 3 years
    var insPctInc = data[3] / 100;
    if (offense === 'second') insPctInc *= 1.5;
    if (offense === 'third') insPctInc *= 2;
    if (bac === 'mid') insPctInc *= 1.2;
    if (bac === 'high') insPctInc *= 1.5;
    var annualInsInc = currentIns * insPctInc;
    var insuranceTotal = Math.round(annualInsInc * 3);

    // License reinstatement
    var reinstateFee = data[5];

    // DUI classes
    var classesBase = offense === 'first' ? 800 : offense === 'second' ? 1500 : 2500;
    var classesCost = classesBase;

    // Ignition interlock
    var interlockCost = 0;
    var interlockReq = data[4];
    if (interlockReq || offense !== 'first') {
      var interlockMonths = offense === 'first' ? 6 : offense === 'second' ? 12 : 24;
      interlockCost = 100 + (interlockMonths * 90); // installation + monthly
    }

    var totalCost = courtFines + attorneyFees + insuranceTotal + reinstateFee + classesCost + interlockCost;

    // Suspension display
    var suspMonths = Math.round(suspDays / 30);
    var suspStr = suspMonths < 12 ? suspMonths + ' months' : (suspMonths / 12).toFixed(1) + ' years';

    document.getElementById('courtFines').textContent = fmt(courtFines);
    document.getElementById('attorneyFees').textContent = fmt(attorneyFees);
    document.getElementById('insuranceInc').textContent = fmt(insuranceTotal) + ' (+' + Math.round(insPctInc * 100) + '%)';
    document.getElementById('reinstatement').textContent = fmt(reinstateFee);
    document.getElementById('classes').textContent = fmt(classesCost);
    document.getElementById('interlock').textContent = interlockCost > 0 ? fmt(interlockCost) : 'Not required';
    document.getElementById('totalCost').textContent = fmt(totalCost);
    document.getElementById('suspension').textContent = suspStr;

    var offenseLabel = offense === 'first' ? '1st' : offense === 'second' ? '2nd' : '3rd';
    var tip = offenseLabel + ' offense DUI in ' + state + ': estimated total cost ' + fmt(totalCost) + ' plus ' + suspStr + ' license suspension. ';
    tip += 'A rideshare home costs $20-$50. These are estimates — actual costs may be higher with court surcharges, lost wages, and other penalties.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
