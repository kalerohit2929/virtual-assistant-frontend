import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

function Card({ image }) {
  const { setUserData, setBackendImage, setFrontendImage, selectedImage, setSelectedImage } = useContext(userDataContext)
  const isSelected = selectedImage === image

  return (
    <div
      onClick={() => {
        setSelectedImage(image)
        setBackendImage(null)
        setFrontendImage(null)
      }}
      style={{
        width: '100px', height: '170px',
        borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', position: 'relative',
        border: isSelected ? '2px solid #00aaff' : '1.5px solid rgba(0,100,255,0.25)',
        boxShadow: isSelected ? '0 0 25px rgba(0,160,255,0.5), 0 0 60px rgba(0,80,255,0.2)' : 'none',
        transform: isSelected ? 'scale(1.06)' : 'scale(1)',
        transition: 'all 0.25s ease',
        background: 'rgba(0,10,40,0.6)',
      }}
      onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.border = '1.5px solid rgba(0,160,255,0.6)'; e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0,100,255,0.25)' } }}
      onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.border = '1.5px solid rgba(0,100,255,0.25)'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' } }}
    >
      <img src={image} style={{ height: '100%', width: '100%', objectFit: 'cover' }} alt="avatar" />

      {/* Selected overlay */}
      {isSelected && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,80,255,0.3), transparent)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '10px'
        }}>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '9px', letterSpacing: '2px', color: '#00ddff', background: 'rgba(0,10,40,0.8)', padding: '4px 10px', borderRadius: '2px', border: '1px solid rgba(0,180,255,0.4)' }}>
            SELECTED
          </div>
        </div>
      )}

      {/* Corner decorations on selected */}
      {isSelected && <>
        <div style={{ position: 'absolute', top: '6px', left: '6px', width: '10px', height: '10px', borderTop: '2px solid #00aaff', borderLeft: '2px solid #00aaff' }} />
        <div style={{ position: 'absolute', top: '6px', right: '6px', width: '10px', height: '10px', borderTop: '2px solid #00aaff', borderRight: '2px solid #00aaff' }} />
      </>}
    </div>
  )
}

export default Card
