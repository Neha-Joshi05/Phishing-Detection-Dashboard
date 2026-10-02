module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json({
    total: 0,
    byClass: {
      'SAFE': 0, 'LOW RISK': 0,
      'SUSPICIOUS': 0, 'HIGH RISK / LIKELY PHISHING': 0
    },
    avgScore: 0, phishingRate: 0
  })
}