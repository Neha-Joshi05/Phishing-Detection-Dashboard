import { motion } from 'framer-motion'
import { getSeverityColor } from '../utils/helpers'
import { Shield, Link, Mail, FileText, Paperclip } from 'lucide-react'

const TYPE_ICONS = {
  SENDER:     Mail,
  SUBJECT:    FileText,
  BODY:       FileText,
  URL:        Link,
  ATTACHMENT: Paperclip
}

const TYPE_COLORS = {
  SENDER:     '#a78bfa',
  SUBJECT:    '#5b8fff',
  BODY:       '#00cfff',
  URL:        '#ff9100',
  ATTACHMENT: '#ff1744'
}

export default function IndicatorCard({ indicator, index }) {
  const Icon  = TYPE_ICONS[indicator.type] || Shield
  const tColor = TYPE_COLORS[indicator.type] || '#5a5c7a'
  const sColor = getSeverityColor(indicator.severity)

  return (
    <motion.div
      initial={{ opacity:0, x:-10 }}
      animate={{ opacity:1, x:0 }}
      transition={{ delay: index * 0.05 }}
      style={{
        display:'flex', gap:10, padding:'10px 12px',
        borderRadius:8, border:'1px solid #1e2038',
        background:'#0c0d18', marginBottom:6
      }}>
      <div style={{
        width:32, height:32, borderRadius:7, flexShrink:0,
        background:`${tColor}15`, border:`1px solid ${tColor}40`,
        display:'flex', alignItems:'center', justifyContent:'center'
      }}>
        <Icon size={14} color={tColor}/>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:3 }}>
          <span style={{ fontSize:10, color:tColor,
            fontFamily:"'JetBrains Mono',monospace",
            letterSpacing:1 }}>{indicator.type}</span>
          <span style={{
            fontSize:9, padding:'1px 6px', borderRadius:4,
            border:`1px solid ${sColor}50`,
            background:`${sColor}15`, color:sColor,
            fontFamily:"'JetBrains Mono',monospace"
          }}>{indicator.severity}</span>
        </div>
        <div style={{ fontSize:12, color:'#dde0f0' }}>
          {indicator.msg}
        </div>
      </div>
    </motion.div>
  )
}