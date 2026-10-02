import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Search, History, BarChart2,
         BookOpen, ChevronRight, Menu, X } from 'lucide-react'
import AnalyzePage  from './pages/AnalyzePage'
import DashboardPage from './pages/DashboardPage'
import HistoryPage  from './pages/HistoryPage'
import AwarenessPage from './pages/AwarenessPage'

const NAV = [
  { id:'analyze',   label:'Analyze',   icon:Search    },
  { id:'dashboard', label:'Dashboard', icon:BarChart2  },
  { id:'history',   label:'History',   icon:History   },
  { id:'awareness', label:'Awareness', icon:BookOpen  },
]

export default function App() {
  const [page, setPage]     = useState('analyze')
  const [menuOpen, setMenu] = useState(false)

  const pages = {
    analyze:   <AnalyzePage/>,
    dashboard: <DashboardPage/>,
    history:   <HistoryPage/>,
    awareness: <AwarenessPage/>,
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)',
      display:'flex', flexDirection:'column' }}>

      {/* Top nav */}
      <header style={{
        background:'#0c0d18', borderBottom:'1px solid #1e2038',
        padding:'0 20px', height:56, display:'flex',
        alignItems:'center', justifyContent:'space-between',
        position:'sticky', top:0, zIndex:100
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:32, height:32, borderRadius:8,
            background:'linear-gradient(135deg,#a78bfa,#5b8fff)',
            display:'flex', alignItems:'center', justifyContent:'center'
          }}>
            <Shield size={17} color="#fff"/>
          </div>
          <div>
            <div style={{ fontSize:14, fontWeight:600, color:'#dde0f0',
              lineHeight:1 }}>PhishGuard</div>
            <div style={{ fontSize:9, color:'#3a3c5a',
              fontFamily:"'JetBrains Mono',monospace",
              letterSpacing:1 }}>DETECTION DASHBOARD</div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav style={{ display:'flex', gap:4 }}>
          {NAV.map(n => {
            const active = page === n.id
            return (
              <motion.button key={n.id}
                whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                onClick={() => setPage(n.id)}
                style={{
                  display:'flex', alignItems:'center', gap:6,
                  padding:'6px 12px', borderRadius:8, cursor:'pointer',
                  border: active ? '1px solid #a78bfa40' : '1px solid transparent',
                  background: active ? '#a78bfa15' : 'transparent',
                  color: active ? '#a78bfa' : '#5a5c7a',
                  fontSize:12, fontWeight:500
                }}>
                <n.icon size={13}/>
                {n.label}
                {active && <ChevronRight size={11}/>}
              </motion.button>
            )
          })}
        </nav>
      </header>

      {/* Page */}
      <main style={{ flex:1, padding:'24px 20px', maxWidth:1000,
        margin:'0 auto', width:'100%' }}>
        <AnimatePresence mode="wait">
          <motion.div key={page}
            initial={{ opacity:0, y:8 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-8 }}
            transition={{ duration:0.2 }}>
            {pages[page]}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}