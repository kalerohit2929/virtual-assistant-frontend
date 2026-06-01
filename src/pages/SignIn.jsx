import React, { useContext, useState } from 'react'
import { IoEye, IoEyeOff } from "react-icons/io5"
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../context/UserContext'
import axios from "axios"

function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const { serverUrl, setUserData } = useContext(userDataContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")

  const handleSignIn = async (e) => {
    e.preventDefault()
    setErr("")
    setLoading(true)
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signin`, { email, password }, { withCredentials: true })
      setUserData(result.data)
      setLoading(false)
      navigate("/")
    } catch (error) {
      setUserData(null)
      setLoading(false)
      setErr(error.response?.data?.message || "Authentication failed")
    }
  }

  return (
    <div style={{
      width: '100%', minHeight: '100vh',
      background: 'radial-gradient(ellipse at 80% 50%, #0a0a2a 0%, #000008 60%, #050515 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Rajdhani', sans-serif", position: 'relative', overflow: 'hidden'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />

      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(0,100,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,100,255,0.04) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,80,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,180,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Decorative scanning line */}
      <style>{`
        @keyframes scan { 0% { top:0%; opacity:0.5; } 100% { top:100%; opacity:0; } }
        @keyframes slideIn { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        .va-input { width:100%; height:56px; outline:none; border:1.5px solid rgba(0,120,255,0.35); background:rgba(0,20,60,0.4); color:#e0eeff; padding: 0 48px 0 20px; border-radius:4px; font-size:16px; font-family:'Rajdhani',sans-serif; letter-spacing:0.5px; transition:all 0.3s; box-sizing:border-box; }
        .va-input::placeholder { color:rgba(150,180,220,0.5); }
        .va-input:focus { border-color:rgba(0,160,255,0.8); background:rgba(0,30,80,0.5); box-shadow: 0 0 20px rgba(0,120,255,0.2); }
        .va-btn { cursor:pointer; border:none; letter-spacing:2px; font-family:'Orbitron',sans-serif; font-size:13px; font-weight:700; transition:all 0.3s; }
        .va-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow: 0 8px 30px rgba(0,100,255,0.5); }
        .va-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .corner { position:absolute; width:18px; height:18px; }
        .corner-tl { top:0; left:0; border-top:2px solid #0080ff; border-left:2px solid #0080ff; }
        .corner-tr { top:0; right:0; border-top:2px solid #0080ff; border-right:2px solid #0080ff; }
        .corner-bl { bottom:0; left:0; border-bottom:2px solid #0080ff; border-left:2px solid #0080ff; }
        .corner-br { bottom:0; right:0; border-bottom:2px solid #0080ff; border-right:2px solid #0080ff; }
      `}</style>

      <div style={{
        width: '90%', maxWidth: '460px',
        background: 'rgba(2,5,25,0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,100,255,0.2)',
        padding: '50px 40px',
        position: 'relative',
        animation: 'slideIn 0.6s ease',
        boxShadow: '0 0 60px rgba(0,60,200,0.15), inset 0 0 60px rgba(0,20,80,0.2)'
      }}>
        <div className="corner corner-tl" /><div className="corner corner-tr" /><div className="corner corner-bl" /><div className="corner corner-br" />

        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '11px', letterSpacing: '4px', color: '#0080ff', marginBottom: '10px', opacity: 0.8 }}>ACCESS PORTAL</div>
          <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '26px', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '1px' }}>
            SIGN <span style={{ color: '#00aaff' }}>IN</span>
          </h1>
          <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, #0080ff, transparent)', margin: '12px auto 0' }} />
        </div>

        <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <input type="email" placeholder="Email Address" className="va-input" required value={email} onChange={e => setEmail(e.target.value)} />
            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: 'rgba(0,130,255,0.6)' }}>◈</div>
          </div>
          <div style={{ position: 'relative' }}>
            <input type={showPassword ? "text" : "password"} placeholder="Password" className="va-input" required value={password} onChange={e => setPassword(e.target.value)} />
            <div onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'rgba(0,160,255,0.7)', fontSize: '20px' }}>
              {showPassword ? <IoEyeOff /> : <IoEye />}
            </div>
          </div>

          {err && <div style={{ padding: '10px 16px', background: 'rgba(255,50,50,0.1)', border: '1px solid rgba(255,50,50,0.3)', borderRadius: '4px', color: '#ff6060', fontSize: '14px' }}>⚠ {err}</div>}

          <button type="submit" disabled={loading} className="va-btn" style={{
            marginTop: '8px', height: '54px', borderRadius: '4px',
            background: 'linear-gradient(135deg, #0040cc, #0080ff)', color: '#fff',
          }}>
            {loading ? "AUTHENTICATING..." : "ACCESS SYSTEM"}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', color: 'rgba(150,180,220,0.6)', fontSize: '14px', letterSpacing: '0.5px' }}>
          New user?{" "}
          <span onClick={() => navigate("/signup")} style={{ color: '#00aaff', cursor: 'pointer', fontWeight: 600 }}>
            CREATE ACCOUNT →
          </span>
        </div>
      </div>
    </div>
  )
}

export default SignIn
