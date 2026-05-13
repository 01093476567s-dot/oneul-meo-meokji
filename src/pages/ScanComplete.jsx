import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'
import { useBottomSheet } from '../context/BottomSheetContext'

const DETECTED_TAGS = [
  { name: '양파',     left: 187, top: 315, width: 54 },
  { name: '대파',     left: 133, top: 337, width: 54 },
  { name: '당근',     left: 132, top: 384, width: 54 },
  { name: '콩나물',   left:  79, top: 456, width: 70 },
  { name: '청양고추', left: 106, top: 505, width: 80 },
  { name: '등심',     left: 160, top: 529, width: 51 },
  { name: '유정란',   left: 118, top: 578, width: 61 },
  { name: '라면',     left: 130, top: 604, width: 56 },
]

const SCAN_RESULT_DATA = [
  { name: '양파',            icon: 'Img_Wrapper',   expiry: '1개월', qty: 12,  unit: '' },
  { name: '대파',            icon: 'Img_Wrapper-1', expiry: '1개월', qty: 2,   unit: '' },
  { name: '당근',            icon: 'Img_Wrapper-2', expiry: '1개월', qty: 4,   unit: '' },
  { name: '콩나물',          icon: 'Img_Wrapper-3', expiry: '7일',   qty: 200, unit: 'g' },
  { name: '청양고추',        icon: 'Img_Wrapper-4', expiry: '14일',  qty: 5,   unit: '' },
  { name: '등심',            icon: 'Img_Wrapper-5', expiry: '3일',   qty: 250, unit: 'g' },
  { name: '달걀(유정란)',    icon: 'Img_Wrapper-6', expiry: '1개월', qty: 15,  unit: '' },
  { name: '라면(오징어짬뽕)', icon: 'Img_Wrapper-7', expiry: '6개월', qty: 5,  unit: '' },
]

function ScanResultSheet({ onClose }) {
  const navigate = useNavigate()
  const { addIngredient } = useFridge()
  const [items, setItems] = useState(SCAN_RESULT_DATA)

  function adjustQty(i, delta) {
    setItems(prev =>
      prev.map((item, idx) => {
        if (idx !== i) return item
        const step = item.unit === 'g' ? 50 : 1
        return { ...item, qty: Math.max(step, item.qty + delta * step) }
      })
    )
  }

  function handleSave() {
    items.forEach(item =>
      addIngredient({ name: item.name, emoji: '🥬', category: '기타', quantity: item.qty, expiryDate: '' })
    )
    onClose()
    navigate('/fridge')
  }

  return (
    <div className="sr-sheet">
      <p className="sr-sheet__title">발견된 식재료</p>
      <p className="sr-sheet__sub">
        AI가 <span className="sr-sheet__count">{items.length}개 항목</span>을 인식했습니다.
      </p>
      <div className="sr-list">
        {items.map((item, i) => (
          <div key={i} className="sr-item">
            <div className="sr-item__left">
              <img
                className="sr-item__img"
                src={`/assets/icons/Frame_page/${item.icon}.svg`}
                width="60"
                height="47"
                alt={item.name}
                onError={e => { e.currentTarget.style.opacity = '0.3' }}
              />
              <div className="sr-item__info">
                <span className="sr-item__name">{item.name}</span>
                <div className="sr-item__expiry">
                  <span>유통기한 {item.expiry}</span>
                </div>
              </div>
            </div>
            <div className="sr-item__right">
              <button className="sr-qty-btn" onClick={() => adjustQty(i, -1)}>−</button>
              <span className="sr-qty-val">{item.qty}{item.unit}</span>
              <button className="sr-qty-btn" onClick={() => adjustQty(i, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>
      <button className="sr-cta" onClick={handleSave}>
        <img src="/assets/icons/Frame_page/Plus_icon.svg" width="13" height="13" alt="" />
        재료 담기
      </button>
    </div>
  )
}

export default function ScanComplete() {
  const navigate = useNavigate()
  const { openSheet, closeSheet } = useBottomSheet()

  return (
    <div className="scan-complete-page">
      {/* layer 0: 영수증 배경 */}
      <img className="scan-receipt" src="/images/Receipt.PNG" alt="" aria-hidden="true" />

      {/* layer 1: 어두운 마스크 */}
      <div className="scan-complete-mask" />

      {/* layer 2: 인식된 식재료 태그 (픽셀 좌표) */}
      {DETECTED_TAGS.map(tag => (
        <span
          key={tag.name}
          className="detected-tag"
          style={{ left: tag.left, top: tag.top, width: tag.width }}
        >
          {tag.name}
        </span>
      ))}

      {/* layer 3: 헤더 */}
      <header className="camera-header scan-layer">
        <button className="camera-header__btn" onClick={() => navigate(-1)}>
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

      {/* layer 3: 프레임 코너 브라켓 */}
      <div className="scan-frame">
        <span className="camera-frame__corner camera-frame__corner--tl" />
        <span className="camera-frame__corner camera-frame__corner--tr" />
        <span className="camera-frame__corner camera-frame__corner--bl" />
        <span className="camera-frame__corner camera-frame__corner--br" />
      </div>

      {/* 안내 텍스트 */}
      <p className="scan-complete-guide">
        <span className="scan-complete-guide__count">{DETECTED_TAGS.length}개</span> 식재료를 인식했습니다.
      </p>

      {/* 하단 버튼 */}
      <div className="scan-complete-bottom">
        <button className="scan-complete-btn" onClick={() => openSheet(<ScanResultSheet onClose={closeSheet} />)}>
          스캔완료
        </button>
      </div>
    </div>
  )
}
