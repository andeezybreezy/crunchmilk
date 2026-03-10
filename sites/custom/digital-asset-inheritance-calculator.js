(function() {
  'use strict';

  function $(id) { return document.getElementById(id); }
  function fmt(n) { return '$' + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  var onlineBizValues = { none: 0, small: 5000, medium: 50000, large: 250000 };

  // Attorney cost by complexity level: [base, perOwner, trustAddon]
  var planCosts = {
    none:          { base: 2000, digital: 500, crypto: 800, bizAddon: 1500 },
    basic:         { base: 500,  digital: 300, crypto: 600, bizAddon: 1000 },
    trust:         { base: 300,  digital: 250, crypto: 500, bizAddon: 800 },
    comprehensive: { base: 200,  digital: 200, crypto: 400, bizAddon: 600 }
  };

  var chartData = [
    ['Cryptocurrency', '$1K\u2013$1M+', 'Yes, with keys', '100% loss', '$500\u20132,000'],
    ['Email Accounts', 'Priceless (records)', 'Limited access', 'Permanent lockout', '$200\u2013500'],
    ['Social Media', 'Sentimental', 'Memorial only', 'Memorialized/deleted', '$100\u2013300'],
    ['Digital Media (iTunes etc)', '$500\u20135,000', 'No (licensed)', '100% loss', 'Cannot solve'],
    ['Online Business', '$1K\u2013$1M+', 'Yes, with planning', 'Revenue loss', '$1,000\u20135,000'],
    ['Domain Names', '$100\u2013$100K+', 'Yes, transferable', 'Expiration/loss', '$300\u20131,000'],
    ['NFTs / Collectibles', '$100\u2013$100K+', 'Yes, with keys', '100% loss', '$500\u20132,000']
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
    var cryptoValue = parseFloat($('cryptoValue').value) || 0;
    var numAccounts = parseFloat($('numAccounts').value) || 0;
    var digitalMedia = parseFloat($('digitalMedia').value) || 0;
    var onlineBiz = $('onlineBiz').value;
    var existingPlan = $('existingPlan').value;
    var nftValue = parseFloat($('nftValue').value) || 0;

    var bizValue = onlineBizValues[onlineBiz];
    var totalValue = cryptoValue + digitalMedia + bizValue + nftValue;

    // Complexity assessment
    var complexityScore = 0;
    if (cryptoValue > 0) complexityScore += 2;
    if (cryptoValue > 100000) complexityScore += 2;
    if (nftValue > 0) complexityScore += 1;
    if (numAccounts > 50) complexityScore += 1;
    if (numAccounts > 100) complexityScore += 1;
    if (onlineBiz !== 'none') complexityScore += 2;
    if (onlineBiz === 'large') complexityScore += 2;

    var complexity = '';
    var compColor = '';
    if (complexityScore <= 2) { complexity = 'Simple'; compColor = '#059669'; }
    else if (complexityScore <= 5) { complexity = 'Moderate'; compColor = '#f59e0b'; }
    else { complexity = 'Complex'; compColor = '#dc2626'; }

    // Attorney fee calculation
    var pc = planCosts[existingPlan];
    var attorneyFee = pc.base;
    if (cryptoValue > 0) attorneyFee += pc.crypto;
    if (numAccounts > 20) attorneyFee += pc.digital;
    if (onlineBiz !== 'none') attorneyFee += pc.bizAddon;
    if (nftValue > 0) attorneyFee += 300;

    // Complexity multiplier
    if (complexityScore > 5) attorneyFee *= 1.5;
    else if (complexityScore > 3) attorneyFee *= 1.2;

    // Total planning cost (attorney + tools/services)
    var toolsCost = 0;
    if (cryptoValue > 0) toolsCost += 50; // Hardware wallet, seed phrase storage
    if (numAccounts > 10) toolsCost += 50; // Password manager annual
    var totalCost = attorneyFee + toolsCost;

    // At-risk value without planning
    var atRisk = cryptoValue + nftValue + digitalMedia * 0.5; // Media partially at risk
    if (onlineBiz !== 'none') atRisk += bizValue * 0.6;

    // Priority
    var priority = '';
    var priColor = '';
    if (atRisk > 100000 || cryptoValue > 50000) { priority = 'Urgent'; priColor = '#dc2626'; }
    else if (atRisk > 10000 || cryptoValue > 5000) { priority = 'High'; priColor = '#f59e0b'; }
    else if (totalValue > 1000) { priority = 'Moderate'; priColor = '#0ea5e9'; }
    else { priority = 'Low'; priColor = '#059669'; }

    $('rTotalValue').textContent = fmt(totalValue);
    $('rComplexity').textContent = complexity;
    $('rComplexity').style.color = compColor;
    $('rAttorney').textContent = fmt(attorneyFee);
    $('rTotalCost').textContent = fmt(totalCost);
    $('rAtRisk').textContent = fmt(atRisk);
    $('rAtRisk').style.color = atRisk > 10000 ? '#dc2626' : '#f59e0b';
    $('rPriority').textContent = priority;
    $('rPriority').style.color = priColor;

    var d = '';

    // Action items
    d += '<div style="padding:14px;background:#eef2ff;border-radius:8px;margin-bottom:12px">';
    d += '<strong>Recommended Actions</strong>';
    d += '<ul style="margin:8px 0 0 0;padding-left:20px;font-size:0.9rem;line-height:1.7">';
    d += '<li>Create a secure digital asset inventory (list all accounts, wallets, credentials)</li>';
    if (cryptoValue > 0) {
      d += '<li><strong style="color:#dc2626">Critical:</strong> Document crypto wallet access (seed phrases, private keys, exchange logins) in a secure location</li>';
      d += '<li>Consider a hardware wallet with documented recovery process</li>';
    }
    if (numAccounts > 10) {
      d += '<li>Use a password manager and share master access method with executor</li>';
    }
    if (onlineBiz !== 'none') {
      d += '<li>Create business succession documentation (hosting, domains, revenue accounts, passwords)</li>';
    }
    if (nftValue > 0) {
      d += '<li>Document NFT wallet access and marketplace accounts</li>';
    }
    d += '<li>Add a digital assets clause to your will or trust</li>';
    d += '<li>Designate a tech-savvy digital executor</li>';
    d += '</ul></div>';

    // Cost breakdown
    d += '<div style="padding:14px;background:#f0fdf4;border-radius:8px;margin-bottom:12px">';
    d += '<strong>Cost Breakdown</strong>';
    d += '<div style="margin-top:8px;font-size:0.9rem;line-height:1.7">';
    d += 'Attorney/legal fees: ' + fmt(attorneyFee) + '<br>';
    if (toolsCost > 0) d += 'Tools & services: ' + fmt(toolsCost) + '<br>';
    d += '<strong>Total planning cost: ' + fmt(totalCost) + '</strong><br>';
    d += 'Value protected: ' + fmt(totalValue) + '<br>';
    d += 'Cost as % of assets: ' + (totalValue > 0 ? ((totalCost / totalValue) * 100).toFixed(1) + '%' : 'N/A');
    d += '</div></div>';

    if (atRisk > totalCost * 5) {
      d += '<div style="padding:12px;background:#fef3c7;border-radius:8px;font-size:0.85rem">';
      d += '<strong>The math is clear:</strong> spending ' + fmt(totalCost) + ' to protect ' + fmt(atRisk) + ' in at-risk digital assets is a ' + (atRisk / totalCost).toFixed(0) + 'x return on investment. Without planning, these assets are at risk of permanent loss.';
      d += '</div>';
    }

    $('resultDetails').innerHTML = d;
    $('result').classList.add('visible');
    $('result').style.display = 'block';
  });
})();
