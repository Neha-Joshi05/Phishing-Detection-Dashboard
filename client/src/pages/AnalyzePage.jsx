import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Send, AlertTriangle, CheckCircle,
         Link, Paperclip, RotateCcw } from 'lucide-react'
import { analyzeEmail } from '../utils/api'
import { getThreatColor, getThreatBg, formatDate } from '../utils/helpers'
import Badge        from '../components/Badge'
import ScoreGauge   from '../components/ScoreGauge'
import IndicatorCard from '../components/IndicatorCard'
import BreakdownBar from '../components/BreakdownBar'

export default function AnalyzePage() {
  const [form, setForm] = useState({
    sender:'', subject:'', body:'', urls:'', attachment:''
  })
  const [loading,  setLoading]  = useState(false)
  const [result,   setResult]   = useState(null)
  const [error,    setError]    = useState(null)

  const handleSubmit = async () => {
    if (!form.sender && !form.subject && !form.body) {
      setError('Please fill in at least one field'); return
    }
    setLoading(true); setError(null); setResult(null)
    try {
      const urls = form.urls
        ? form.urls.split('\n').map(u=>u.trim()).filter(Boolean)
        : []
      const { data } = await analyzeEmail({
        sender:     form.sender,
        subject:    form.subject,
        body:       form.body,
        urls,
        attachment: form.attachment || null
      })
      setResult(data)
    } catch {
      setError('Analysis failed — is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setForm({ sender:'', subject:'', body:'', urls:'', attachment:'' })
    setResult(null); setError(null)
  }

  const loadSample = (type) => {
    if (type === 'phishing') {
      setForm({
        sender: 'security@paypa1-verify.tk',
        subject: 'URGENT: Your account will be suspended in 24 hours!',
        body: 'Dear customer, we have detected suspicious activity on your PayPal account. You must verify your identity immediately or your account will be permanently suspended. Click the link below to restore access now.',
        urls: 'http://paypa1-secure.tk/verify\nhttp://bit.ly/2xKq8Lp',
        attachment: 'invoice_urgent.pdf.exe'
      })
    } else {
      setForm({
        sender: 'noreply@github.com',
        subject: 'Your pull request has been merged',
        body: 'Hi there! Your pull request #142 has been successfully merged into main. Great work! You can view the changes on the repository page.',
        urls: 'https://github.com/your-repo/pull/142',
        attachment: ''
      })
    }
    setResult(null)
  }

  const inputStyle = {
    width:'100%', background:'#0c0d18',
    border:'1px solid #1e2038', borderRadius:8,
    padding:'9px 12px', color:'#dde0f0',
    fontFamily:"'JetBrains Mono',monospace",
    fontSize:12, outline:'none', marginBottom:10,
    resize:'vertical'
  }

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:20, fontWeight:600, color:'#dde0f0',
          marginBottom:4 }}>Email Analyzer</h1>
        <p style={{ fontSize:12, color:'#5a5c7a',
          fontFamily:"'JetBrains Mono',monospace" }}>
          Paste email content to detect phishing indicators and generate a risk score
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr',
        gap:12, marginBottom:12 }}>
        <button onClick={() => loadSample('phishing')} style={{
          padding:'8px', borderRadius:8, border:'1px solid #ff174430',
          background:'#ff174410', color:'#ff1744', cursor:'pointer',
          fontSize:11, fontFamily:"'JetBrains Mono',monospace"
        }}>⚠ Load Phishing Sample</button>
        <button onClick={() => loadSample('safe')} style={{
          padding:'8px', borderRadius:8, border:'1px solid #00e67630',
          background:'#00e67610', color:'#00e676', cursor:'pointer',
          fontSize:11, fontFamily:"'JetBrains Mono',monospace"
        }}>✓ Load Safe Sample</button>
      </div>

      <div style={{ background:'#0c0d18', border:'1px solid #1e2038',
        borderRadius:14, padding:'20px', marginBottom:16 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <div>
            <label style={{ fontSize:10, color:'#5a5c7a',
              fontFamily:"'JetBrains Mono',monospace",
              letterSpacing:1, textTransform:'uppercase',
              display:'block', marginBottom:4 }}>Sender Email</label>
            <input style={inputStyle}
              placeholder="sender@example.com"
              value={form.sender}
              onChange={e => setForm({...form, sender:e.target.value})}/>
          </div>
          <div>
            <label style={{ fontSize:10, color:'#5a5c7a',
              fontFamily:"'JetBrains Mono',monospace",
              letterSpacing:1, textTransform:'uppercase',
              display:'block', marginBottom:4 }}>Attachment Name</label>
            <input style={inputStyle}
              placeholder="filename.pdf (optional)"
              value={form.attachment}
              onChange={e => setForm({...form, attachment:e.target.value})}/>
          </div>
        </div>

        <label style={{ fontSize:10, color:'#5a5c7a',
          fontFamily:"'JetBrains Mono',monospace",
          letterSpacing:1, textTransform:'uppercase',
          display:'block', marginBottom:4 }}>Subject</label>
        <input style={inputStyle}
          placeholder="Email subject line"
          value={form.subject}
          onChange={e => setForm({...form, subject:e.target.value})}/>

        <label style={{ fontSize:10, color:'#5a5c7a',
          fontFamily:"'JetBrains Mono',monospace",
          letterSpacing:1, textTransform:'uppercase',
          display:'block', marginBottom:4 }}>Email Body</label>
        <textarea style={{...inputStyle, minHeight:120}}
          placeholder="Paste email body content here..."
          value={form.body}
          onChange={e => setForm({...form, body:e.target.value})}/>

        <label style={{ fontSize:10, color:'#5a5c7a',
          fontFamily:"'JetBrains Mono',monospace",
          letterSpacing:1, textTransform:'uppercase',
          display:'block', marginBottom:4 }}>
          URLs (one per line)
        </label>
        <textarea style={{...inputStyle, minHeight:60}}
          placeholder="https://example.com&#10;http://suspicious.tk/verify"
          value={form.urls}
          onChange={e => setForm({...form, urls:e.target.value})}/>

        {error && (
          <div style={{ padding:'8px 12px', borderRadius:8, marginBottom:10,
            background:'#ff174415', border:'1px solid #ff174440',
            color:'#ff1744', fontSize:12 }}>{error}</div>
        )}

        <div style={{ display:'flex', gap:8 }}>
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            onClick={handleSubmit} disabled={loading}
            style={{
              flex:1, padding:'10px', borderRadius:8, cursor:'pointer',
              background:'linear-gradient(135deg,#a78bfa,#5b8fff)',
              border:'none', color:'#fff', fontSize:13, fontWeight:600,
              display:'flex', alignItems:'center',
              justifyContent:'center', gap:6,
              opacity: loading ? 0.7 : 1
            }}>
            {loading ? 'Analyzing...' : <><Shield size={14}/> Analyze Email</>}
          </motion.button>
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            onClick={reset}
            style={{
              padding:'10px 14px', borderRadius:8, cursor:'pointer',
              border:'1px solid #1e2038', background:'#11121e',
              color:'#5a5c7a', display:'flex', alignItems:'center', gap:5
            }}>
            <RotateCcw size={13}/> Reset
          </motion.button>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0 }}>

            {/* Score + classification */}
            <div style={{
              background:'#0c0d18',
              border:`1px solid ${getThreatColor(result.classification)}40`,
              borderRadius:14, padding:'20px', marginBottom:12,
              boxShadow:`0 0 24px ${getThreatColor(result.classification)}15`
            }}>
              <div style={{ display:'flex', alignItems:'center',
                gap:24, flexWrap:'wrap' }}>
                <ScoreGauge score={result.score}/>
                <div style={{ flex:1 }}>
                  <Badge classification={result.classification} size="lg"/>
                  <div style={{ fontSize:12, color:'#5a5c7a', marginTop:8,
                    fontFamily:"'JetBrains Mono',monospace" }}>
                    {result.indicators.length} indicator{result.indicators.length!==1?'s':''} detected
                    &nbsp;·&nbsp;{formatDate(result.timestamp)}
                  </div>
                  <div style={{ marginTop:16 }}>
                    <div style={{ fontSize:10, color:'#3a3c5a',
                      fontFamily:"'JetBrains Mono',monospace",
                      letterSpacing:1, marginBottom:8 }}>SCORE BREAKDOWN</div>
                    <BreakdownBar breakdown={result.breakdown}/>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>

              {/* Indicators */}
              <div style={{ background:'#0c0d18', border:'1px solid #1e2038',
                borderRadius:14, padding:'16px' }}>
                <div style={{ fontSize:10, color:'#3a3c5a', letterSpacing:1.5,
                  textTransform:'uppercase', marginBottom:12,
                  fontFamily:"'JetBrains Mono',monospace" }}>
                  Phishing Indicators ({result.indicators.length})
                </div>
                {result.indicators.length === 0 ? (
                  <div style={{ display:'flex', alignItems:'center', gap:8,
                    color:'#00e676', fontSize:12 }}>
                    <CheckCircle size={16}/> No indicators detected
                  </div>
                ) : (
                  <div style={{ maxHeight:320, overflowY:'auto' }}>
                    {result.indicators.map((ind, i) => (
                      <IndicatorCard key={i} indicator={ind} index={i}/>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommendations */}
              <div style={{ background:'#0c0d18', border:'1px solid #1e2038',
                borderRadius:14, padding:'16px' }}>
                <div style={{ fontSize:10, color:'#3a3c5a', letterSpacing:1.5,
                  textTransform:'uppercase', marginBottom:12,
                  fontFamily:"'JetBrains Mono',monospace" }}>
                  Security Recommendations
                </div>
                {result.recommendations.map((r, i) => (
                  <motion.div key={i}
                    initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay: i * 0.06 }}
                    style={{ display:'flex', gap:8, padding:'7px 0',
                      borderBottom:'1px solid #0f101a', fontSize:12 }}>
                    <span style={{ color:'#a78bfa', flexShrink:0 }}>▸</span>
                    <span style={{ color:'#dde0f0' }}>{r}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}