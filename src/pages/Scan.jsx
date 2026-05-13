import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Scan() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/scan-complete'), 2500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="scan-page" onClick={() => navigate('/scan-complete')}>
      <img className="scan-receipt" src="/images/Receipt.PNG" alt="" aria-hidden="true" />

      <header className="camera-header scan-layer">
        <button
          className="camera-header__btn"
          onClick={e => { e.stopPropagation(); navigate(-1) }}
        >
          <img
            src="/assets/icons/back_icon.svg"
            width="10"
            height="17"
            alt="뒤로"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </button>
        <span className="camera-header__title">자동인식</span>
        <div className="camera-header__btn" aria-hidden="true" />
      </header>

      <div className="scan-frame scan-layer">
        <span className="camera-frame__corner camera-frame__corner--tl" />
        <span className="camera-frame__corner camera-frame__corner--tr" />
        <span className="camera-frame__corner camera-frame__corner--bl" />
        <span className="camera-frame__corner camera-frame__corner--br" />
      </div>

      <div className="scan-line-wrap">
        <div className="scan-line" />
      </div>

      <p className="scan-guide-text">식재료를 스캔중입니다.</p>

      <div className="scan-bottom-bar">스캔중</div>
    </div>
  )
}
