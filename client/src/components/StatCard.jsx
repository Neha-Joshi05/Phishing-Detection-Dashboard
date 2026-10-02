import { motion } from 'framer-motion'

export default function StatCard({ label, value, color, icon: Icon, sub }) {
  return (
    <div style={{
      background:'#0c0d18', border:'1px solid #1e2038',
      borderRadius:12, padding:'14px 16px'
    }}>
      <div style={{ display:'flex', alignItems:'center',
        justifyContent:'space-between', marginBottom:8 }}>
        <span style={{ fontSize:10, color:'#3a3c5a',
          fontFamily:"'JetBrains Mono',monospace",
          letterSpacing:1.5, textTransform:'uppercase' }}>{label}</span>
        {Icon && <Icon size={14} color={color || '#5a5c7a'}/>}
      </div>
      <motion.div animate={{ color: color || '#dde0f0' }}
        style={{ fontSize:26, fontWeight:600,
          fontFamily:"'JetBrains Mono',monospace" }}>
        {value}
      </motion.div>
      {sub && <div style={{ fontSize:10, color:'#3a3c5a', marginTop:4 }}>{sub}</div>}
    </div>
  )
}