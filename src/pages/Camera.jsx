import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Camera() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error('카메라 접근 실패:', err)
      }
    }
    startCamera()
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  return (
    <div className="camera-page">
      <video ref={videoRef} autoPlay playsInline muted className="camera-video" />

      <header className="camera-header">
        <button className="camera-header__btn" onClick={() => navigate(-1)}>
          <img
            src="/assets/icons/back_icon.svg"
            width="10"
            height="17"
            alt="뒤로"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </button>
        <span className="camera-header__title">사진 촬영</span>
        <div className="camera-header__btn" aria-hidden="true" />
      </header>

      <div className="camera-view">
        <div className="camera-frame">
          <span className="camera-frame__corner camera-frame__corner--tl" />
          <span className="camera-frame__corner camera-frame__corner--tr" />
          <span className="camera-frame__corner camera-frame__corner--bl" />
          <span className="camera-frame__corner camera-frame__corner--br" />
          <p className="camera-guide">식재료가 프레임 안에 들어오도록 해주세요</p>
        </div>
      </div>

      <div className="camera-bottom">
        <button className="camera-capture-btn" onClick={() => navigate('/scan')}>
          촬영 하기
        </button>
      </div>
    </div>
  )
}
