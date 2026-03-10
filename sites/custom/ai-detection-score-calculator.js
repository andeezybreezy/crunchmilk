(function() {
  'use strict';

  var aiPhrases = [
    'delve', 'delving', 'it is important to note', 'it\'s important to note',
    'in today\'s world', 'in the realm of', 'landscape', 'navigate',
    'tapestry', 'multifaceted', 'comprehensive', 'furthermore',
    'in conclusion', 'as we can see', 'it is worth noting',
    'plays a crucial role', 'a testament to', 'serves as a',
    'shedding light on', 'it cannot be overstated', 'leverage',
    'harness the power', 'embark on', 'at the forefront',
    'game-changer', 'paramount', 'myriad', 'plethora',
    'in this article', 'let\'s explore', 'without further ado',
    'in summary', 'to sum up', 'overall', 'bustling',
    'ever-evolving', 'cutting-edge', 'revolutionize', 'seamlessly',
    'robust', 'streamline', 'foster', 'endeavor', 'pivotal',
    'beacon', 'resonate', 'underscores', 'not only but also'
  ];

  var contentTypeAdj = { general: 0, academic: -5, business: -3, creative: -8, technical: -3 };

  function $(id) { return document.getElementById(id); }

  var chartData = [
    ['GPTZero', '82%', '88%', '12%', 'Academic screening'],
    ['Originality.ai', '86%', '91%', '9%', 'Content marketing'],
    ['Turnitin AI', '78%', '94%', '6%', 'University papers'],
    ['Copyleaks', '80%', '89%', '11%', 'General purpose'],
    ['Sapling AI', '74%', '86%', '14%', 'Quick checks'],
    ['Winston AI', '83%', '90%', '10%', 'Publishing']
  ];
  var chartBody = document.getElementById('chartBody');
  if (chartBody) {
    chartData.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + row.join('</td><td>') + '</td>';
      chartBody.appendChild(tr);
    });
  }

  $('calcBtn').addEventListener('click', function() {
    var text = $('textInput').value.trim();
    var contentType = $('contentType').value;

    if (!text || text.split(/\s+/).length < 50) {
      $('rScore').textContent = 'Need 50+ words';
      $('result').classList.add('visible');
      $('result').style.display = 'block';
      return;
    }

    var words = text.split(/\s+/);
    var wordCount = words.length;

    // 1. Sentence length variance analysis
    var sentences = text.split(/[.!?]+/).filter(function(s) { return s.trim().length > 0; });
    var sentLengths = sentences.map(function(s) { return s.trim().split(/\s+/).length; });
    var avgSentLen = sentLengths.reduce(function(a, b) { return a + b; }, 0) / sentLengths.length;
    var sentVariance = 0;
    sentLengths.forEach(function(len) {
      sentVariance += Math.pow(len - avgSentLen, 2);
    });
    sentVariance = Math.sqrt(sentVariance / sentLengths.length);
    // Low variance = more AI-like. Human writing typically has stddev 8-15+
    var varianceScore = 0;
    if (sentVariance < 4) varianceScore = 30;
    else if (sentVariance < 6) varianceScore = 20;
    else if (sentVariance < 8) varianceScore = 10;
    else if (sentVariance < 12) varianceScore = 0;
    else varianceScore = -5;

    // 2. Vocabulary diversity (unique words / total words)
    var lowerWords = words.map(function(w) { return w.toLowerCase().replace(/[^a-z']/g, ''); }).filter(function(w) { return w.length > 0; });
    var uniqueWords = {};
    lowerWords.forEach(function(w) { uniqueWords[w] = true; });
    var vocabDiversity = Object.keys(uniqueWords).length / lowerWords.length;
    // AI typically 0.45-0.60, human 0.55-0.80
    var vocabScore = 0;
    if (vocabDiversity < 0.45) vocabScore = 25;
    else if (vocabDiversity < 0.55) vocabScore = 15;
    else if (vocabDiversity < 0.65) vocabScore = 5;
    else vocabScore = -5;

    // 3. AI phrase detection
    var textLower = text.toLowerCase();
    var phraseFlags = 0;
    var flaggedPhrases = [];
    aiPhrases.forEach(function(phrase) {
      if (textLower.indexOf(phrase) !== -1) {
        phraseFlags++;
        if (flaggedPhrases.length < 8) flaggedPhrases.push(phrase);
      }
    });
    var phraseScore = Math.min(30, phraseFlags * 6);

    // 4. Sentence length clustering (AI tends toward 15-25 word sentences)
    var midRangeCount = 0;
    sentLengths.forEach(function(len) {
      if (len >= 14 && len <= 26) midRangeCount++;
    });
    var clusterPct = (midRangeCount / sentLengths.length) * 100;
    var clusterScore = 0;
    if (clusterPct > 75) clusterScore = 15;
    else if (clusterPct > 60) clusterScore = 8;
    else clusterScore = 0;

    // 5. Paragraph structure uniformity
    var paragraphs = text.split(/\n\n+/).filter(function(p) { return p.trim().length > 0; });
    var paraLengths = paragraphs.map(function(p) { return p.trim().split(/\s+/).length; });
    var paraVariance = 0;
    if (paraLengths.length > 1) {
      var avgPara = paraLengths.reduce(function(a, b) { return a + b; }, 0) / paraLengths.length;
      paraLengths.forEach(function(len) {
        paraVariance += Math.pow(len - avgPara, 2);
      });
      paraVariance = Math.sqrt(paraVariance / paraLengths.length);
    }
    var paraScore = paraVariance < 10 && paraLengths.length > 2 ? 8 : 0;

    // Total score
    var rawScore = varianceScore + vocabScore + phraseScore + clusterScore + paraScore + contentTypeAdj[contentType];
    var detectionProb = Math.max(5, Math.min(95, rawScore + 25));

    var riskLevel = '';
    var riskColor = '';
    if (detectionProb >= 70) { riskLevel = 'High'; riskColor = '#dc2626'; }
    else if (detectionProb >= 45) { riskLevel = 'Moderate'; riskColor = '#f59e0b'; }
    else if (detectionProb >= 25) { riskLevel = 'Low'; riskColor = '#059669'; }
    else { riskLevel = 'Very Low'; riskColor = '#059669'; }

    var varianceLabel = sentVariance < 5 ? 'Low (AI-like)' : sentVariance < 9 ? 'Medium' : 'High (Human-like)';
    var vocabLabel = vocabDiversity < 0.50 ? 'Low (AI-like)' : vocabDiversity < 0.65 ? 'Medium' : 'High (Human-like)';

    $('rScore').textContent = detectionProb + '%';
    $('rScore').style.color = riskColor;
    $('rRisk').textContent = riskLevel;
    $('rRisk').style.color = riskColor;
    $('rVariance').textContent = varianceLabel;
    $('rVocab').textContent = vocabLabel;
    $('rWords').textContent = wordCount;
    $('rFlags').textContent = phraseFlags + ' found';
    $('rFlags').style.color = phraseFlags > 3 ? '#dc2626' : phraseFlags > 1 ? '#f59e0b' : '#059669';

    var d = '';
    // Detection meter
    d += '<div style="margin-bottom:16px">';
    d += '<div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-light)">';
    d += '<span>Human-like</span><span>Uncertain</span><span>AI-like</span>';
    d += '</div>';
    d += '<div style="width:100%;height:20px;background:linear-gradient(to right, #059669, #f59e0b, #dc2626);border-radius:10px;position:relative;margin-top:4px">';
    d += '<div style="position:absolute;left:' + detectionProb + '%;top:-4px;transform:translateX(-50%);width:12px;height:28px;background:#1f2937;border-radius:6px;border:2px solid white"></div>';
    d += '</div></div>';

    if (flaggedPhrases.length > 0) {
      d += '<div style="padding:14px;background:#fef2f2;border-radius:8px;margin-bottom:12px">';
      d += '<strong style="color:#dc2626">AI Phrases Detected</strong>';
      d += '<div style="margin-top:6px;font-size:0.9rem">';
      flaggedPhrases.forEach(function(p) {
        d += '<span style="display:inline-block;background:#fecaca;padding:2px 8px;border-radius:4px;margin:2px 4px;font-size:0.8rem">' + p + '</span>';
      });
      d += '</div></div>';
    }

    d += '<div style="padding:14px;background:#eef2ff;border-radius:8px;margin-bottom:12px">';
    d += '<strong>Analysis Details</strong>';
    d += '<ul style="margin:8px 0 0 0;padding-left:20px;font-size:0.9rem;line-height:1.7">';
    d += '<li>Avg sentence length: ' + avgSentLen.toFixed(1) + ' words (std dev: ' + sentVariance.toFixed(1) + ')</li>';
    d += '<li>Vocabulary diversity: ' + (vocabDiversity * 100).toFixed(1) + '% unique words</li>';
    d += '<li>Mid-range sentences (14-26 words): ' + clusterPct.toFixed(0) + '%</li>';
    d += '<li>' + sentences.length + ' sentences across ' + paragraphs.length + ' paragraph(s)</li>';
    d += '</ul></div>';

    d += '<div style="padding:12px;background:#fef3c7;border-radius:8px;font-size:0.85rem">';
    d += '<strong>Disclaimer:</strong> This is a heuristic estimate, not a definitive AI detection. False positives are common. No detection method is reliable enough for high-stakes decisions. Academic, ESL, and formulaic writing styles often trigger false positives.';
    d += '</div>';

    $('resultDetails').innerHTML = d;
    $('result').classList.add('visible');
    $('result').style.display = 'block';
  });
})();
