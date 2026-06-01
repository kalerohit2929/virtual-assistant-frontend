import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"
import { CgMenuRight } from "react-icons/cg"
import { RxCross1 } from "react-icons/rx"
import { MdSettings, MdLogout, MdHistory, MdMic, MdMicOff } from "react-icons/md"
import { RiRobot2Line } from "react-icons/ri"

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const [thinking, setThinking] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [ham, setHam] = useState(false)
  const [commandLog, setCommandLog] = useState([])
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const isRecognizingRef = useRef(false)
  const synth = window.speechSynthesis

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start()
      } catch (error) {
        if (error.name !== "InvalidStateError") console.error("Start error:", error)
      }
    }
  }

  const speak = (text) => {
    if (!text) return
    const utterence = new SpeechSynthesisUtterance(text)
    utterence.lang = 'en-US'
    const voices = window.speechSynthesis.getVoices()
    const englishVoice = voices.find(v => v.lang === 'en-US')
    if (englishVoice) utterence.voice = englishVoice
    isSpeakingRef.current = true
    utterence.onend = () => {
      setAiText("")
      isSpeakingRef.current = false
      setTimeout(() => startRecognition(), 800)
    }
    synth.cancel()
    synth.speak(utterence)
  }

  const handleCommand = (data) => {
    if (!data) return
    const { type, userInput, response } = data
    speak(response)
    setCommandLog(prev => [{ type, userInput, response, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 9)])

    const actions = {
      'google-search': () => window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, '_blank'),
      'calculator-open': () => window.open('https://www.google.com/search?q=calculator', '_blank'),
      'instagram-open': () => window.open('https://www.instagram.com/', '_blank'),
      'facebook-open': () => window.open('https://www.facebook.com/', '_blank'),
      'weather-show': () => window.open('https://www.google.com/search?q=weather', '_blank'),
      'youtube-search': () => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, '_blank'),
      'youtube-play': () => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, '_blank'),
    }
    actions[type]?.()
  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognitionRef.current = recognition
    let isMounted = true

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try { recognition.start() } catch (e) { if (e.name !== "InvalidStateError") console.error(e) }
      }
    }, 1000)

    recognition.onstart = () => { isRecognizingRef.current = true; setListening(true) }

    recognition.onend = () => {
      isRecognizingRef.current = false; setListening(false)
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) { try { recognition.start() } catch (e) { if (e.name !== "InvalidStateError") console.error(e) } }
        }, 1000)
      }
    }

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error)
      isRecognizingRef.current = false; setListening(false)
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) { try { recognition.start() } catch (e) { if (e.name !== "InvalidStateError") console.error(e) } }
        }, 1000)
      }
    }

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim()
      console.log("Heard:", transcript)

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        // Stop listening, show what user said
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)
        setUserText(transcript)
        setAiText("")
        setErrorMsg("")
        setThinking(true)

        try {
          const data = await getGeminiResponse(transcript)
          console.log("Gemini response:", data)

          if (!data) {
            setThinking(false)
            setErrorMsg("No response from assistant. Check your backend.")
            setUserText("")
            setTimeout(() => { setErrorMsg(""); startRecognition() }, 3000)
            return
          }

          setThinking(false)
          setAiText(data.response)
          setUserText("")
          handleCommand(data)

        } catch (err) {
          console.error("Gemini error:", err)
          setThinking(false)
          setErrorMsg("Error reaching assistant. Try again.")
          setUserText("")
          setTimeout(() => { setErrorMsg(""); startRecognition() }, 3000)
        }
      }
    }

    const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`)
    greeting.lang = 'en-US'
    window.speechSynthesis.speak(greeting)

    return () => {
      isMounted = false
      clearTimeout(startTimeout)
      recognition.stop()
      setListening(false)
      isRecognizingRef.current = false
    }
  }, [])

  const typeColors = {
    'google-search': '#4285F4', 'youtube-search': '#FF0000', 'youtube-play': '#FF0000',
    'general': '#00cc88', 'get-time': '#ffaa00', 'get-date': '#ffaa00',
    'get-day': '#ffaa00', 'get-month': '#ffaa00', 'calculator-open': '#00ddff',
    'instagram-open': '#e1306c', 'facebook-open': '#1877F2', 'weather-show': '#00bfff'
  }

  // Determine current status label
  const statusLabel = thinking ? 'THINKING' : isSpeakingRef.current ? 'SPEAKING' : listening ? 'LISTENING' : 'STANDBY'
  const statusColor = thinking ? '#aa44ff' : isSpeakingRef.current ? '#ffaa00' : listening ? '#00ff88' : '#0080ff'

  return (
    <div style={{
      width: '100%', height: '100vh',
      background: 'radial-gradient(ellipse at 50% 0%, #050520 0%, #000008 70%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Rajdhani', sans-serif", overflow: 'hidden', position: 'relative'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />

      {/* Grid BG */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(0,100,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,100,255,0.03) 1px, transparent 1px)`, backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      {/* Glow orbs */}
      <div style={{ position: 'absolute', top: '-20%', left: '20%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,50,180,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,150,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.5;transform:scale(1);} 50%{opacity:1;transform:scale(1.05);} }
        @keyframes ripple { 0%{transform:scale(0.8);opacity:1;} 100%{transform:scale(2.5);opacity:0;} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }
        @keyframes thinking { 0%{opacity:0.3;} 33%{opacity:1;} 66%{opacity:0.3;} 100%{opacity:0.3;} }
        .hud-btn { cursor:pointer; border:1px solid rgba(0,120,255,0.3); background:rgba(0,20,60,0.5); color:rgba(150,200,255,0.8); font-family:'Orbitron',sans-serif; font-size:10px; letter-spacing:2px; padding:10px 20px; border-radius:3px; display:flex; align-items:center; gap:8px; transition:all 0.25s; white-space:nowrap; }
        .hud-btn:hover { border-color:#0080ff; color:#00aaff; background:rgba(0,40,100,0.6); }
        .listening-ring { position:absolute; width:100%; height:100%; border-radius:50%; border:2px solid rgba(0,180,255,0.6); animation:ripple 1.5s ease-out infinite; }
        .thinking-ring { position:absolute; width:100%; height:100%; border-radius:50%; border:2px solid rgba(150,50,255,0.6); animation:ripple 1s ease-out infinite; }
        .status-dot { width:8px; height:8px; border-radius:50%; animation:blink 1.2s infinite; }
        .history-item { padding:10px 14px; border-left:2px solid rgba(0,100,255,0.3); margin-bottom:8px; background:rgba(0,15,50,0.4); border-radius:0 6px 6px 0; }
        .dot1{animation:thinking 1.2s infinite 0s;} .dot2{animation:thinking 1.2s infinite 0.4s;} .dot3{animation:thinking 1.2s infinite 0.8s;}
        @media(min-width:1024px){ .desktop-actions{display:flex !important;} .ham-icon{display:none !important;} }
        @media(min-width:1200px){ .cmd-log{display:flex !important;} }
      `}</style>

      {/* Top HUD Bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '60px',
        background: 'rgba(0,5,20,0.9)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,80,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <RiRobot2Line style={{ color: '#0080ff', width: '22px', height: '22px' }} />
          <div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '13px', fontWeight: 700, color: '#fff', letterSpacing: '2px' }}>
              {userData?.assistantName?.toUpperCase() || "ASSISTANT"}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(100,150,255,0.6)', letterSpacing: '1px' }}>VIRTUAL AI SYSTEM</div>
          </div>
        </div>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="status-dot" style={{ background: statusColor }} />
          <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '10px', color: 'rgba(150,200,255,0.7)', letterSpacing: '2px' }}>
            {statusLabel}
          </span>
        </div>

        {/* Desktop buttons */}
        <div className="desktop-actions" style={{ display: 'none', gap: '10px' }}>
          <button className="hud-btn" onClick={() => navigate("/customize")}><MdSettings />CUSTOMIZE</button>
          <button className="hud-btn" onClick={handleLogOut}><MdLogout />LOGOUT</button>
        </div>

        {/* Mobile hamburger */}
        <CgMenuRight className="ham-icon" onClick={() => setHam(true)} style={{ color: '#fff', width: '24px', height: '24px', cursor: 'pointer' }} />
      </div>

      {/* Mobile Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '300px', zIndex: 100,
        background: 'rgba(2,5,25,0.97)', backdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(0,80,255,0.2)', padding: '24px',
        transform: ham ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease', display: 'flex', flexDirection: 'column', gap: '16px'
      }}>
        <RxCross1 onClick={() => setHam(false)} style={{ color: '#fff', width: '22px', height: '22px', cursor: 'pointer', alignSelf: 'flex-end' }} />
        <button className="hud-btn" style={{ width: '100%' }} onClick={() => { navigate("/customize"); setHam(false) }}><MdSettings />CUSTOMIZE</button>
        <button className="hud-btn" style={{ width: '100%' }} onClick={handleLogOut}><MdLogout />LOGOUT</button>
        <div style={{ width: '100%', height: '1px', background: 'rgba(0,80,255,0.2)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(150,200,255,0.7)' }}>
          <MdHistory /><span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '11px', letterSpacing: '2px' }}>HISTORY</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {userData?.history?.slice().reverse().map((his, idx) => (
            <div key={idx} className="history-item">
              <div style={{ color: 'rgba(180,210,255,0.8)', fontSize: '13px' }}>{his}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '60px', padding: '0 20px', width: '100%', maxWidth: '600px' }}>

        {/* Avatar with rings */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '216px', height: '296px' }}>
          {listening && <><div className="listening-ring" style={{ animationDelay: '0s' }} /><div className="listening-ring" style={{ animationDelay: '0.5s' }} /></>}
          {thinking && <><div className="thinking-ring" style={{ animationDelay: '0s' }} /><div className="thinking-ring" style={{ animationDelay: '0.4s' }} /></>}

          <div style={{ position: 'absolute', top: '-8px', left: '-8px', width: '20px', height: '20px', borderTop: '2px solid #0080ff', borderLeft: '2px solid #0080ff' }} />
          <div style={{ position: 'absolute', top: '-8px', right: '-8px', width: '20px', height: '20px', borderTop: '2px solid #0080ff', borderRight: '2px solid #0080ff' }} />
          <div style={{ position: 'absolute', bottom: '-8px', left: '-8px', width: '20px', height: '20px', borderBottom: '2px solid #0080ff', borderLeft: '2px solid #0080ff' }} />
          <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '20px', height: '20px', borderBottom: '2px solid #0080ff', borderRight: '2px solid #0080ff' }} />

          <div style={{ width: '200px', height: '280px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,100,255,0.3)', boxShadow: `0 0 40px rgba(0,80,255,0.2)`, animation: listening ? 'pulse 1.5s ease infinite' : 'none' }}>
            <img src={userData?.assistantImage} alt="assistant" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* Assistant name */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '11px', letterSpacing: '4px', color: '#0080ff', marginBottom: '4px', opacity: 0.7 }}>ACTIVE ASSISTANT</div>
          <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '22px', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '3px' }}>
            {userData?.assistantName?.toUpperCase()}
          </h1>
        </div>

        {/* Response area */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', minHeight: '110px', width: '100%' }}>

          {/* Idle state */}
          {!aiText && !userText && !thinking && !errorMsg &&
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={userImg} alt="user" style={{ width: '70px' }} />
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '10px', color: 'rgba(100,160,255,0.5)', letterSpacing: '2px', animation: 'blink 2s infinite' }}>
                {listening ? 'LISTENING...' : 'WAITING...'}
              </div>
            </div>
          }

          {/* Thinking dots */}
          {thinking &&
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', animation: 'fadeIn 0.3s ease' }}>
              <img src={aiImg} alt="ai" style={{ width: '70px' }} />
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <div className="dot1" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#7744ff' }} />
                <div className="dot2" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#7744ff' }} />
                <div className="dot3" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#7744ff' }} />
              </div>
            </div>
          }

          {/* AI speaking */}
          {aiText && <img src={aiImg} alt="ai" style={{ width: '70px', animation: 'fadeIn 0.3s ease' }} />}

          {/* User text bubble */}
          {userText &&
            <div style={{ maxWidth: '480px', width: '100%', padding: '12px 18px', background: 'rgba(0,30,100,0.5)', border: '1px solid rgba(0,100,255,0.3)', borderRadius: '4px', animation: 'fadeIn 0.4s ease', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#0080ff', marginBottom: '5px', fontFamily: "'Orbitron', sans-serif" }}>YOU</div>
              <div style={{ color: '#e0eeff', fontSize: '15px', lineHeight: 1.5 }}>{userText}</div>
            </div>
          }

          {/* AI text bubble */}
          {aiText &&
            <div style={{ maxWidth: '480px', width: '100%', padding: '12px 18px', background: 'rgba(0,60,40,0.5)', border: '1px solid rgba(0,200,100,0.3)', borderRadius: '4px', animation: 'fadeIn 0.4s ease', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#00cc88', marginBottom: '5px', fontFamily: "'Orbitron', sans-serif" }}>{userData?.assistantName?.toUpperCase()}</div>
              <div style={{ color: '#e0eeff', fontSize: '15px', lineHeight: 1.5 }}>{aiText}</div>
            </div>
          }

          {/* Error bubble */}
          {errorMsg &&
            <div style={{ maxWidth: '480px', width: '100%', padding: '12px 18px', background: 'rgba(255,30,30,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '4px', animation: 'fadeIn 0.4s ease', textAlign: 'center' }}>
              <div style={{ color: '#ff6060', fontSize: '14px' }}>⚠ {errorMsg}</div>
            </div>
          }
        </div>

        {/* Mic status bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', border: `1px solid ${listening ? 'rgba(0,255,100,0.3)' : 'rgba(0,80,255,0.2)'}`, borderRadius: '30px', background: 'rgba(0,10,40,0.4)', transition: 'all 0.3s' }}>
          {listening
            ? <MdMic style={{ color: '#00ff88', width: '16px', height: '16px' }} />
            : <MdMicOff style={{ color: 'rgba(150,180,220,0.4)', width: '16px', height: '16px' }} />
          }
          <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '10px', letterSpacing: '2px', color: listening ? '#00ff88' : 'rgba(150,180,220,0.4)' }}>
            SAY "{userData?.assistantName?.toUpperCase()}" TO ACTIVATE
          </span>
        </div>
      </div>

      {/* Right sidebar command log (desktop only) */}
      <div className="cmd-log" style={{ position: 'absolute', right: '20px', top: '80px', width: '220px', display: 'none', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '10px', letterSpacing: '3px', color: 'rgba(100,150,255,0.6)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MdHistory style={{ width: '14px' }} /> COMMAND LOG
        </div>
        {commandLog.length === 0
          ? <div style={{ color: 'rgba(100,140,200,0.4)', fontSize: '12px' }}>No commands yet...</div>
          : commandLog.map((cmd, i) => (
            <div key={i} style={{ padding: '8px 12px', background: 'rgba(0,10,40,0.5)', borderLeft: `2px solid ${typeColors[cmd.type] || '#0080ff'}`, borderRadius: '0 4px 4px 0', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ fontSize: '11px', color: 'rgba(200,220,255,0.8)', marginBottom: '2px' }}>{cmd.userInput}</div>
              <div style={{ fontSize: '10px', color: typeColors[cmd.type] || '#0080ff', letterSpacing: '1px' }}>{cmd.type?.replace(/-/g, ' ').toUpperCase()}</div>
              <div style={{ fontSize: '9px', color: 'rgba(100,140,200,0.4)', marginTop: '2px' }}>{cmd.time}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Home
