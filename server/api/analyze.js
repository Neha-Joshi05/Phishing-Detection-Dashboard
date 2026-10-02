const { detect } = require('../engine/detector')
const { v4: uuidv4 } = require('uuid')

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { sender, subject, body, urls, attachment } = req.body
    if (!body && !sender && !subject)
      return res.status(400).json({ error: 'Provide at least one field' })

    const result = detect({ sender, subject, body, urls, attachment })
    res.json({ ...result, id: uuidv4(), timestamp: new Date().toISOString() })
  } catch (err) {
    res.status(500).json({ error: 'Analysis failed' })
  }
}