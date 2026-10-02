import { motion } from 'framer-motion'
import { getThreatColor } from '../utils/helpers'

export default function ScoreGauge({ score }) {
  const color = getThreatColor(
    score >= 70 ? 'HIGH RISK' :
    score >= 45 ? 'SUSPICIOUS' :
    score >= 20 ? 'LOW RISK' : 'SAFE'
  )
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference

  return (
    <div style={{ position:'relative', width:140, height:140,
      display:'flex', alignItems:'center', justifyContent:'center' }}>
      <svg width={140} height={140} style={{ position:'absolute', transform:'rotate(-90deg)' }}>
        <circle cx={70} cy={70} r={54} fill="none"
          stroke="#1e2038" strokeWidth={10}/>
        <motion.circle cx={70} cy={70} r={54} fill="none"
          stroke={color} strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration:1, ease:'easeOut' }}
          style={{ filter:`drop-shadow(0 0 8px ${color})` }}/>
      </svg>
      <div style={{ textAlign:'center', zIndex:1 }}>
        <motion.div animate={{ color }}
          style={{ fontSize:36, fontWeight:700,
            fontFamily:"'JetBrains Mono',monospace" }}>
          {score}
        </motion.div>
        <div style={{ fontSize:10, color:'#5a5c7a',
          fontFamily:"'JetBrains Mono',monospace",
          letterSpacing:1 }}>RISK SCORE</div>
      </div>
    </div>
  )
}