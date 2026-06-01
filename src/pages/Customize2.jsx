import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { MdKeyboardBackspace } from "react-icons/md"
import { useNavigate } from 'react-router-dom'

function Customize2() {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext)
  const [assistantName, setAssistantName] = useState(userData?.assistantName || "")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleUpdateAssistant = async () => {
    setLoading(true)
    try {
      let formData = new FormData()
      formData.append("assistantName", assistantName)
      if (backendImage) {
        formData.append("assistantImage", backendImage)
      } else {
        formData.append("imageUrl", selectedImage)
      }
      const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true })
      setLoading(false)
      setUserData(result.data)
      navigate("/")
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const suggestions = ["ARIA", "NOVA", "ECHO", "SAGE", "IRIS", "NEXUS"]

  return (
    <div style={{
      width: '100%', minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 30%, #0a0a2e 0%, #000008 70%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Rajdhani', sans-serif", padding: '40px 20px', boxSizing: 'border-box',
      position: 'relative', overflow: 'hidden'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />

      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(0,100,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,100,255,0.03) 1px, transparent 1px)`, backgroundSize: '60px 60px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,100,200,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:0.6;} 50%{opacity:1;} }
        .name-input { width:100%; max-width:520px; height:64px; outline:none; border:1.5px solid rgba(0,120,255,0.4); background:rgba(0,20,60,0.5); color:#e0eeff; padding:0 24px; border-radius:4px; font-size:20px; font-family:'Orbitron',sans-serif; letter-spacing:3px; transition:all 0.3s; text-align:center; box-sizing:border-box; }
        .name-input::placeholder { color:rgba(100,140,200,0.4); font-size:14px; letter-spacing:2px; }
        .name-input:focus { border-color:rgba(0,200,255,0.8); box-shadow:0 0 30px rgba(0,120,255,0.25); background:rgba(0,30,80,0.6); }
        .create-btn { cursor:pointer; border:none; letter-spacing:3px; font-family:'Orbitron',sans-serif; font-size:13px; font-weight:700; transition:all 0.3s; background:linear-gradient(135deg,#0040cc,#0080ff); color:#fff; height:54px; padding:0 48px; border-radius:4px; margin-top:28px; }
        .create-btn:hover:not(:disabled) { transform:translateY(-3px); box-shadow:0 10px 30px rgba(0,100,255,0.5); }
        .create-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .suggest-chip { cursor:pointer; padding:8px 16px; border:1px solid rgba(0,100,255,0.35); border-radius:3px; background:rgba(0,20,60,0.4); color:rgba(150,200,255,0.7); font-family:'Orbitron',sans-serif; font-size:10px; letter-spacing:2px; transition:all 0.25s; }
        .suggest-chip:hover { border-color:#0080ff; color:#00aaff; background:rgba(0,40,100,0.5); transform:translateY(-2px); }
        .back-btn { position:absolute; top:30px; left:30px; color:rgba(150,180,255,0.7); cursor:pointer; transition:all 0.2s; }
        .back-btn:hover { color:#00aaff; transform:translateX(-3px); }
      `}</style>

      <MdKeyboardBackspace className="back-btn" style={{ width: '28px', height: '28px' }} onClick={() => navigate("/customize")} />

      <div style={{ textAlign: 'center', marginBottom: '36px', animation: 'fadeUp 0.5s ease' }}>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '11px', letterSpacing: '4px', color: '#0080ff', marginBottom: '10px', opacity: 0.8 }}>STEP 2 OF 2</div>
        <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(20px,4vw,30px)', fontWeight: 900, color: '#fff', margin: 0 }}>
          NAME YOUR <span style={{ color: '#00aaff' }}>ASSISTANT</span>
        </h1>
        <div style={{ width: '80px', height: '2px', background: 'linear-gradient(90deg, transparent, #0080ff, transparent)', margin: '12px auto 0' }} />
        <p style={{ color: 'rgba(150,180,220,0.6)', marginTop: '12px', fontSize: '15px', letterSpacing: '0.5px' }}>Give your AI a unique identity</p>
      </div>

      <input
        type="text"
        placeholder="E.G. NOVA"
        className="name-input"
        value={assistantName}
        onChange={e => setAssistantName(e.target.value)}
        style={{ animation: 'fadeUp 0.6s ease' }}
      />

      {/* Name suggestions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px', justifyContent: 'center', animation: 'fadeUp 0.7s ease' }}>
        {suggestions.map(name => (
          <button key={name} className="suggest-chip" onClick={() => setAssistantName(name)}>{name}</button>
        ))}
      </div>

      {assistantName &&
        <button className="create-btn" disabled={loading} onClick={handleUpdateAssistant} style={{ animation: 'fadeUp 0.8s ease' }}>
          {loading ? "CREATING..." : "⬡ ACTIVATE ASSISTANT"}
        </button>
      }
    </div>
  )
}

export default Customize2
