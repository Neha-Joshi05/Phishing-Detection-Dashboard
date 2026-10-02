import { motion } from 'framer-motion'
import { getThreatColor, getThreatBg } from '../utils/helpers'

export default function Badge({ classification, size = 'sm' }) {
  const color = getThreatColor(classification)
  const bg    = getThreatBg(classification)
  return (
    <motion.span
      animate={{ color, borderColor: color, background: bg }}
      style={{
        display:'inline-flex', alignItems:'center', gap:5,
        padding: size==='lg' ? '6px 14px' : '3px 9px',
        borderRadius:6, border:'1px solid',
        fontSize: size==='lg' ? 13 : 11,
        fontWeight:600, fontFamily:"'JetBrains Mono',monospace",
        letterSpacing: 0.5
      }}>
      <span style={{ width:6, height:6, borderRadius:'50%',
        background:color, display:'inline-block',
        boxShadow:`0 0 6px ${color}` }}/>
      {classification || 'UNKNOWN'}
    </motion.span>
  )
}