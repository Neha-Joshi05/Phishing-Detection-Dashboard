export function getThreatColor(classification) {
  if (!classification) return '#5a5c7a'
  if (classification.includes('HIGH'))        return '#ff1744'
  if (classification.includes('SUSPICIOUS'))  return '#ff9100'
  if (classification.includes('LOW'))         return '#ffd600'
  return '#00e676'
}

export function getThreatBg(classification) {
  if (!classification) return '#1a1b2e'
  if (classification.includes('HIGH'))        return '#ff174415'
  if (classification.includes('SUSPICIOUS'))  return '#ff910015'
  if (classification.includes('LOW'))         return '#ffd60015'
  return '#00e67615'
}

export function getSeverityColor(severity) {
  if (severity === 'HIGH')   return '#ff1744'
  if (severity === 'MEDIUM') return '#ff9100'
  return '#ffd600'
}

export function formatDate(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day:'2-digit', month:'short', year:'numeric',
    hour:'2-digit', minute:'2-digit'
  })
}

export function getScoreGrade(score) {
  if (score >= 70) return { grade:'F', label:'CRITICAL',  color:'#ff1744' }
  if (score >= 45) return { grade:'D', label:'HIGH',      color:'#ff9100' }
  if (score >= 20) return { grade:'C', label:'MEDIUM',    color:'#ffd600' }
  return               { grade:'A', label:'LOW',         color:'#00e676' }
}