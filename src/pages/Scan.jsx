import { useNavigate } from 'react-router-dom'

export default function Scan() {
  const navigate = useNavigate()

  return (
    <div
      className="scan-page"
      onClick={() => navigate('/scan-complete')}
      style={{ cursor: 'pointer' }}
    >
      {/* 카메라 뷰포트 + 스포트라이트 프레임 */}
      <div className="camera-viewport">
        <div className="camera-preview" />
        <div className="scan-frame" />
        <div className="scan-corner scan-corner--tl" />
        <div className="scan-corner scan-corner--tr" />
        <div className="scan-corner scan-corner--bl" />
        <div className="scan-corner scan-corner--br" />
        <div className="scan-line" />
      </div>

      <p className="scan-guide">화면을 탭하면 스캔이 완료됩니다</p>
    </div>
  )
}
