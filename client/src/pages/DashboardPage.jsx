import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, TrendingUp,
         CheckCircle, Activity } from 'lucide-react'
import { RadialBarChart, RadialBar, ResponsiveContainer,
         PieChart, Pie, Cell, Tooltip, BarChart,
         Bar, XAxis, YAxis } from 'recharts'
import { getStats, getHistory } from '../utils/api'
import StatCard from '../components/StatCard'
import Badge    from '../components/Badge'
import { formatDate, getThreatColor } from '../utils/helpers'

export default function DashboardPage() {
  const [stats,   setStats]   = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getStats(), getHistory(20)])
      .then(([s, h]) => {
        setStats(s.data); setHistory(h.data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ textAlign:'center', padding:40, color:'#5a5c7a',
      fontFamily:"'JetBrains Mono',monospace" }}>
      Loading dashboard...
    </div>
  )

  const pieData = stats ? [
    { name:'Safe',       value: stats.byClass['SAFE'] || 0,
      color:'#00e676' },
    { name:'Low Risk',   value: stats.byClass['LOW RISK'] || 0,
      color:'#ffd600' },
    { name:'Suspicious', value: stats.byClass['SUSPICIOUS'] || 0,
      color:'#ff9100' },
    { name:'High Risk',  value: stats.byClass['HIGH RISK / LIKELY PHISHING'] || 0,
      color:'#ff1744' },
  ].filter(d => d.value > 0) : []

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:20, fontWeight:600, color:'#dde0f0',
          marginBottom:4 }}>Security Dashboard</h1>
        <p style={{ fontSize:12, color:'#5a5c7a',
          fontFamily:"'JetBrains Mono',monospace" }}>
          Real-time analytics from all analyzed emails
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)',
        gap:10, marginBottom:16 }}>
        <StatCard label="Total Analyzed" value={stats?.total || 0}
          color="#a78bfa" icon={Activity}/>
        <StatCard label="Avg Risk Score" value={stats?.avgScore || 0}
          color="#5b8fff" icon={TrendingUp}/>
        <StatCard label="Phishing Rate"
          value={`${stats?.phishingRate || 0}%`}
          color="#ff1744" icon={AlertTriangle}/>
        <StatCard label="Safe Emails"
          value={stats?.byClass?.['SAFE'] || 0}
          color="#00e676" icon={CheckCircle}/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr',
        gap:12, marginBottom:12 }}>

        {/* Pie chart */}
        <div style={{ background:'#0c0d18', border:'1px solid #1e2038',
          borderRadius:14, padding:'16px' }}>
          <div style={{ fontSize:10, color:'#3a3c5a', letterSpacing:1.5,
            textTransform:'uppercase', marginBottom:12,
            fontFamily:"'JetBrains Mono',monospace" }}>
            Classification Distribution
          </div>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%"
                    innerRadius={50} outerRadius={80}
                    dataKey="value" paddingAngle={3}>
                    {pieData.map((d, i) => (
                      <Cell key={i} fill={d.color}
                        style={{ filter:`drop-shadow(0 0 4px ${d.color})` }}/>
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background:'#0c0d18',
                      border:'1px solid #1e2038',
                      borderRadius:8, color:'#dde0f0' }}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {pieData.map((d, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center',
                    gap:5, fontSize:11 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%',
                      background:d.color }}/>
                    <span style={{ color:'#5a5c7a' }}>{d.name}</span>
                    <span style={{ color:d.color,
                      fontFamily:"'JetBrains Mono',monospace" }}>
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ color:'#3a3c5a', fontSize:12, textAlign:'center',
              padding:40 }}>No data yet — analyze some emails first</div>
          )}
        </div>

        {/* Bar chart */}
        <div style={{ background:'#0c0d18', border:'1px solid #1e2038',
          borderRadius:14, padding:'16px' }}>
          <div style={{ fontSize:10, color:'#3a3c5a', letterSpacing:1.5,
            textTransform:'uppercase', marginBottom:12,
            fontFamily:"'JetBrains Mono',monospace" }}>
            Risk by Category
          </div>
          {stats && (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { name:'Safe',   count: stats.byClass['SAFE']||0,
                  fill:'#00e676' },
                { name:'Low',    count: stats.byClass['LOW RISK']||0,
                  fill:'#ffd600' },
                { name:'Susp',   count: stats.byClass['SUSPICIOUS']||0,
                  fill:'#ff9100' },
                { name:'High',   count: stats.byClass['HIGH RISK / LIKELY PHISHING']||0,
                  fill:'#ff1744' },
              ]}>
                <XAxis dataKey="name" tick={{ fill:'#5a5c7a', fontSize:11 }}
                  axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:'#5a5c7a', fontSize:11 }}
                  axisLine={false} tickLine={false}/>
                <Tooltip
                  contentStyle={{ background:'#0c0d18',
                    border:'1px solid #1e2038',
                    borderRadius:8, color:'#dde0f0' }}/>
                <Bar dataKey="count" radius={[4,4,0,0]}>
                  {[0,1,2,3].map(i => (
                    <Cell key={i} fill={
                      ['#00e676','#ffd600','#ff9100','#ff1744'][i]
                    }
                    style={{ filter:`drop-shadow(0 0 4px ${
                      ['#00e676','#ffd600','#ff9100','#ff1744'][i]
                    })` }}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent history */}
      <div style={{ background:'#0c0d18', border:'1px solid #1e2038',
        borderRadius:14, padding:'16px' }}>
        <div style={{ fontSize:10, color:'#3a3c5a', letterSpacing:1.5,
          textTransform:'uppercase', marginBottom:12,
          fontFamily:"'JetBrains Mono',monospace" }}>
          Recent Analyses
        </div>
        {history.length === 0 ? (
          <div style={{ color:'#3a3c5a', fontSize:12, textAlign:'center',
            padding:20 }}>No analyses yet</div>
        ) : (
          history.slice(0,8).map((h, i) => (
            <motion.div key={h.id}
              initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }}
              transition={{ delay: i*0.04 }}
              style={{ display:'flex', alignItems:'center', gap:12,
                padding:'8px 0', borderBottom:'1px solid #0f101a' }}>
              <div style={{ width:36, height:36, borderRadius:8, flexShrink:0,
                background:`${getThreatColor(h.classification)}15`,
                border:`1px solid ${getThreatColor(h.classification)}40`,
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:13, fontWeight:700,
                  fontFamily:"'JetBrains Mono',monospace",
                  color: getThreatColor(h.classification) }}>
                  {h.score}
                </span>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, color:'#dde0f0',
                  overflow:'hidden', textOverflow:'ellipsis',
                  whiteSpace:'nowrap' }}>
                  {h.subject || '(no subject)'}
                </div>
                <div style={{ fontSize:10, color:'#3a3c5a',
                  fontFamily:"'JetBrains Mono',monospace" }}>
                  {h.sender} · {formatDate(h.timestamp)}
                </div>
              </div>
              <Badge classification={h.classification}/>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}