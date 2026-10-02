// ============================================
// index.js — Express API Server
// Routes: /analyze /history /stats /dataset
// ============================================
const express  = require('express')
const cors     = require('cors')
const helmet   = require('helmet')
const morgan   = require('morgan')
const { v4: uuidv4 } = require('uuid')
const fs       = require('fs')
const path     = require('path')
const { detect } = require('./engine/detector')

const app  = express()
const PORT = process.env.PORT || 5000

// ─── Middleware ───────────────────────────────
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

// ─── History store (JSON file) ───────────────
const HISTORY_FILE = path.join(__dirname, 'data', 'history.json')

function readHistory() {
  try {
    if (!fs.existsSync(HISTORY_FILE)) return []
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'))
  } catch { return [] }
}

function writeHistory(data) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2))
}

// ─── Routes ───────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Phishing Detection API running' })
})

// Analyze email
app.post('/api/analyze', (req, res) => {
  try {
    const { sender, subject, body, urls, attachment } = req.body

    if (!body && !sender && !subject) {
      return res.status(400).json({ error: 'Provide at least sender, subject, or body' })
    }

    const result = detect({ sender, subject, body, urls, attachment })

    const entry = {
      id:             uuidv4(),
      timestamp:      new Date().toISOString(),
      sender:         sender || '',
      subject:        subject || '',
      body_preview:   (body || '').substring(0, 120) + '...',
      score:          result.score,
      classification: result.classification,
      indicator_count: result.indicators.length,
      breakdown:      result.breakdown
    }

    const history = readHistory()
    history.unshift(entry)
    writeHistory(history.slice(0, 200))

    res.json({ ...result, id: entry.id, timestamp: entry.timestamp })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Analysis failed' })
  }
})

// Get history
app.get('/api/history', (req, res) => {
  const history = readHistory()
  const limit = parseInt(req.query.limit) || 50
  res.json(history.slice(0, limit))
})

// Clear history
app.delete('/api/history', (req, res) => {
  writeHistory([])
  res.json({ message: 'History cleared' })
})

// Stats
app.get('/api/stats', (req, res) => {
  const history = readHistory()
  const total = history.length
  const byClass = {
    'SAFE': 0,
    'LOW RISK': 0,
    'SUSPICIOUS': 0,
    'HIGH RISK / LIKELY PHISHING': 0
  }
  let totalScore = 0

  history.forEach(h => {
    byClass[h.classification] = (byClass[h.classification] || 0) + 1
    totalScore += h.score
  })

  res.json({
    total,
    byClass,
    avgScore: total > 0 ? Math.round(totalScore / total) : 0,
    phishingRate: total > 0
      ? Math.round((byClass['HIGH RISK / LIKELY PHISHING'] / total) * 100)
      : 0
  })
})

// Dataset
app.get('/api/dataset', (req, res) => {
  try {
    const dataset = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data', 'dataset.json'), 'utf8')
    )
    res.json(dataset)
  } catch {
    res.status(500).json({ error: 'Dataset not found' })
  }
})

// ─── Start server ─────────────────────────────
app.listen(PORT, () => {
  console.log(`🛡️  Phishing Detection API running on port ${PORT}`)
})