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
]

const SCAN_RESULT_DATA = [
  { name: '양파',     iconFile: '양파',     expiry: '1개월', qty: '12',   frozen: false },
  { name: '대파',     iconFile: '대파',     expiry: '1개월', qty: '2',    frozen: false },
  { name: '당근',     iconFile: '당근',     expiry: '1개월', qty: '4',    frozen: false },
  { name: '콩나물',   iconFile: '콩나물',   expiry: '7일',   qty: '200g', frozen: false },
  { name: '청양고추', iconFile: '청양고추', expiry: '14일',  qty: '5',    frozen: false },
  { name: '등심',     iconFile: '등심',     expiry: '3일',   qty: '250g', frozen: false },
  { name: '달걀',     iconFile: '계란',     expiry: '1개월', qty: '15',   frozen: false },
]

function ScanResultSheet({ onClose }) {
  const navigate = useNavigate()
  const { addIngredient } = useFridge()
  const [items, setItems] = useState(SCAN_RESULT_DATA)
  const [editingIdx, setEditingIdx] = useState(null)
  const [editingVal, setEditingVal] = useState('')

  function parseQty(str) {
    const hasG = /g/i.test(str)
    const num = parseFloat(str) || 0
    return { num, hasG }
  }

  function adjustQty(i, delta) {
    setItems(prev =>
      prev.map((item, idx) => {
        if (idx !== i) return item
        const { num, hasG } = parseQty(item.qty)
        const step = hasG ? 50 : 1
        const next = Math.max(step, num + delta * step)
        return { ...item, qty: hasG ? `${next}g` : String(next) }
      })
    )
  }

  function toggleFrozen(i) {
    setItems(prev =>
      prev.map((item, idx) => idx === i ? { ...item, frozen: !item.frozen } : item)
    )
  }

  function startEdit(i) {
    setEditingIdx(i)
    setEditingVal(items[i].qty)
  }

  function commitEdit(i) {
    setItems(prev =>
      prev.map((item, idx) => idx === i ? { ...item, qty: editingVal || item.qty } : item)
    )
    setEditingIdx(null)
  }

  function handleSave() {
    items.forEach(item =>
      addIngredient({
        name: item.name,
        icon: item.iconFile,
        folder: 'Ingradient',
        category: '기타',
        quantity: item.qty,
        expiryDate: '',
        storageType: item.frozen ? '냉동' : '냉장',
      })
    )
    onClose()
    navigate('/fridge')
  }

  return (
    <div className="sr-sheet">
      <div className="sr-sheet__header">
        <p className="sr-sheet__title">발견된 식재료</p>
        <p className="sr-sheet__sub">
          AI가 <span className="sr-sheet__count">{items.length}개 항목</span>을 인식했습니다.
        </p>
      </div>

      <div className="sr-list">
        {items.map((item, i) => (
          <div key={i} className="sr-item">
            <div className="sr-item__left">
              <img
                className="sr-item__img"
                src={`/assets/icons/Ingradient/${item.iconFile}.svg`}
                width="48"
                height="38"
                alt={item.name}
                onError={e => { e.currentTarget.style.opacity = '0.3' }}
              />
              <div className="sr-item__info">
                <span className="sr-item__name">{item.name}</span>
                <span className="sr-item__expiry-text">유통기한 {item.expiry}</span>
              </div>
            </div>
            <div className="sr-item__right">
              <div className="sr-item__controls">
                <button className="sr-qty-btn" onClick={() => adjustQty(i, -1)}>−</button>
                {editingIdx === i ? (
                  <input
                    className="sr-qty-input"
                    value={editingVal}
                    onChange={e => setEditingVal(e.target.value)}
                    onBlur={() => commitEdit(i)}
                    onKeyDown={e => e.key === 'Enter' && commitEdit(i)}
                    autoFocus
                    inputMode="text"
                  />
                ) : (
                  <span className="sr-qty-val" onClick={() => startEdit(i)}>{item.qty}</span>
                )}
                <button className="sr-qty-btn" onClick={() => adjustQty(i, 1)}>+</button>
              </div>
              <button
                className={`sr-freeze-btn${item.frozen ? ' sr-freeze-btn--active' : ''}`}
                onClick={() => toggleFrozen(i)}
              >
                <img
                  src="/assets/icons/common/badge-frozen.svg"
                  width="31" height="31"
                  alt="냉동"
                  style={{ filter: item.frozen ? 'none' : 'saturate(0) brightness(1.6)' }}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="sr-bottom">
        <button className="sr-btn-cancel" onClick={onClose}>취소</button>
        <button className="sr-btn-save" onClick={handleSave}>재료 담기</button>
      </div>
    </div>
  )
}

export default function ScanComplete() {
  const navigate = useNavigate()
  const { openSheet, closeSheet } = useBottomSheet()

  return (
    <div className="scan-complete-page">
      {/* layer 0: 영수증 배경 */}
      <img className="scan-receipt" src="/assets/images/sample-receipt.png" alt="" aria-hidden="true" />

      {/* layer 1: 어두운 마스크 */}
      <div className="scan-complete-mask" />

      {/* layer 2: 인식된 식재료 태그 */}
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
            src="/assets/icons/action/ic-chevron-left.svg"
            height="16"
            alt="뒤로"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </button>
        <span className="camera-header__title">자동인식</span>
        <div className="camera-header__btn" aria-hidden="true">
          <img
            src="/assets/icons/action/ic-flash.svg"
            width="15" height="20" alt=""
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>
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
