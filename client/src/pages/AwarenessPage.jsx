import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertTriangle, Eye, Lock,
         BookOpen, CheckCircle, XCircle } from 'lucide-react'

const TIPS = [
  { icon:Eye,           color:'#a78bfa', title:'Check the sender domain',
    body:'Always verify the full email address — not just the display name. Phishers use lookalike domains like "paypa1.com" instead of "paypal.com".' },
  { icon:Lock,          color:'#5b8fff', title:'Never enter credentials via email links',
    body:'Legitimate companies never ask for your password via email. Go directly to the official website by typing the address yourself.' },
  { icon:AlertTriangle, color:'#ff9100', title:'Beware of urgency and fear tactics',
    body:'"Your account will be deleted in 24 hours" is designed to make you panic and act without thinking. Slow down and verify through official channels.' },
  { icon:Shield,        color:'#00e676', title:'Hover before you click',
    body:'Hover over any link to preview the real destination URL in your browser status bar. If it looks suspicious, do not click.' },
]

const QUIZ = [
  {
    q: 'You receive an email from "security@paypa1-verify.tk" saying your account is suspended. What do you do?',
    options: [
      'Click the link and verify immediately',
      'Reply with your account details',
      'Go directly to paypal.com by typing it in your browser',
      'Forward to all your contacts as a warning'
    ],
    correct: 2,
    explanation: 'Always navigate directly to the official website. The domain "paypa1-verify.tk" is a lookalike using a suspicious TLD.'
  },
  {
    q: 'An email offers you $1,000,000 prize but asks for a $500 "processing fee". This is:',
    options: [
      'A legitimate lottery you entered',
      'An advance fee fraud — classic phishing scam',
      'A government rebate program',
      'A bank error in your favor'
    ],
    correct: 1,
    explanation: 'Advance fee fraud asks victims to pay upfront to receive a larger reward that never arrives. No legitimate prize requires fees.'
  },
  {
    q: 'Which URL is most suspicious?',
    options: [
      'https://amazon.com/orders',
      'https://support.google.com/account',
      'http://amaz0n-secure-verify.tk/login',
      'https://github.com/notifications'
    ],
    correct: 2,
    explanation: 'The URL uses HTTP (not HTTPS), a lookalike domain "amaz0n" with a zero, suspicious keywords, and a .tk TLD — all major phishing signals.'
  },
  {
    q: 'A legitimate email from your bank will:',
    options: [
      'Ask for your PIN via email',
      'Demand you reply with your account number',
      'Address you by your full name and never request credentials',
      'Send you an attachment called "account_urgent.exe"'
    ],
    correct: 2,
    explanation: 'Legitimate banks address you by name, never request credentials via email, and never send executable attachments.'
  },
]

