import { motion } from 'framer-motion'

const LABELS = {
  sender:     { label:'Sender',     color:'#a78bfa', max:50 },
  subject:    { label:'Subject',    color:'#5b8fff', max:30 },
  body:       { label:'Body',       color:'#00cfff', max:40 },
  urls:       { label:'URLs',       color:'#ff9100', max:50 },
  attachment: { label:'Attachment', color:'#ff1744', max:40 },
}

export default function BreakdownBar({ breakdown }) {
  if (!breakdown) return null
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {Object.entries(breakdown).map(([k, v]) => {
        const meta = LABELS[k]
        const pct  = Math.round((v / meta.max) * 100)
        return (
          <div key={k}>
            <div style={{ display:'flex', justifyContent:'space-between',
              marginBottom:4, fontSize:11 }}>
              <span style={{ color:'#5a5c7a',
                fontFamily:"'JetBrains Mono',monospace" }}>{meta.label}</span>
              <span style={{ color: meta.color,
                fontFamily:"'JetBrains Mono',monospace" }}>
                {v} / {meta.max}
              </span>
            </div>
            <div style={{ height:5, background:'#1e2038',
              borderRadius:3, overflow:'hidden' }}>
              <motion.div
                animate={{ width:`${Math.min(pct,100)}%`, background:meta.color }}
                transition={{ duration:0.6 }}
                style={{ height:'100%', borderRadius:3,
                  boxShadow:`0 0 8px ${meta.color}60` }}/>
            </div>
          </div>
        )
      })}
    </div>
  )
}