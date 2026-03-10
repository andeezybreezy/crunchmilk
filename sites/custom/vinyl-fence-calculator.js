(function() {
  'use strict';

  var fenceLengthInput = document.getElementById('fenceLength');
  var fenceHeightSelect = document.getElementById('fenceHeight');
  var panelWidthSelect = document.getElementById('panelWidth');
  var gateCountInput = document.getElementById('gateCount');
  var pricePanelInput = document.getElementById('pricePanel');
  var pricePostInput = document.getElementById('pricePost');
  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');
  var rPanels = document.getElementById('rPanels');
  var rPosts = document.getElementById('rPosts');
  var resultDetails = document.getElementById('resultDetails');

  function fmt(n, d) {
    if (typeof d === 'undefined') d = 0;
    var parts = n.toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function calculate() {
    var totalLen = parseFloat(fenceLengthInput.value);
    if (isNaN(totalLen) || totalLen <= 0) { hideResult(); return; }

    var height = parseFloat(fenceHeightSelect.value);
    var panelW = parseFloat(panelWidthSelect.value);
    var gates = parseInt(gateCountInput.value) || 0;
    var pricePanel = parseFloat(pricePanelInput.value) || 90;
    var pricePost = parseFloat(pricePostInput.value) || 25;

    // Gates take up ~4ft each (walk gate)
    var fenceLenForPanels = totalLen - (gates * 4);
    if (fenceLenForPanels < 0) fenceLenForPanels = 0;

    var panels = Math.ceil(fenceLenForPanels / panelW);
    // Posts: 1 per panel + 1 end post + 2 per gate
    var posts = panels + 1 + (gates * 2);
    var postCaps = posts;

    // Concrete: 1.5 bags per post (50 lb quick-set), gate posts get 2
    var regularPosts = panels + 1;
    var gatePosts = gates * 2;
    var concreteBags = Math.ceil(regularPosts * 1.5) + (gatePosts * 2);

    // Gate hardware kits
    var gateKits = gates;

    // Cost estimate
    var panelCost = panels * pricePanel;
    var postCost = posts * pricePost;
    var capCost = postCaps * 5; // ~$5 per cap
    var concreteCost = concreteBags * 5; // ~$5 per 50lb bag
    var gateCost = gateKits * 200; // ~$200 per gate kit
    var totalCost = panelCost + postCost + capCost + concreteCost + gateCost;

    rPanels.textContent = panels + ' panels';
    rPosts.textContent = posts + ' posts';

    var d = '';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;font-size:0.9rem">';
    d += '<div><strong>Fence Length</strong><br>' + fmt(totalLen) + ' feet</div>';
    d += '<div><strong>Fence Height</strong><br>' + height + ' feet</div>';
    d += '<div><strong>Panel Width</strong><br>' + panelW + ' feet</div>';
    d += '<div><strong>Gates</strong><br>' + gates + ' walk gate' + (gates !== 1 ? 's' : '') + '</div>';
    d += '</div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Materials List</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:0.9rem;margin-top:8px">';
    d += '<div>Fence panels: <strong>' + panels + '</strong> (' + panelW + '\' &times; ' + height + '\')</div>';
    d += '<div>Posts: <strong>' + posts + '</strong></div>';
    d += '<div>Post caps: <strong>' + postCaps + '</strong></div>';
    if (gates > 0) d += '<div>Gate kits: <strong>' + gateKits + '</strong></div>';
    d += '<div>Concrete bags (50 lb): <strong>' + concreteBags + '</strong></div>';
    d += '<div>Post holes to dig: <strong>' + posts + '</strong></div>';
    d += '</div></div>';

    d += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #c8d0da">';
    d += '<strong style="font-size:0.95rem">Cost Estimate (materials)</strong>';
    d += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:0.9rem;margin-top:8px">';
    d += '<div>Panels: <strong>$' + fmt(panelCost) + '</strong></div>';
    d += '<div>Posts: <strong>$' + fmt(postCost) + '</strong></div>';
    d += '<div>Post caps: <strong>$' + fmt(capCost) + '</strong></div>';
    d += '<div>Concrete: <strong>$' + fmt(concreteCost) + '</strong></div>';
    if (gates > 0) d += '<div>Gate kit' + (gates > 1 ? 's' : '') + ': <strong>$' + fmt(gateCost) + '</strong></div>';
    d += '<div style="grid-column:1/-1;padding-top:8px;border-top:1px solid #e5e7eb"><strong>Total Materials: $' + fmt(totalCost) + '</strong>';
    d += '<br><span style="font-size:0.8rem;color:var(--text-light)">$' + fmt(totalCost / totalLen, 2) + ' per linear foot (materials only)</span></div>';
    d += '</div></div>';

    resultDetails.innerHTML = d;
    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
  }

  function hideResult() { resultEl.classList.remove('visible'); resultEl.style.display = 'none'; }

  calcBtn.addEventListener('click', function() {
    calculate();
    if (resultEl.classList.contains('visible')) resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  [fenceLengthInput, gateCountInput, pricePanelInput, pricePostInput].forEach(function(inp) {
    inp.addEventListener('input', calculate);
    inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });

  [fenceHeightSelect, panelWidthSelect].forEach(function(sel) { sel.addEventListener('change', calculate); });
})();