export default function AwarenessPage() {
  const [quizIdx,    setQuizIdx]    = useState(0)
  const [selected,   setSelected]   = useState(null)
  const [showExp,    setShowExp]     = useState(false)
  const [score,      setScore]       = useState(0)
  const [done,       setDone]        = useState(false)

  const current = QUIZ[quizIdx]

  const handleAnswer = (i) => {
    if (selected !== null) return
    setSelected(i)
    setShowExp(true)
    if (i === current.correct) setScore(s => s + 1)
  }

  const next = () => {
    if (quizIdx + 1 >= QUIZ.length) { setDone(true); return }
    setQuizIdx(q => q + 1)
    setSelected(null); setShowExp(false)
  }

  const restart = () => {
    setQuizIdx(0); setSelected(null)
    setShowExp(false); setScore(0); setDone(false)
  }

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:20, fontWeight:600, color:'#dde0f0',
          marginBottom:4 }}>Security Awareness</h1>
        <p style={{ fontSize:12, color:'#5a5c7a',
          fontFamily:"'JetBrains Mono',monospace" }}>
          Learn to spot phishing — tips, indicators, and interactive quiz
        </p>
      </div>

      {/* Tips */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr',
        gap:10, marginBottom:16 }}>
        {TIPS.map((t, i) => (
          <motion.div key={i}
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            transition={{ delay: i*0.1 }}
            style={{ background:'#0c0d18', border:`1px solid ${t.color}30`,
              borderRadius:12, padding:'14px 16px' }}>
            <div style={{ display:'flex', alignItems:'center',
              gap:8, marginBottom:8 }}>
              <div style={{ width:30, height:30, borderRadius:8,
                background:`${t.color}15`, border:`1px solid ${t.color}40`,
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <t.icon size={14} color={t.color}/>
              </div>
              <span style={{ fontSize:13, fontWeight:500,
                color:'#dde0f0' }}>{t.title}</span>
            </div>
            <p style={{ fontSize:12, color:'#5a5c7a',
              lineHeight:1.6 }}>{t.body}</p>
          </motion.div>
        ))}
      </div>

      {/* Quiz */}
      <div style={{ background:'#0c0d18', border:'1px solid #1e2038',
        borderRadius:14, padding:'20px' }}>
        <div style={{ display:'flex', alignItems:'center',
          justifyContent:'space-between', marginBottom:16 }}>
          <div style={{ fontSize:10, color:'#3a3c5a', letterSpacing:1.5,
            textTransform:'uppercase',
            fontFamily:"'JetBrains Mono',monospace",
            display:'flex', alignItems:'center', gap:6 }}>
            <BookOpen size={11}/> Phishing Awareness Quiz
          </div>
          <div style={{ fontSize:11, color:'#a78bfa',
            fontFamily:"'JetBrains Mono',monospace" }}>
            Score: {score}/{QUIZ.length}
          </div>
        </div>

        {/* Progress */}
        <div style={{ height:3, background:'#1e2038',
          borderRadius:2, overflow:'hidden', marginBottom:16 }}>
          <motion.div
            animate={{ width:`${((quizIdx + (done?1:0)) / QUIZ.length) * 100}%` }}
            style={{ height:'100%', background:'#a78bfa', borderRadius:2 }}/>
        </div>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done"
              initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ textAlign:'center', padding:20 }}>
              <div style={{ fontSize:40, marginBottom:12 }}>
                {score >= 3 ? '🛡️' : '📚'}
              </div>
              <div style={{ fontSize:20, fontWeight:600,
                color: score >= 3 ? '#00e676' : '#ffd600',
                marginBottom:8 }}>
                {score}/{QUIZ.length} correct
              </div>
              <div style={{ fontSize:13, color:'#5a5c7a', marginBottom:16 }}>
                {score === 4 ? 'Excellent! You can spot phishing like a SOC analyst.' :
                 score >= 2 ? 'Good job! Review the tips above to sharpen your skills.' :
                 'Keep learning — phishing awareness takes practice.'}
              </div>
              <button onClick={restart} style={{
                padding:'8px 20px', borderRadius:8, cursor:'pointer',
                background:'linear-gradient(135deg,#a78bfa,#5b8fff)',
                border:'none', color:'#fff', fontSize:13 }}>
                Retake Quiz
              </button>
            </motion.div>
          ) : (
            <motion.div key={quizIdx}
              initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:-20 }}>
              <div style={{ fontSize:14, color:'#dde0f0', marginBottom:16,
                lineHeight:1.6 }}>
                <span style={{ color:'#a78bfa',
                  fontFamily:"'JetBrains Mono',monospace",
                  fontSize:11, marginRight:8 }}>
                  Q{quizIdx+1}/{QUIZ.length}
                </span>
                {current.q}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {current.options.map((opt, i) => {
                  let borderColor = '#1e2038'
                  let bg         = '#11121e'
                  let color      = '#dde0f0'
                  if (selected !== null) {
                    if (i === current.correct) {
                      borderColor='#00e676'; bg='#00e67615'; color='#00e676'
                    } else if (i === selected && i !== current.correct) {
                      borderColor='#ff1744'; bg='#ff174415'; color='#ff1744'
                    }
                  }
                  return (
                    <motion.button key={i}
                      whileHover={{ scale: selected===null ? 1.01 : 1 }}
                      whileTap={{ scale: selected===null ? 0.99 : 1 }}
                      onClick={() => handleAnswer(i)}
                      style={{
                        padding:'10px 14px', borderRadius:8, cursor:'pointer',
                        border:`1px solid ${borderColor}`, background:bg,
                        color, fontSize:12, textAlign:'left',
                        display:'flex', alignItems:'center', gap:8,
                        transition:'all 0.2s'
                      }}>
                      {selected !== null && i === current.correct &&
                        <CheckCircle size={13} color="#00e676"/>}
                      {selected !== null && i === selected &&
                        i !== current.correct &&
                        <XCircle size={13} color="#ff1744"/>}
                      {opt}
                    </motion.button>
                  )
                })}
              </div>
              {showExp && (
                <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                  style={{ marginTop:12, padding:'10px 14px', borderRadius:8,
                    background: selected===current.correct ? '#00e67610' : '#ff174410',
                    border:`1px solid ${selected===current.correct ? '#00e67640':'#ff174440'}`,
                    fontSize:12,
                    color: selected===current.correct ? '#00e676' : '#ff9100' }}>
                  {current.explanation}
                </motion.div>
              )}
              {selected !== null && (
                <motion.button initial={{ opacity:0 }} animate={{ opacity:1 }}
                  whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                  onClick={next}
                  style={{ marginTop:12, padding:'8px 20px', borderRadius:8,
                    cursor:'pointer', border:'none',
                    background:'linear-gradient(135deg,#a78bfa,#5b8fff)',
                    color:'#fff', fontSize:12, fontWeight:500 }}>
                  {quizIdx + 1 >= QUIZ.length ? 'See Results' : 'Next Question →'}
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}