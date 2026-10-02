import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, RefreshCw } from 'lucide-react'
import { getHistory, clearHistory } from '../utils/api'
import Badge from '../components/Badge'
import { formatDate, getThreatColor } from '../utils/helpers'

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getHistory(100).then(r => setHistory(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleClear = async () => {
    if (!window.confirm('Clear all history?')) return
    await clearHistory(); setHistory([])
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center',
        justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:600, color:'#dde0f0',
            marginBottom:4 }}>Analysis History</h1>
          <p style={{ fontSize:12, color:'#5a5c7a',
            fontFamily:"'JetBrains Mono',monospace" }}>
            {history.length} records stored
          </p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={load} style={{
            padding:'7px 12px', borderRadius:8, cursor:'pointer',
            border:'1px solid #1e2038', background:'#0c0d18',
            color:'#5a5c7a', display:'flex', alignItems:'center', gap:5,
            fontSize:12 }}>
            <RefreshCw size={12}/> Refresh
          </button>
          <button onClick={handleClear} style={{
            padding:'7px 12px', borderRadius:8, cursor:'pointer',
            border:'1px solid #ff174430', background:'#ff174410',
            color:'#ff1744', display:'flex', alignItems:'center', gap:5,
            fontSize:12 }}>
            <Trash2 size={12}/> Clear
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:40, color:'#5a5c7a',
          fontFamily:"'JetBrains Mono',monospace" }}>Loading...</div>
      ) : history.length === 0 ? (
        <div style={{ textAlign:'center', padding:60, color:'#3a3c5a',
          fontFamily:"'JetBrains Mono',monospace" }}>
          No history yet — analyze an email to get started
        </div>
      ) : (
        <div style={{ background:'#0c0d18', border:'1px solid #1e2038',
          borderRadius:14, overflow:'hidden' }}>
          {/* Header row */}
          <div style={{ display:'grid',
            gridTemplateColumns:'60px 1fr 1fr 100px 80px',
            padding:'8px 16px', borderBottom:'1px solid #1e2038',
            fontSize:10, color:'#3a3c5a',
            fontFamily:"'JetBrains Mono',monospace",
            letterSpacing:1, textTransform:'uppercase' }}>
            <div>Score</div>
            <div>Subject</div>
            <div>Sender</div>
            <div>Classification</div>
            <div>Time</div>
          </div>
          {history.map((h, i) => (
            <motion.div key={h.id}
              initial={{ opacity:0 }} animate={{ opacity:1 }}
              transition={{ delay: i*0.02 }}
              style={{ display:'grid',
                gridTemplateColumns:'60px 1fr 1fr 100px 80px',
                padding:'10px 16px',
                borderBottom:'1px solid #0f101a',
                alignItems:'center', fontSize:12 }}>
              <div style={{
                width:36, height:24, borderRadius:6,
                background:`${getThreatColor(h.classification)}15`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:12, fontWeight:700,
                fontFamily:"'JetBrains Mono',monospace",
                color: getThreatColor(h.classification) }}>
                {h.score}
              </div>
              <div style={{ color:'#dde0f0', overflow:'hidden',
                textOverflow:'ellipsis', whiteSpace:'nowrap',
                paddingRight:8 }}>
                {h.subject || '(no subject)'}
              </div>
              <div style={{ color:'#5a5c7a', overflow:'hidden',
                textOverflow:'ellipsis', whiteSpace:'nowrap',
                fontFamily:"'JetBrains Mono',monospace",
                fontSize:11, paddingRight:8 }}>
                {h.sender || '—'}
              </div>
              <div><Badge classification={h.classification}/></div>
              <div style={{ color:'#3a3c5a',
                fontFamily:"'JetBrains Mono',monospace",
                fontSize:10 }}>
                {new Date(h.timestamp).toLocaleTimeString('en-IN',{
                  hour:'2-digit', minute:'2-digit'
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}