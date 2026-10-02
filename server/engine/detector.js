// ============================================
// detector.js — Phishing Detection Engine
// Rule-based NLP + scoring system
// ============================================

// ─── Indicator dictionaries ───────────────────
const URGENCY_WORDS = [
  'urgent','immediately','act now','expire','suspend',
  'terminate','locked','verify now','confirm now',
  'limited time','within 24 hours','account will be deleted',
  'final notice','last chance','respond immediately',
  'your account has been','failure to','deactivated'
]

const FEAR_WORDS = [
  'suspended','locked','frozen','blocked','compromised',
  'unauthorized','suspicious activity','detected','breach',
  'violation','illegal','arrested','legal action','law enforcement'
]

const FINANCIAL_WORDS = [
  'wire transfer','bank account','credit card','payment required',
  'processing fee','claim your prize','won','lottery','inheritance',
  'million dollars','bank details','routing number','ssn','social security'
]

const CREDENTIAL_WORDS = [
  'verify your identity','confirm your password','enter your credentials',
  'update payment','provide your details','login to verify',
  'click here to verify','reset your password now','account verification required'
]

const SUSPICIOUS_TLDS = [
  '.tk','.ml','.ga','.cf','.gq','.xyz','.cc','.pw',
  '.top','.click','.link','.download','.loan','.win'
]

const SUSPICIOUS_KEYWORDS_URL = [
  'verify','secure','update','login','signin','account',
  'confirm','billing','payment','suspend','reset','urgent'
]

const SHORTENERS = [
  'bit.ly','tinyurl.com','goo.gl','t.co','ow.ly',
  'short.link','rb.gy','cutt.ly','is.gd'
]

const LOOKALIKE_PATTERNS = [
  /paypa[l1]/i, /g[o0]{2}gle/i, /amaz[o0]n/i, /micr[o0]s[o0]ft/i,
  /appl[e3]/i, /netfl[i1]x/i, /faceb[o0]{2}k/i, /[il1][nl]stagram/i,
  /tw[i1]tt[e3]r/i, /y[o0]utube/i, /y[a@]h[o0]{2}/i
]

const EXEC_EXTENSIONS = [
  '.exe','.bat','.cmd','.vbs','.js','.jar','.scr',
  '.pif','.com','.msi','.ps1','.sh'
]

// ─── Sender analysis ──────────────────────────
function analyzeSender(sender) {
  const indicators = []
  let score = 0

  if (!sender) return { score: 0, indicators: [] }

  const domain = sender.split('@')[1] || ''

  // Lookalike domain
  LOOKALIKE_PATTERNS.forEach(p => {
    if (p.test(domain)) {
      indicators.push({ type: 'SENDER', severity: 'HIGH',
        msg: `Lookalike domain detected: "${domain}" mimics a trusted brand` })
      score += 30
    }
  })

  // Suspicious TLD
  SUSPICIOUS_TLDS.forEach(tld => {
    if (domain.endsWith(tld)) {
      indicators.push({ type: 'SENDER', severity: 'HIGH',
        msg: `Suspicious TLD "${tld}" — commonly used in phishing` })
      score += 25
    }
  })

  // Excessive subdomains
  const parts = domain.split('.')
  if (parts.length > 4) {
    indicators.push({ type: 'SENDER', severity: 'MEDIUM',
      msg: `Excessive subdomains in sender domain (${parts.length} levels)` })
    score += 15
  }

  // Numbers in domain
  if (/\d/.test(domain)) {
    indicators.push({ type: 'SENDER', severity: 'LOW',
      msg: `Numbers found in sender domain — may indicate lookalike` })
    score += 10
  }

  // Hyphenated domain with security keywords
  if (/-/.test(domain) && /secure|verify|support|login|account/i.test(domain)) {
    indicators.push({ type: 'SENDER', severity: 'HIGH',
      msg: `Hyphenated domain with security keyword — common phishing pattern` })
    score += 20
  }

  return { score: Math.min(score, 50), indicators }
}

