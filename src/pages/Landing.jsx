import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  speed: Math.random() * 0.3 + 0.1,
  opacity: Math.random() * 0.5 + 0.1,
}))

const FEATURES = [
  {
    icon: '🎙️',
    title: 'Voice Activated',
    desc: 'Speak naturally and your assistant listens, understands, and responds in real time.',
  },
  {
    icon: '🤖',
    title: 'AI Powered',
    desc: 'Backed by Gemini — conversational intelligence that learns from every interaction.',
  },
  {
    icon: '🎨',
    title: 'Fully Customizable',
    desc: 'Choose your assistant\'s name, avatar, and personality to match your vibe.',
  },
  {
    icon: '⚡',
    title: 'Instant Response',
    desc: 'Zero lag. Your assistant thinks and speaks as fast as you do.',
  },
]

export default function Landing() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let time = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.005

      // Animated grid
      ctx.strokeStyle = 'rgba(0, 120, 255, 0.06)'
      ctx.lineWidth = 1
      const gridSize = 60
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Floating particles
      PARTICLES.forEach((p) => {
        const x = (p.x / 100) * canvas.width
        const y = ((p.y + time * p.speed * 10) % 100) / 100 * canvas.height
        const pulse = Math.sin(time * 2 + p.id) * 0.3 + 0.7
        ctx.beginPath()
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 160, 255, ${p.opacity * pulse})`
        ctx.fill()
      })

      // Center orb glow
      const cx = canvas.width / 2
      const cy = canvas.height * 0.38
      const r = 180 + Math.sin(time) * 20
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      grad.addColorStop(0, 'rgba(0, 100, 255, 0.12)')
      grad.addColorStop(0.5, 'rgba(0, 60, 200, 0.06)')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fill()

      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 60% 0%, #050520 0%, #000008 50%, #030318 100%)',
      fontFamily: "'Rajdhani', 'Orbitron', sans-serif",
      color: '#e0eeff',
      overflowX: 'hidden',
      position: 'relative',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;600;700;900&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes pulse-ring { 0%,100% { transform:scale(1); opacity:0.6; } 50% { transform:scale(1.08); opacity:1; } }
        @keyframes scan-line { 0% { top:0%; opacity:0.6; } 100% { top:100%; opacity:0; } }
        @keyframes float { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-12px); } }
        @keyframes spin-slow { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }

        .land-btn-primary {
          background: linear-gradient(135deg, #0050dd, #0090ff);
          color: #fff;
          border: none;
          padding: 16px 44px;
          font-family: 'Orbitron', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 3px;
          cursor: pointer;
          position: relative;
          clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
          transition: all 0.3s;
        }
        .land-btn-primary:hover {
          background: linear-gradient(135deg, #0070ff, #00b4ff);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,120,255,0.45);
        }

        .land-btn-secondary {
          background: transparent;
          color: #60b4ff;
          border: 1.5px solid rgba(0,130,255,0.4);
          padding: 15px 40px;
          font-family: 'Orbitron', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2.5px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .land-btn-secondary:hover {
          border-color: rgba(0,180,255,0.8);
          color: #00d4ff;
          background: rgba(0,100,255,0.08);
          transform: translateY(-2px);
        }

        .feature-card {
          background: rgba(2, 8, 30, 0.7);
          border: 1px solid rgba(0,100,255,0.15);
          padding: 32px 28px;
          position: relative;
          transition: all 0.4s;
        }
        .feature-card:hover {
          border-color: rgba(0,150,255,0.4);
          background: rgba(5,15,50,0.85);
          transform: translateY(-4px);
        }
        .feature-card::before {
          content:'';
          position:absolute;
          top:0;left:0;
          width:40px;height:2px;
          background: linear-gradient(90deg, #0080ff, transparent);
        }

        .stat-item {
          text-align: center;
          padding: 20px;
          border: 1px solid rgba(0,100,255,0.1);
          background: rgba(0,20,60,0.3);
          transition: all 0.3s;
        }
        .stat-item:hover {
          border-color: rgba(0,150,255,0.3);
          background: rgba(0,30,80,0.4);
        }

        .nav-link {
          color: rgba(180,210,255,0.7);
          font-family: 'Rajdhani', sans-serif;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.2s;
          background: none;
          border: none;
          padding: 0;
        }
        .nav-link:hover { color: #60b4ff; }

        .orb-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(0,120,255,0.2);
          animation: pulse-ring 3s ease-in-out infinite;
        }
        .hero-title-char {
          display: inline-block;
          animation: fadeUp 0.6s ease both;
        }
      `}</style>

      {/* Canvas background */}
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />

      {/* Nav */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 60px',
        borderBottom: '1px solid rgba(0,100,255,0.1)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, border: '2px solid #0080ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⬡</div>
          <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: 2 }}>VOXAI</span>
        </div>
        <div style={{ display: 'flex', gap: 36 }}>
          <button className="nav-link">Features</button>
          <button className="nav-link">How it works</button>
          <button className="nav-link">About</button>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="land-btn-secondary" style={{ padding: '10px 24px', fontSize: '11px' }} onClick={() => navigate('/signin')}>
            SIGN IN
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        position: 'relative', zIndex: 5,
        minHeight: '85vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 20px',
      }}>
        {/* Orb rings */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}>
          {[260, 340, 420, 500].map((r, i) => (
            <div key={r} className="orb-ring" style={{ width: r, height: r, top: -r/2, left: -r/2, animationDelay: `${i * 0.6}s`, opacity: 1 - i * 0.2 }} />
          ))}
        </div>

        {/* AI Avatar orb */}
        <div style={{ animation: 'float 4s ease-in-out infinite', marginBottom: 40, position: 'relative' }}>
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #1060ff, #003099)',
            border: '2px solid rgba(0,150,255,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 48,
            boxShadow: '0 0 60px rgba(0,100,255,0.35), inset 0 0 30px rgba(0,60,200,0.3)',
            position: 'relative',
          }}>
            🤖
            {/* Spinning ring */}
            <div style={{
              position: 'absolute', inset: -12,
              borderRadius: '50%',
              border: '1px dashed rgba(0,150,255,0.35)',
              animation: 'spin-slow 8s linear infinite',
            }} />
          </div>
        </div>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(0,80,200,0.15)',
          border: '1px solid rgba(0,120,255,0.3)',
          borderRadius: 2,
          padding: '6px 16px',
          marginBottom: 28,
          animation: visible ? 'fadeIn 0.8s ease both' : 'none',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e5ff', boxShadow: '0 0 8px #00e5ff' }} />
          <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 10, letterSpacing: 3, color: '#60ccff' }}>AI ASSISTANT ONLINE</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 'clamp(36px, 7vw, 76px)',
          fontWeight: 900,
          lineHeight: 1.1,
          margin: '0 0 24px',
          animation: visible ? 'fadeUp 0.8s ease 0.2s both' : 'none',
        }}>
          <span style={{ color: '#fff' }}>YOUR PERSONAL</span><br />
          <span style={{ background: 'linear-gradient(90deg, #0080ff, #00d4ff, #0060ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI COMPANION
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 18,
          color: 'rgba(160,200,255,0.75)',
          maxWidth: 560,
          lineHeight: 1.7,
          marginBottom: 44,
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 400,
          letterSpacing: 0.5,
          animation: visible ? 'fadeUp 0.8s ease 0.4s both' : 'none',
        }}>
          A voice-powered virtual assistant that listens, thinks, and responds — customized entirely to you.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center',
          animation: visible ? 'fadeUp 0.8s ease 0.6s both' : 'none',
        }}>
          <button className="land-btn-primary" onClick={() => navigate('/signup')}>
            GET STARTED
          </button>
          <button className="land-btn-secondary" onClick={() => navigate('/signin')}>
            SIGN IN →
          </button>
        </div>

        {/* Scan line effect */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(0,150,255,0.3), transparent)',
            animation: 'scan-line 6s linear infinite',
          }} />
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ position: 'relative', zIndex: 5, padding: '0 60px 60px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1,
          border: '1px solid rgba(0,100,255,0.15)',
          overflow: 'hidden',
        }}>
          {[
            { val: '99.9%', label: 'Uptime' },
            { val: '<50ms', label: 'Response Time' },
            { val: '∞', label: 'Conversations' },
            { val: '24/7', label: 'Always Active' },
          ].map((s) => (
            <div key={s.label} className="stat-item">
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 28, fontWeight: 700, color: '#0090ff', marginBottom: 6 }}>{s.val}</div>
              <div style={{ fontSize: 12, letterSpacing: 2, color: 'rgba(150,190,255,0.6)', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 5, padding: '60px 60px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 11, letterSpacing: 4, color: '#0080ff', marginBottom: 14 }}>CAPABILITIES</div>
          <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, color: '#fff', margin: 0 }}>
            BUILT FOR THE FUTURE
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 2 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, fontWeight: 700, color: '#c0e0ff', letterSpacing: 1, margin: '0 0 12px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(140,180,230,0.7)', lineHeight: 1.6, margin: 0, fontFamily: "'Rajdhani',sans-serif" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section style={{
        position: 'relative', zIndex: 5,
        margin: '0 60px 80px',
        padding: '60px 40px',
        background: 'rgba(0,20,70,0.4)',
        border: '1px solid rgba(0,100,255,0.2)',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: 400, height: 200, background: 'radial-gradient(ellipse, rgba(0,80,255,0.12), transparent)', pointerEvents: 'none' }} />
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 11, letterSpacing: 4, color: '#0090ff', marginBottom: 16 }}>READY TO BEGIN</div>
        <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(20px, 3vw, 34px)', fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>
          ACTIVATE YOUR ASSISTANT
        </h2>
        <p style={{ color: 'rgba(160,200,255,0.65)', fontFamily: "'Rajdhani',sans-serif", fontSize: 16, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
          Create your account, customize your AI, and start your first conversation in under 2 minutes.
        </p>
        <button className="land-btn-primary" onClick={() => navigate('/signup')} style={{ fontSize: 14 }}>
          CREATE FREE ACCOUNT
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 5,
        borderTop: '1px solid rgba(0,100,255,0.1)',
        padding: '28px 60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
      }}>
        {/* Left: brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 26, height: 26, border: '1.5px solid rgba(0,130,255,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#0090ff' }}>⬡</div>
          <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, fontWeight: 700, color: 'rgba(140,180,255,0.7)', letterSpacing: 2 }}>VOXAI</span>
          <span style={{ color: 'rgba(80,120,200,0.4)', fontSize: 12 }}>·</span>
          <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 12, color: 'rgba(100,150,220,0.45)', letterSpacing: 1 }}>© 2026</span>
        </div>

        {/* Center: powered by */}
        <span style={{ fontSize: 11, color: 'rgba(100,150,220,0.35)', fontFamily: "'Rajdhani',sans-serif", letterSpacing: 2, textTransform: 'uppercase' }}>Powered by Gemini AI</span>

        {/* Right: social icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/rohit-kale-5bba80329"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            style={{
              width: 36, height: 36,
              border: '1px solid rgba(0,120,255,0.25)',
              borderRadius: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(140,180,255,0.6)',
              textDecoration: 'none',
              transition: 'all 0.3s',
              fontSize: 16,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,180,255,0.7)'; e.currentTarget.style.color = '#00aaff'; e.currentTarget.style.background = 'rgba(0,100,255,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,120,255,0.25)'; e.currentTarget.style.color = 'rgba(140,180,255,0.6)'; e.currentTarget.style.background = 'transparent' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>

          {/* Portfolio */}
          <a
            href="https://rohitkaleportfolio.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            title="Portfolio"
            style={{
              width: 36, height: 36,
              border: '1px solid rgba(0,120,255,0.25)',
              borderRadius: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(140,180,255,0.6)',
              textDecoration: 'none',
              transition: 'all 0.3s',
              fontSize: 16,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,180,255,0.7)'; e.currentTarget.style.color = '#00aaff'; e.currentTarget.style.background = 'rgba(0,100,255,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,120,255,0.25)'; e.currentTarget.style.color = 'rgba(140,180,255,0.6)'; e.currentTarget.style.background = 'transparent' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
            </svg>
          </a>
        </div>
      </footer>
    </div>
  )
}
