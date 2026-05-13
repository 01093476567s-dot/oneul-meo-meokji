import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'
import { useBottomSheet } from '../context/BottomSheetContext'

const DETECTED_TAGS = [
  { name: '양파', left: '20%', top: '18%', width: 60 },
  { name: '대파', left: '55%', top: '12%', width: 50 },
  { name: '당근', left: '30%', top: '40%', width: 55 },
  { name: '콩나물', left: '60%', top: '35%', width: 65 },
  { name: '청양고추', left: '15%', top: '58%', width: 70 },
  { name: '등심', left: '50%', top: '55%', width: 55 },
  { name: '달걀', left: '25%', top: '72%', width: 50 },
  { name: '라면', left: '62%', top: '70%', width: 55 },
]

const SCAN_RESULT_DATA = [
  { name: '양파', icon: 'Img_Wrapper', expiry: '1개월', qty: 12, unit: '' },
  { name: '대파', icon: 'Img_Wrapper-1', expiry: '1개월', qty: 2, unit: '' },
  { name: '당근', icon: 'Img_Wrapper-2', expiry: '1개월', qty: 4, unit: '' },
  { name: '콩나물', icon: 'Img_Wrapper-3', expiry: '7일', qty: 200, unit: 'g' },
  { name: '청양고추', icon: 'Img_Wrapper-4', expiry: '14일', qty: 5, unit: '' },
  { name: '등심', icon: 'Img_Wrapper-5', expiry: '3일', qty: 250, unit: 'g' },
  { name: '달걀(유정란)', icon: 'Img_Wrapper-6', expiry: '1개월', qty: 15, unit: '' },
  { name: '라면(오징어짬뽕)', icon: 'Img_Wrapper-7', expiry: '6개월', qty: 5, unit: '' },
]

function ScanResultSheet({ onClose }) {
  const navigate = useNavigate()
  const { addIngredient } = useFridge()
  const [items, setItems] = useState(SCAN_RESULT_DATA)

  function adjustQty(i, delta) {
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== i) return item
        const step = item.unit === 'g' ? 50 : 1
        return { ...item, qty: Math.max(item.unit === 'g' ? 50 : 1, item.qty + delta * step) }
      })
    )
  }

  function handleSave() {
    items.forEach((item) => addIngredient({
      name: item.name,
      emoji: '🥬',
      category: '기타',
      quantity: item.qty,
      expiryDate: '',
    }))
    onClose()
    navigate('/fridge')
  }

  return (
    <div className="sr-sheet">
      <p className="sr-sheet__title">인식된 식재료</p>
      <div className="sr-list">
        {items.map((item, i) => (
          <div key={i} className="sr-item">
            <div className="sr-item__left">
              <img
                className="sr-item__img"
                src={`/assets/icons/Frame_page/${item.icon}.svg`}
                alt={item.name}
                onError={(e) => { e.currentTarget.style.opacity = '0.3' }}
              />
              <div className="sr-item__info">
                <p className="sr-item__name">{item.name}</p>
                <p className="sr-item__expiry">유통기한 약 {item.expiry}</p>
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
      <div className="sr-cta">
        <button className="sr-cta__btn" onClick={handleSave}>재료 담기</button>
      </div>
    </div>
  )
}

export default function ScanComplete() {
  const { openSheet, closeSheet } = useBottomSheet()

  function completeScan() {
    openSheet(<ScanResultSheet onClose={closeSheet} />)
  }

  return (
    <div className="scan-complete-page">
      <div className="camera-viewport">
        <div className="camera-preview" />
        {/* 전체 어두운 오버레이 */}
        <div className="scan-complete-mask" />
        {/* 프레임 (spotlight 없음 — scan-complete-page에서 box-shadow 제거됨) */}
        <div className="scan-frame" />
        <div className="scan-corner scan-corner--tl" />
        <div className="scan-corner scan-corner--tr" />
        <div className="scan-corner scan-corner--bl" />
        <div className="scan-corner scan-corner--br" />

        {/* 인식된 식재료 태그 */}
        {DETECTED_TAGS.map((tag) => (
          <div
            key={tag.name}
            className="detected-tag"
            style={{ left: tag.left, top: tag.top, width: tag.width }}
          >
            {tag.name}
          </div>
        ))}
      </div>

      <p className="scan-guide" style={{ color: '#fff' }}>식재료가 인식되었어요!</p>

      <div className="camera-cta">
        <button className="scan-complete-btn" onClick={completeScan}>
          스캔완료
        </button>
      </div>
    </div>
  )
}