// ─── Subject analysis ─────────────────────────
function analyzeSubject(subject) {
  const indicators = []
  let score = 0

  if (!subject) return { score: 0, indicators: [] }

  const lower = subject.toLowerCase()

  URGENCY_WORDS.forEach(w => {
    if (lower.includes(w)) {
      indicators.push({ type: 'SUBJECT', severity: 'MEDIUM',
        msg: `Urgency language in subject: "${w}"` })
      score += 8
    }
  })

  // ALL CAPS check
  const upperCount = (subject.match(/[A-Z]/g) || []).length
  if (upperCount > subject.length * 0.5 && subject.length > 6) {
    indicators.push({ type: 'SUBJECT', severity: 'LOW',
      msg: 'Excessive capitalization in subject — common manipulation tactic' })
    score += 8
  }

  // Exclamation marks
  if ((subject.match(/!/g) || []).length > 1) {
    indicators.push({ type: 'SUBJECT', severity: 'LOW',
      msg: 'Multiple exclamation marks — urgency/excitement manipulation' })
    score += 5
  }

  // Prize/reward
  if (/won|winner|prize|reward|congratulations|selected/i.test(subject)) {
    indicators.push({ type: 'SUBJECT', severity: 'HIGH',
      msg: 'Prize/reward language in subject — classic social engineering' })
    score += 20
  }

  return { score: Math.min(score, 30), indicators }
}

// ─── Body analysis ────────────────────────────
function analyzeBody(body) {
  const indicators = []
  let score = 0

  if (!body) return { score: 0, indicators: [] }

  const lower = body.toLowerCase()

  URGENCY_WORDS.forEach(w => {
    if (lower.includes(w)) {
      indicators.push({ type: 'BODY', severity: 'MEDIUM',
        msg: `Urgency language: "${w}"` })
      score += 5
    }
  })

  FEAR_WORDS.forEach(w => {
    if (lower.includes(w)) {
      indicators.push({ type: 'BODY', severity: 'MEDIUM',
        msg: `Fear/threat language: "${w}"` })
      score += 5
    }
  })

  FINANCIAL_WORDS.forEach(w => {
    if (lower.includes(w)) {
      indicators.push({ type: 'BODY', severity: 'HIGH',
        msg: `Financial manipulation: "${w}"` })
      score += 10
    }
  })

  CREDENTIAL_WORDS.forEach(w => {
    if (lower.includes(w)) {
      indicators.push({ type: 'BODY', severity: 'HIGH',
        msg: `Credential harvesting attempt: "${w}"` })
      score += 12
    }
  })

  // Generic greeting
  if (/dear (customer|user|member|account holder|valued)/i.test(body)) {
    indicators.push({ type: 'BODY', severity: 'LOW',
      msg: 'Generic greeting — legitimate orgs usually address you by name' })
    score += 5
  }

  // Click here pattern
  if (/click here|click the link|click below/i.test(body)) {
    indicators.push({ type: 'BODY', severity: 'MEDIUM',
      msg: '"Click here" pattern — used to obscure malicious links' })
    score += 8
  }

  return { score: Math.min(score, 40), indicators }
}

// ─── URL analysis ─────────────────────────────
function analyzeURLs(urls) {
  const indicators = []
  let score = 0

  if (!urls || urls.length === 0) return { score: 0, indicators: [] }

  urls.forEach(url => {
    // Raw IP
    if (/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i.test(url)) {
      indicators.push({ type: 'URL', severity: 'HIGH',
        msg: `Raw IP address in URL: "${url}"` })
      score += 30
    }

    // HTTP (not HTTPS)
    if (url.startsWith('http://')) {
      indicators.push({ type: 'URL', severity: 'MEDIUM',
        msg: `Non-HTTPS URL: "${url}" — no encryption` })
      score += 10
    }

    // Suspicious TLD
    SUSPICIOUS_TLDS.forEach(tld => {
      if (url.includes(tld)) {
        indicators.push({ type: 'URL', severity: 'HIGH',
          msg: `Suspicious TLD in URL: "${tld}"` })
        score += 20
      }
    })

    // URL shortener
    SHORTENERS.forEach(s => {
      if (url.includes(s)) {
        indicators.push({ type: 'URL', severity: 'MEDIUM',
          msg: `URL shortener detected: "${s}" — hides true destination` })
        score += 15
      }
    })

    // Suspicious keywords
    SUSPICIOUS_KEYWORDS_URL.forEach(kw => {
      try {
        const u = new URL(url)
        if (u.hostname.includes(kw)) {
          indicators.push({ type: 'URL', severity: 'MEDIUM',
            msg: `Suspicious keyword in hostname: "${kw}"` })
          score += 8
        }
      } catch {}
    })

    // Lookalike in URL
    LOOKALIKE_PATTERNS.forEach(p => {
      if (p.test(url)) {
        indicators.push({ type: 'URL', severity: 'HIGH',
          msg: `Lookalike brand name in URL: "${url}"` })
        score += 25
      }
    })
  })

  return { score: Math.min(score, 50), indicators }
}

