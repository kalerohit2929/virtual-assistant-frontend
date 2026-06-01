import React, { useContext, useRef, useState } from 'react'
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/authBg.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/image7.jpeg"
import { RiImageAddLine } from "react-icons/ri"
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md"

function Customize() {
  const { serverUrl, userData, setUserData, backendImage, setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage } = useContext(userDataContext)
  const navigate = useNavigate()
  const inputImage = useRef()

  const handleImage = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const avatarOptions = [image1, image2, image3, image4, image5, image6, image7]

  return (
    <div style={{
      width: '100%', minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 0%, #0a0a2e 0%, #000008 70%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Rajdhani', sans-serif", padding: '40px 20px', boxSizing: 'border-box',
      position: 'relative', overflow: 'hidden'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />

      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(0,100,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,100,255,0.03) 1px, transparent 1px)`, backgroundSize: '60px 60px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '20%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,60,200,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .card-upload { width:100px; height:170px; background:rgba(0,10,40,0.6); border:2px dashed rgba(0,120,255,0.4); border-radius:12px; overflow:hidden; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.3s; }
        .card-upload:hover { border-color:rgba(0,180,255,0.8); box-shadow:0 0 20px rgba(0,100,255,0.3); transform:scale(1.04); }
        .card-upload.active { border:2px solid #00aaff; box-shadow:0 0 25px rgba(0,160,255,0.4); }
        @media(min-width:768px) { .card-upload { width:150px; height:240px; } }
        .next-btn { cursor:pointer; border:none; letter-spacing:3px; font-family:'Orbitron',sans-serif; font-size:13px; font-weight:700; transition:all 0.3s; background: linear-gradient(135deg, #0040cc, #0080ff); color:#fff; height:54px; padding:0 40px; border-radius:4px; margin-top:32px; }
        .next-btn:hover { transform:translateY(-3px); box-shadow:0 10px 30px rgba(0,100,255,0.5); }
        .back-btn { position:absolute; top:30px; left:30px; color:rgba(150,180,255,0.7); cursor:pointer; transition:all 0.2s; }
        .back-btn:hover { color:#00aaff; transform:translateX(-3px); }
      `}</style>

      <MdKeyboardBackspace className="back-btn" style={{ width: '28px', height: '28px' }} onClick={() => navigate("/")} />

      <div style={{ textAlign: 'center', marginBottom: '36px', animation: 'fadeUp 0.5s ease' }}>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '11px', letterSpacing: '4px', color: '#0080ff', marginBottom: '10px', opacity: 0.8 }}>STEP 1 OF 2</div>
        <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(20px,4vw,30px)', fontWeight: 900, color: '#fff', margin: 0 }}>
          CHOOSE <span style={{ color: '#00aaff' }}>AVATAR</span>
        </h1>
        <div style={{ width: '80px', height: '2px', background: 'linear-gradient(90deg, transparent, #0080ff, transparent)', margin: '12px auto 0' }} />
        <p style={{ color: 'rgba(150,180,220,0.6)', marginTop: '12px', fontSize: '15px', letterSpacing: '0.5px' }}>Select an image for your AI assistant</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', maxWidth: '900px', animation: 'fadeUp 0.6s ease' }}>
        {avatarOptions.map((img, idx) => (
          <Card key={idx} image={img} />
        ))}

        {/* Upload custom image card */}
        <div
          className={`card-upload ${selectedImage === 'input' ? 'active' : ''}`}
          onClick={() => { inputImage.current.click(); setSelectedImage('input') }}
        >
          {!frontendImage
            ? <div style={{ textAlign: 'center' }}>
                <RiImageAddLine style={{ color: '#0080ff', width: '28px', height: '28px', marginBottom: '8px' }} />
                <div style={{ color: 'rgba(150,180,220,0.6)', fontSize: '11px', letterSpacing: '1px' }}>UPLOAD</div>
              </div>
            : <img src={frontendImage} style={{ height: '100%', width: '100%', objectFit: 'cover' }} alt="custom" />
          }
        </div>
        <input type="file" accept="image/*" ref={inputImage} hidden onChange={handleImage} />
      </div>

      {selectedImage &&
        <button className="next-btn" onClick={() => navigate("/customize2")}>
          NEXT STEP →
        </button>
      }
    </div>
  )
}

export default Customize
