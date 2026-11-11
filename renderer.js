const webEngine = document.getElementById('web-engine');
const urlBar = document.getElementById('url-bar');
const trustBadge = document.getElementById('trust-indicator');
const shieldIcon = document.getElementById('shield-icon');

// Overlays & Drawers
const lockdownOverlay = document.getElementById('lockdown-overlay');
const threatUrlDisp = document.getElementById('threat-url-disp');
const threatLevelDisp = document.getElementById('threat-level-disp');
const threatReasonsList = document.getElementById('threat-reasons-list');
const abortBtn = document.getElementById('abort-btn');
const bypassBtn = document.getElementById('bypass-btn');

const intelPanel = document.getElementById('intel-panel');
const demoPanel = document.getElementById('demo-panel');
const intelLogsList = document.getElementById('intel-logs-list');
const trackersCountDisp = document.getElementById('trackers-blocked-count');
const heuristicsScoreDisp = document.getElementById('heuristics-score');

let pendingTargetUrl = null;

// Window Controls
document.getElementById('min-btn').addEventListener('click', () => window.sentinelAPI.minimize());
document.getElementById('max-btn').addEventListener('click', () => window.sentinelAPI.maximize());
document.getElementById('close-btn').addEventListener('click', () => window.sentinelAPI.close());

// Navigation
document.getElementById('back-btn').addEventListener('click', () => webEngine.canGoBack() && webEngine.goBack());
document.getElementById('forward-btn').addEventListener('click', () => webEngine.canGoForward() && webEngine.goForward());
document.getElementById('reload-btn').addEventListener('click', () => webEngine.reload());

function appendLog(message, type = 'neutral') {
  const li = document.createElement('li');
  li.className = `log-${type}`;
  const time = new Date().toLocaleTimeString();
  li.textContent = `[${time}] ${message}`;
  intelLogsList.prepend(li);
}

// Intercept Navigation and Apply Security Guardrails
async function navigateSecurely(targetUrl) {
  let finalUrl = targetUrl.trim();
  if (!/^https?:\/\//i.test(finalUrl)) {
    if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
      finalUrl = 'https://' + finalUrl;
    } else {
      finalUrl = `https://duckduckgo.com/?q=${encodeURIComponent(finalUrl)}`;
    }
  }

  appendLog(`Evaluating request: ${finalUrl}`, 'neutral');
  const verdict = await window.sentinelAPI.checkSecurity(finalUrl);

  heuristicsScoreDisp.textContent = `${verdict.score}/100`;

  if (!verdict.isAllowed) {
    // Intercept attack
    pendingTargetUrl = finalUrl;
    threatUrlDisp.textContent = finalUrl;
    threatLevelDisp.textContent = verdict.riskLevel;
    threatReasonsList.innerHTML = '';
    verdict.flags.forEach(f => {
      const li = document.createElement('li');
      li.textContent = f;
      threatReasonsList.appendChild(li);
    });

    shieldIcon.className = 'status-shield danger';
    trustBadge.textContent = `TRUST: ${verdict.score}%`;
    trustBadge.style.color = '#ff0055';
    lockdownOverlay.classList.remove('hidden');

    appendLog(`THREAT BLOCKED: ${verdict.flags.join(' | ')}`, 'danger');
  } else {
    // Safe or Low risk
    lockdownOverlay.classList.add('hidden');
    if (verdict.riskLevel === 'MEDIUM') {
      shieldIcon.className = 'status-shield warning';
      trustBadge.textContent = `TRUST: ${verdict.score}%`;
      trustBadge.style.color = '#ffaa00';
      appendLog(`Warning: Security degradation detected on ${finalUrl}`, 'warning');
    } else {
      shieldIcon.className = 'status-shield secure';
      trustBadge.textContent = `TRUST: ${verdict.score}%`;
      trustBadge.style.color = '#00ff66';
    }
    webEngine.loadURL(finalUrl);
  }
}

// Enter Key on Omnibar
urlBar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') navigateSecurely(urlBar.value);
});

// Update URL bar when webview completes navigation
webEngine.addEventListener('did-navigate', (e) => {
  urlBar.value = e.url;
});

// User decisions on threat screen
abortBtn.addEventListener('click', () => {
  lockdownOverlay.classList.add('hidden');
  navigateSecurely('https://duckduckgo.com');
});

bypassBtn.addEventListener('click', () => {
  lockdownOverlay.classList.add('hidden');
  appendLog(`User bypassed firewall warning for: ${pendingTargetUrl}`, 'warning');
  webEngine.loadURL(pendingTargetUrl);
});

// Telemetry & Exhibition Panel Toggles
document.getElementById('threat-panel-toggle').addEventListener('click', () => {
  intelPanel.classList.toggle('hidden');
  demoPanel.classList.add('hidden');
});

document.getElementById('demo-attack-toggle').addEventListener('click', () => {
  demoPanel.classList.toggle('hidden');
  intelPanel.classList.add('hidden');
});

document.getElementById('intel-close-btn').addEventListener('click', () => intelPanel.classList.add('hidden'));
document.getElementById('demo-close-btn').addEventListener('click', () => demoPanel.classList.add('hidden'));

// Listen for simulated attack clicks
document.querySelectorAll('.attack-demo-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    demoPanel.classList.add('hidden');
    const attackUrl = btn.getAttribute('data-url');
    urlBar.value = attackUrl;
    navigateSecurely(attackUrl);
  });
});

// Tracker Event Listener
window.sentinelAPI.onTrackerBlocked((data) => {
  trackersCountDisp.textContent = data.count;
  appendLog(`Tracker Blocked: ${data.url.substring(0, 45)}...`, 'neutral');
});
