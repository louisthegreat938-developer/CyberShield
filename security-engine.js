// Heuristic and Rule-based Threat Evaluation Engine
class SecurityEngine {
  constructor() {
    // Known high-risk and phishing simulation patterns
    this.maliciousPatterns = [
      /login.*verification/i,
      /secure.*account.*update/i,
      /paypal.*security.*check/i,
      /apple-id-verify/i,
      /metamask-wallet-recover/i,
      /free-crypto-giveaway/i,
      /bank.*verify.*password/i
    ];

    // Threat Database (Simulated blocklist + active lookups)
    this.blacklistedDomains = [
      'evil-malware-test.com',
      'phishing-demo-site.org',
      'free-nitro-generator.xyz',
      'stealer-script-payload.net',
      'verify-your-bank-securely.com'
    ];

    // Tracking & Ad domains to demonstrate telemetry filtering
    this.trackingPatterns = [
      'google-analytics.com',
      'doubleclick.net',
      'adnxs.com',
      'facebook.com/tr',
      'telemetry',
      'analytics'
    ];
  }

  evaluateUrl(urlString) {
    const report = {
      url: urlString,
      isAllowed: true,
      riskLevel: 'LOW', // LOW, MEDIUM, CRITICAL
      flags: [],
      score: 100 // 0 to 100 trust score
    };

    try {
      const parsed = new URL(urlString);

      // 1. Insecure Protocol Check
      if (parsed.protocol === 'http:') {
        report.flags.push('Unencrypted Transport (HTTP detected - vulnerable to MITM)');
        report.score -= 25;
        report.riskLevel = 'MEDIUM';
      }

      // 2. Blacklist Check
      if (this.blacklistedDomains.some(d => parsed.hostname.includes(d))) {
        report.flags.push('Exact match on Global Phishing & Malware Database');
        report.riskLevel = 'CRITICAL';
        report.isAllowed = false;
        report.score = 0;
        return report;
      }

      // 3. IDN Homograph / Punycode Attack Check (e.g. xn--...)
      if (parsed.hostname.startsWith('xn--') || parsed.hostname.includes('.xn--')) {
        report.flags.push('IDN Homograph Detected: Uses disguised lookalike characters');
        report.score -= 60;
        report.riskLevel = 'CRITICAL';
        report.isAllowed = false;
      }

      // 4. Excessive Subdomains (Domain squatting / obfuscation)
      const subdomains = parsed.hostname.split('.');
      if (subdomains.length > 4) {
        report.flags.push('High entropy/excessive subdomains (Phishing camouflage)');
        report.score -= 30;
      }

      // 5. Deceptive Keyword Matching
      for (const pattern of this.maliciousPatterns) {
        if (pattern.test(urlString)) {
          report.flags.push('Deceptive keyword combinations matched credential harvesting heuristics');
          report.score -= 50;
          break;
        }
      }

      // 6. Suspicious TLD Analysis
      const suspiciousTLDs = ['.xyz', '.top', '.work', '.click', '.tk', '.gq', '.fit'];
      if (suspiciousTLDs.some(tld => parsed.hostname.endsWith(tld))) {
        report.flags.push('High-risk Top Level Domain (Frequently abused for spam/malware)');
        report.score -= 15;
      }

      // Set final risk band
      if (report.score <= 35) {
        report.riskLevel = 'CRITICAL';
        report.isAllowed = false;
      } else if (report.score <= 75) {
        report.riskLevel = 'MEDIUM';
      }

    } catch (e) {
      report.flags.push('Invalid or unparseable URL protocol');
      report.riskLevel = 'CRITICAL';
      report.isAllowed = false;
      report.score = 0;
    }

    return report;
  }

  isTracker(urlString) {
    return this.trackingPatterns.some(pattern => urlString.includes(pattern));
  }
}

module.exports = SecurityEngine;
