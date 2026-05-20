import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Camera() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [flashOn, setFlashOn] = useState(false)

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

      {/* 헤더 */}
      <header className="camera-header">
        <button className="camera-header__btn" onClick={() => navigate(-1)}>
          <img
            src="/assets/icons/action/ic-chevron-left.svg"
            height="16"
            alt="뒤로"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </button>
        <span className="camera-header__title">자동인식</span>
        <button className="camera-header__btn" onClick={() => setFlashOn(v => !v)}>
          <img
            src={flashOn
              ? '/assets/icons/action/ic-flash-fill.svg'
              : '/assets/icons/action/ic-flash.svg'
            }
            width="15"
            height="20"
            alt="플래시"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </button>
      </header>

      {/* 카메라 뷰 */}
      <div className="camera-view">
        <div className="camera-frame">
          <span className="camera-frame__corner camera-frame__corner--tl" />
          <span className="camera-frame__corner camera-frame__corner--tr" />
          <span className="camera-frame__corner camera-frame__corner--bl" />
          <span className="camera-frame__corner camera-frame__corner--br" />
          <p className="camera-guide">
            영수증을 촬영해주세요.<br />
            식재료를 자동으로 스캔합니다.
          </p>
        </div>
      </div>

      {/* 촬영 버튼 */}
      <div className="camera-bottom">
        <button className="camera-capture-btn" onClick={() => navigate('/scan')}>
          촬영 하기
        </button>
      </div>
    </div>
  )
}