// ─── Attachment analysis ──────────────────────
function analyzeAttachment(filename) {
  const indicators = []
  let score = 0

  if (!filename) return { score: 0, indicators: [] }

  const lower = filename.toLowerCase()

  EXEC_EXTENSIONS.forEach(ext => {
    if (lower.endsWith(ext)) {
      indicators.push({ type: 'ATTACHMENT', severity: 'HIGH',
        msg: `Executable attachment: "${filename}" — never open unexpected executables` })
      score += 35
    }
  })

  // Double extension
  if (/\.(pdf|doc|docx|txt)\.(exe|bat|cmd|vbs)/i.test(lower)) {
    indicators.push({ type: 'ATTACHMENT', severity: 'HIGH',
      msg: `Double extension detected: "${filename}" — classic malware disguise` })
    score += 40
  }

  return { score: Math.min(score, 40), indicators }
}

// ─── Score to classification ──────────────────
function classify(totalScore) {
  if (totalScore >= 70) return 'HIGH RISK / LIKELY PHISHING'
  if (totalScore >= 45) return 'SUSPICIOUS'
  if (totalScore >= 20) return 'LOW RISK'
  return 'SAFE'
}

// ─── Generate recommendations ─────────────────
function getRecommendations(classification, indicators) {
  const recs = []

  if (classification === 'SAFE') {
    recs.push('Email appears safe — standard caution still applies')
    recs.push('Always verify sender identity before sharing sensitive info')
    return recs
  }

  if (indicators.some(i => i.type === 'URL')) {
    recs.push('Do NOT click any links in this email')
    recs.push('Hover over links to preview destination before clicking')
    recs.push('Navigate directly to the official website instead')
  }
  if (indicators.some(i => i.type === 'ATTACHMENT')) {
    recs.push('Do NOT open any attachments from this email')
    recs.push('Scan attachments with antivirus before opening')
  }
  if (indicators.some(i => i.type === 'SENDER')) {
    recs.push('Verify sender identity through official channels')
    recs.push('Check if domain matches the official company domain')
  }
  if (indicators.some(i => i.msg.includes('credential') || i.msg.includes('password'))) {
    recs.push('Never enter credentials via email links')
    recs.push('Go directly to the official website to change your password')
  }
  recs.push('Report this email to your IT/security team')
  recs.push('Mark as phishing/spam in your email client')

  return recs
}

// ─── Main detect function ─────────────────────
function detect(input) {
  const { sender, subject, body, urls, attachment } = input

  const senderResult     = analyzeSender(sender)
  const subjectResult    = analyzeSubject(subject)
  const bodyResult       = analyzeBody(body)
  const urlResult        = analyzeURLs(urls || [])
  const attachResult     = analyzeAttachment(attachment)

  const totalScore = Math.min(
    senderResult.score + subjectResult.score +
    bodyResult.score + urlResult.score + attachResult.score,
    100
  )

  const allIndicators = [
    ...senderResult.indicators,
    ...subjectResult.indicators,
    ...bodyResult.indicators,
    ...urlResult.indicators,
    ...attachResult.indicators
  ]

  const classification = classify(totalScore)
  const recommendations = getRecommendations(classification, allIndicators)

  return {
    score: totalScore,
    classification,
    indicators: allIndicators,
    recommendations,
    breakdown: {
      sender:     senderResult.score,
      subject:    subjectResult.score,
      body:       bodyResult.score,
      urls:       urlResult.score,
      attachment: attachResult.score
    }
  }
}

module.exports = { detect }