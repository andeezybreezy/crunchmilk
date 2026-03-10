(function() {
  'use strict';

  var states = [
    'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia',
    'Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland',
    'Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
    'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
    'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
  ];

  // Season data: { spring: [opens, closes, bagLimit, legalBirds, hours, methods], fall: [...] or null }
  var seasonData = {
    'Alabama':       {spring:['Mar 15','May 1','5 (1/day)','Gobblers only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Nov 20','Jan 31','1','Either sex','30 min before sunrise–sunset','Shotgun, archery, rifle']},
    'Alaska':        {spring:null,fall:null},
    'Arizona':       {spring:['Apr 24','May 20','1','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Oct 15','Nov 15','1','Either sex','30 min before sunrise–sunset','Shotgun, archery, rifle']},
    'Arkansas':      {spring:['Apr 14','May 5','2','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Oct 1','Nov 15','1','Either sex','Sunrise–sunset','Shotgun, archery']},
    'California':    {spring:['Mar 29','May 3','1','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:null},
    'Colorado':      {spring:['Apr 12','May 25','2','Bearded only','Sunrise–sunset','Shotgun, archery'],fall:['Sep 1','Sep 30','2','Either sex','Sunrise–sunset','Shotgun, archery']},
    'Connecticut':   {spring:['Apr 28','May 31','2','Bearded only','30 min before sunrise–noon (first 2 wks), all day after','Shotgun, archery'],fall:['Oct 10','Nov 5','1','Either sex','Sunrise–sunset','Shotgun, archery']},
    'Delaware':      {spring:['Apr 12','May 31','2','Bearded only','Sunrise–sunset','Shotgun, archery'],fall:null},
    'Florida':       {spring:['Mar 1','Apr 25','2','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:null},
    'Georgia':       {spring:['Mar 22','May 15','3','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:null},
    'Hawaii':        {spring:['Mar 1','Apr 30','2','Gobblers only','30 min before sunrise–sunset','Shotgun, archery, rifle'],fall:['Nov 1','Jan 31','2','Either sex','30 min before sunrise–sunset','Shotgun, archery, rifle']},
    'Idaho':         {spring:['Apr 15','May 25','2','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Sep 20','Nov 20','2','Either sex','30 min before sunrise–sunset','Shotgun, archery']},
    'Illinois':      {spring:['Apr 7','May 8','2','Bearded only','30 min before sunrise–1 PM (first week), all day after','Shotgun, archery'],fall:['Oct 13','Nov 8','1','Either sex','Sunrise–sunset','Shotgun, archery']},
    'Indiana':       {spring:['Apr 23','May 12','1','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Oct 16','Nov 3','1','Either sex','Sunrise–sunset','Shotgun, archery']},
    'Iowa':          {spring:['Apr 14','May 18','2','Bearded only','Sunrise–sunset','Shotgun, archery'],fall:['Oct 12','Dec 1','1','Either sex','Sunrise–sunset','Shotgun, archery']},
    'Kansas':        {spring:['Apr 1','May 31','2','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Oct 1','Nov 10','1','Either sex','Sunrise–sunset','Shotgun, archery']},
    'Kentucky':      {spring:['Apr 19','May 5','2','Bearded only','Dawn–sunset','Shotgun, archery'],fall:['Oct 28','Nov 10','2','Either sex','Dawn–sunset','Shotgun, archery']},
    'Louisiana':     {spring:['Mar 25','Apr 22','1','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:null},
    'Maine':         {spring:['May 3','Jun 7','2','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:null},
    'Maryland':      {spring:['Apr 19','May 24','2','Bearded only','30 min before sunrise–noon (first 2 wks), all day after','Shotgun, archery'],fall:['Oct 24','Nov 2','1','Either sex','Sunrise–sunset','Shotgun, archery']},
    'Massachusetts': {spring:['Apr 28','May 24','2','Bearded only','30 min before sunrise–noon','Shotgun, archery'],fall:['Oct 20','Nov 8','1','Either sex','Sunrise–sunset','Shotgun, archery']},
    'Michigan':      {spring:['Apr 20','May 31','1','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Sep 15','Nov 14','1','Either sex','Sunrise–sunset','Shotgun, archery']},
    'Minnesota':     {spring:['Apr 15','May 31','2','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Oct 4','Nov 1','1','Either sex','Sunrise–sunset','Shotgun, archery']},
    'Mississippi':   {spring:['Mar 15','May 1','3','Gobblers only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Oct 15','Nov 15','1','Either sex','Sunrise–sunset','Shotgun, archery']},
    'Missouri':      {spring:['Apr 18','May 10','2','Bearded only','30 min before sunrise–1 PM','Shotgun, archery'],fall:['Oct 1','Nov 15','2','Either sex','Sunrise–sunset','Shotgun, archery']},
    'Montana':       {spring:['Apr 12','May 17','1','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Sep 1','Jan 1','2','Either sex','30 min before sunrise–sunset','Shotgun, archery, rifle']},
    'Nebraska':      {spring:['Apr 15','May 31','2','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Oct 1','Jan 31','2','Either sex','30 min before sunrise–sunset','Shotgun, archery']},
    'Nevada':        {spring:['Apr 10','May 5','1','Bearded only','Sunrise–sunset','Shotgun, archery'],fall:null},
    'New Hampshire': {spring:['May 1','May 31','2','Bearded only','30 min before sunrise–noon (first 2 wks), all day after','Shotgun, archery'],fall:['Oct 11','Oct 31','1','Either sex','Sunrise–sunset','Shotgun, archery']},
    'New Jersey':    {spring:['Apr 21','May 31','2','Bearded only','30 min before sunrise–noon','Shotgun, archery'],fall:['Oct 18','Nov 2','1','Either sex','Sunrise–sunset','Shotgun, archery']},
    'New Mexico':    {spring:['Apr 15','May 15','1','Bearded only','Sunrise–sunset','Shotgun, archery'],fall:['Sep 15','Nov 20','1','Either sex','Sunrise–sunset','Shotgun, archery, rifle']},
    'New York':      {spring:['May 1','May 31','2','Bearded only','Sunrise–noon (first 2 wks), all day after','Shotgun, archery'],fall:['Oct 1','Nov 15','1','Either sex','Sunrise–sunset','Shotgun, archery']},
    'North Carolina':{spring:['Apr 12','May 10','2','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Oct 14','Nov 16','1','Either sex','Sunrise–sunset','Shotgun, archery']},
    'North Dakota':  {spring:['Apr 12','May 25','2','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Oct 10','Jan 4','2','Either sex','30 min before sunrise–sunset','Shotgun, archery']},
    'Ohio':          {spring:['Apr 21','May 18','2','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Oct 12','Nov 24','1','Either sex','Sunrise–sunset','Shotgun, archery']},
    'Oklahoma':      {spring:['Apr 6','May 6','2','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Oct 15','Jan 15','1','Either sex','Sunrise–sunset','Shotgun, archery, rifle']},
    'Oregon':        {spring:['Apr 15','May 31','2','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Sep 1','Nov 30','1','Either sex','30 min before sunrise–sunset','Shotgun, archery']},
    'Pennsylvania':  {spring:['Apr 26','May 31','2','Bearded only','30 min before sunrise–noon (first 2 wks), all day after','Shotgun, archery'],fall:['Nov 1','Nov 23','1','Either sex','Sunrise–sunset','Shotgun, archery']},
    'Rhode Island':  {spring:['Apr 28','May 24','2','Bearded only','30 min before sunrise–noon','Shotgun, archery'],fall:null},
    'South Carolina':{spring:['Mar 22','May 1','3','Gobblers only','30 min before sunrise–sunset','Shotgun, archery'],fall:null},
    'South Dakota':  {spring:['Apr 12','May 31','2','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Oct 1','Jan 1','1','Either sex','30 min before sunrise–sunset','Shotgun, archery']},
    'Tennessee':     {spring:['Apr 5','May 16','4','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Oct 25','Nov 9','2','Either sex','Sunrise–sunset','Shotgun, archery']},
    'Texas':         {spring:['Mar 15','May 14','4 (annual)','Gobblers only','30 min before sunrise–sunset','Shotgun, archery, rifle'],fall:null},
    'Utah':          {spring:['Apr 26','May 31','1','Bearded only','Sunrise–sunset','Shotgun, archery'],fall:null},
    'Vermont':       {spring:['May 1','May 31','2','Bearded only','30 min before sunrise–noon','Shotgun, archery'],fall:['Oct 4','Nov 1','1','Either sex','Sunrise–sunset','Shotgun, archery']},
    'Virginia':      {spring:['Apr 12','May 31','3','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Oct 5','Nov 15','2','Either sex','Sunrise–sunset','Shotgun, archery']},
    'Washington':    {spring:['Apr 15','May 31','2','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Oct 1','Dec 15','1','Either sex','30 min before sunrise–sunset','Shotgun, archery']},
    'West Virginia': {spring:['Apr 19','May 24','2','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Oct 12','Nov 16','2','Either sex','Sunrise–sunset','Shotgun, archery']},
    'Wisconsin':     {spring:['Apr 15','May 31','1','Bearded only','30 min before sunrise–sunset','Shotgun, archery'],fall:['Sep 14','Nov 10','1','Either sex','Sunrise–sunset','Shotgun, archery']},
    'Wyoming':       {spring:['Apr 15','May 31','1','Bearded only','Sunrise–sunset','Shotgun, archery'],fall:['Sep 1','Dec 31','2','Either sex','Sunrise–sunset','Shotgun, archery, rifle']}
  };

  var sel = document.getElementById('tsState');
  states.forEach(function(s) {
    var o = document.createElement('option');
    o.value = s; o.textContent = s;
    sel.appendChild(o);
  });

  var chartData = [
    ['Alabama','Mar 15','May 1','5 (1/day)','Nov–Jan','1'],
    ['Georgia','Mar 22','May 15','3','None','—'],
    ['Missouri','Apr 18','May 10','2','Oct 1–Nov 15','2'],
    ['New York','May 1','May 31','2','Oct–Nov','1'],
    ['Pennsylvania','Apr 26','May 31','2','Nov 1–23','1'],
    ['Texas','Mar 15','May 14','4','None','—'],
    ['Virginia','Apr 12','May 31','3','Oct–Nov','2'],
    ['Wisconsin','Apr 15','May 31','1','Sep–Nov','1'],
    ['Michigan','Apr 20','May 31','1','Sep 15–Nov 14','1'],
    ['Tennessee','Apr 5','May 16','4','Oct–Nov','2']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  function calculate() {
    var state = document.getElementById('tsState').value;
    var season = document.getElementById('seasonType').value;

    if (!state) return;

    var data = seasonData[state];
    if (!data) return;

    var info = data[season];

    if (!info) {
      document.getElementById('seasonDates').textContent = 'Not available';
      document.getElementById('seasonLength').textContent = '—';
      document.getElementById('bagLimit').textContent = '—';
      document.getElementById('legalBirds').textContent = '—';
      document.getElementById('huntingHours').textContent = '—';
      document.getElementById('methods').textContent = '—';
      document.getElementById('resultTip').textContent = state + ' does not have a ' + season + ' turkey season, or turkey hunting is not available in this state.';
      var resultEl = document.getElementById('result');
      resultEl.classList.add('visible');
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    document.getElementById('seasonDates').textContent = info[0] + ' – ' + info[1];

    // Calculate approximate season length
    var months = {'Jan':0,'Feb':1,'Mar':2,'Apr':3,'May':4,'Jun':5,'Jul':6,'Aug':7,'Sep':8,'Oct':9,'Nov':10,'Dec':11};
    var openParts = info[0].split(' ');
    var closeParts = info[1].split(' ');
    var openDate = new Date(2025, months[openParts[0]], parseInt(openParts[1]));
    var closeDate = new Date(2025, months[closeParts[0]], parseInt(closeParts[1]));
    if (closeDate < openDate) closeDate.setFullYear(2026);
    var days = Math.round((closeDate - openDate) / (1000*60*60*24));
    document.getElementById('seasonLength').textContent = days + ' days';

    document.getElementById('bagLimit').textContent = info[2];
    document.getElementById('legalBirds').textContent = info[3];
    document.getElementById('huntingHours').textContent = info[4];
    document.getElementById('methods').textContent = info[5];

    var tip = state + ' ' + season + ' turkey season: ' + info[0] + ' – ' + info[1] + '. ';
    tip += 'Bag limit: ' + info[2] + '. Dates are approximate — always verify with your state wildlife agency.';
    document.getElementById('resultTip').textContent = tip;

    var resultEl = document.getElementById('result');
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
})();
