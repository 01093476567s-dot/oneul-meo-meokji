import { useNavigate } from 'react-router-dom'

export default function Camera() {
  const navigate = useNavigate()

  return (
    <div className="camera-page">
      {/* 상태바 */}
      <div className="camera-statusbar" aria-hidden="true">
        <span className="camera-statusbar__time">9:41</span>
        <div className="camera-statusbar__icons">
          <img src="/assets/icons/Cellular Connection.svg" width="18" height="12" alt="" />
          <img src="/assets/icons/Wifi.svg" width="16" height="12" alt="" />
          <img src="/assets/icons/Vector-1.svg" width="26" height="12" alt="" />
        </div>
      </div>

      {/* 헤더 */}
      <div className="camera-header">
        <button className="camera-header__back" onClick={() => navigate(-1)}>
          <img src="/assets/icons/back_icon.svg" width="10" height="17" alt="뒤로"
            style={{ filter: 'brightness(0) invert(1)' }} />
        </button>
        <span className="camera-header__title">사진 촬영</span>
      </div>

      {/* 카메라 영역 */}
      <div className="camera-viewport">
        <div className="camera-preview" />

        {/* 스캔 프레임 */}
        <div className="scan-frame" />

        {/* 모서리 브래킷 */}
        <div className="scan-corner scan-corner--tl" />
        <div className="scan-corner scan-corner--tr" />
        <div className="scan-corner scan-corner--bl" />
        <div className="scan-corner scan-corner--br" />

        <p className="camera-guide">식재료가 프레임 안에 들어오도록 해주세요</p>
      </div>

      {/* 찍기 버튼 */}
      <div className="camera-cta">
        <button className="camera-shutter" onClick={() => navigate('/scan')} aria-label="촬영">
          <span className="camera-shutter__inner" />
        </button>
      </div>
    </div>
  )
}
