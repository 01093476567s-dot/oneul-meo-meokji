import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { createPortal } from 'react-dom'
import Confetti from '../components/Confetti'

const INGREDIENTS = [
  { icon: '/assets/icons/Ingradient/소고기.svg',            name: '소고기 150g' },
  { icon: '/assets/icons/Add_Ingredient_page/양파.svg',     name: '양파 1/4개' },
  { icon: '/assets/icons/Add_Ingredient_page/표고버섯.svg', name: '표고 버섯 2개' },
]

const TIP_LINKS = ['시금치 나물', '브로콜리 무침']

const FALLBACK_RICE = {
  name: '흰쌀밥',
  icon: '/assets/icons/Ingradient/흰쌀밥.svg',
  sub:  '200g · 소분 2026.05.08 ~',
}

const FALLBACK_DISHES = [
  { img: '/assets/images/side-dish1.png', bgColor: '#d4f0b1', name: '장조림',   pct: 70, date: '2026.05.06' },
  { img: '/assets/images/side-dish2.png', bgColor: '#bce2f9', name: '우엉조림', pct: 50, date: '2026.05.12' },
]


export default function LunchboxConfirm() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const [showPopup, setShowPopup] = useState(false)

  const rice        = location.state?.selectedRice     ?? FALLBACK_RICE
  const dishes      = location.state?.selectedDishes   ?? FALLBACK_DISHES
  const ingredients = location.state?.menuIngredients  ?? INGREDIENTS

  const [deducts, setDeducts] = useState(() => dishes.map(() => 15))

  return (
    <div className="lbc-page">
      {/* ── 헤더 ── */}
      <div className="lbc-header">
        <button className="lbc-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/action/ic-chevron-left.svg" width="10" height="17" alt="뒤로" />
        </button>
        <h1 className="lbc-header__title">도시락 담기</h1>
        <div className="lbc-header__btn" />
      </div>

      {/* ── 스크롤 본문 ── */}
      <div className="lbc-content">

        {/* 타이틀 */}
        <div className="lbc-title-wrap">
          <p className="lbc-title">이렇게 담을게요</p>
          <p className="lbc-title-sub">확인 후 재고가 자동으로 차감돼요.</p>
        </div>

        <div className="lbc-divider" />

        {/* 메인 메뉴 재료 섹션 */}
        <div className="lbc-row lbc-row--menu">
          <div className="lbc-menu-left">
            <p className="lbc-menu-name">영양만점 소불고기 도시락</p>
            <div className="lbc-ingredient-list">
              {ingredients.map(item => (
                <div key={item.name} className="lbc-ingredient-item">
                  <img className="lbc-ingredient-img" src={item.icon} alt={item.name} />
                  <span className="lbc-ingredient-name">
                    {item.name}
                    {item.usedQty != null && (
                      <span className="lbc-ingredient-qty">
                        {item.isGram ? ` ${item.usedQty}g` : ` ${item.usedQty}`}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <span className="lbc-deduct-label">냉장고 재료 차감</span>
        </div>

        {/* 밥 행 */}
        <div className="lbc-row lbc-row--item">
          <div className="lbc-item-left">
            <img className="lbc-rice-icon" src={rice.icon} alt={rice.name} />
            <div className="lbc-item-info">
              <span className="lbc-item-name">{rice.name}</span>
              <span className="lbc-item-sub">{rice.sub}</span>
            </div>
          </div>
          <span className="lbc-deduct-label">-1 소분 차감</span>
        </div>

        {/* 밑반찬 행 */}
        {dishes.map((dish, i) => (
          <div key={dish.name} className="lbc-row lbc-row--item">
            <div className="lbc-item-left">
              <div className="lbc-dish-thumb" style={{ background: dish.bgColor }}>
                <img className="lbc-dish-thumb__img" src={dish.img} alt={dish.name} />
              </div>
              <div className="lbc-item-info">
                <span className="lbc-item-name">{dish.name}</span>
                <span className="lbc-item-sub">{dish.pct}% · {dish.date} ~</span>
              </div>
            </div>
            <div className="lbc-deduct-pct">
              <input
                className="lbc-deduct-pct__input"
                type="number"
                min="0"
                max="100"
                value={deducts[i]}
                onChange={e => {
                  const v = Math.min(100, Math.max(0, Number(e.target.value)))
                  setDeducts(prev => prev.map((d, idx) => idx === i ? v : d))
                }}
              />
              <span className="lbc-deduct-label">% 차감</span>
            </div>
          </div>
        ))}

        {/* 안내 메시지 */}
        <div className="lbc-notice">
          <p>· 도시락에 담은 후 완료하면 추천 메뉴 식재료는 자동 차감됩니다.</p>
          <p>· 양념장은 자동 차감이 안됩니다.</p>
        </div>

        {/* 도시락 팁 */}
        <div className="lbc-tip-wrap">
          <img className="lbc-tip-mascot" src="/assets/images/mmg-idea.png" alt="" />
          <div className="lbc-tip">
            <div className="lbc-tip-title-row">
              <img src="/assets/icons/common/ic-twinkle.svg" width="19" height="21" alt="" />
              <span className="lbc-tip-title">도시락 팁</span>
            </div>
            <p className="lbc-tip-desc">흰쌀밥 소분이 마지막 1개예요. 미리 준비 해보는건 어떨까요?</p>
            <p className="lbc-tip-desc">
              고기와 밥 조합은 든든해요.<br />
              초록색 상큼한 채소 반찬을 하나 추가하면 영양도 색감도 더 좋아져요!
            </p>
            {TIP_LINKS.map(link => (
              <div key={link} className="lbc-tip-link">
                <span className="lbc-tip-link__text">{link}</span>
                <img src="/assets/icons/action/ic-arrow.svg" width="9" height="10" alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="lbc-cta">
        <button className="lbc-cta-btn" onClick={() => setShowPopup(true)}>도시락 완성</button>
      </div>

      {/* ── 완성 팝업 ── */}
      {showPopup && createPortal(
        <div className="lbc-popup-overlay">
          <div className="lbc-popup">
            {/* 파티클 버스트 */}
            <Confetti count={50} top="48%" left="50%" />

            <div className="lbc-popup-body">
              <div className="lbc-popup-text">
                <p className="lbc-popup-title">
                  도시락이 담겼어요<br />재고가 자동으로 업데이트 되었어요!
                </p>
                <p className="lbc-popup-sub">오늘도 즐거운 하루 되세요~</p>
              </div>
              <img className="lbc-popup-img" src="/assets/images/mmg-completion.png" alt="" />
            </div>

            <p className="lbc-popup-note">· 남은 밥, 반찬은 냉장고 탭에서 확인 가능합니다.</p>

            <div className="lbc-popup-btns">
              <button className="lbc-popup-btn" onClick={() => navigate('/')}>홈으로</button>
              <button className="lbc-popup-btn lbc-popup-btn--navy" onClick={() => navigate('/lunch-record', { state: { date: new Date().toISOString().slice(0, 10) } })}>도시락 기록 하러 가기</button>
              <button className="lbc-popup-undo" onClick={() => setShowPopup(false)}>되돌리기</button>
            </div>
          </div>
        </div>,
        document.getElementById('app')
      )}
    </div>
  )
}
