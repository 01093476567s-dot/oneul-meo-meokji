import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const INGREDIENTS = [
  { icon: '/assets/icons/Ingradient/소고기.svg',              name: '소고기 150g',   have: true },
  { icon: '/assets/icons/Add_Ingredient_page/양파.svg',       name: '양파 1/4개',    have: true },
  { icon: '/assets/icons/Ingradient/대파.svg',               name: '대파 반단',     have: true },
  { icon: '/assets/icons/Add_Ingredient_page/표고버섯.svg',   name: '표고 버섯 2개', have: true },
  { icon: '/assets/icons/Add_Ingredient_page/당근.svg',       name: '당근 조금',     have: false },
]

const SAUCE = [
  ['간장 2큰술', '설탕 1/2큰술', '참기름 1/2큰술', '다진마늘 1/2큰술'],
  ['후추 조금', '소금 조금'],
]

export default function MenuDetail() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const [editOpen, setEditOpen] = useState(!!state?.openEditSheet)
  const [editItems, setEditItems] = useState(() => {
    if (state?.selectedIngredients?.length) {
      const existing = state.existingItems || INGREDIENTS.map(i => ({ ...i }))
      const existingNames = new Set(existing.map(i => i.name))
      const added = state.selectedIngredients
        .filter(i => !existingNames.has(i.name))
        .map(i => ({
          icon: i.icon
            ? `/assets/icons/${i.folder || 'Ingradient'}/${i.icon}.svg`
            : `/assets/icons/Ingradient/${i.name}.svg`,
          name: i.name,
          have: true,
          usedQty: i.usedQty,
          isGram: String(i.quantity || '').toLowerCase().includes('g'),
        }))
      return [...existing, ...added]
    }
    return INGREDIENTS.map(i => ({ ...i }))
  })

  function removeItem(name) {
    setEditItems(prev => prev.filter(i => i.name !== name))
  }

  return (
    <div className="mdc-page">
      {/* ── 헤더 ── */}
      <div className="mdc-header">
        <button className="mdc-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/action/ic-chevron-left.svg" width="10" height="17" alt="뒤로" />
        </button>
        <h1 className="mdc-header__title">오늘의 추천 메뉴</h1>
        <button className="mdc-header__btn" onClick={() => navigate('/')}>
          <img src="/assets/icons/navigation/ic-home-fill.svg" width="22" height="22" alt="홈" style={{ filter: 'brightness(0) saturate(100%) invert(9%) sepia(28%) saturate(700%) hue-rotate(340deg)' }} />
        </button>
      </div>

      {/* ── 스크롤 영역 ── */}
      <div className="mdc-scrollable">
        {/* 히어로 이미지 */}
        <div className="mdc-hero">
          <img className="mdc-hero__img" src="/assets/images/recipe-main-picture.jpg" alt="소불고기 도시락" />
          <div className="mdc-hero__gradient" />
          <div className="mdc-hero__content">
            <div className="mdc-hero__badge"><span className="mdc-hero__badge-text">AI 추천메뉴</span></div>
            <p className="mdc-hero__title">
            <span className="mdc-hero__title--thin">영양만점</span><br />
            <span className="mdc-hero__title--light">소불고기 </span>
            <span className="mdc-hero__title--thin">도시락</span>
          </p>
            <p className="mdc-hero__desc">
              가나다님의 냉장고에서 발견한<br />
              식재료로 도시락 메뉴를 준비했어요.<br />
              오늘은 달콤짭짤한 소불고기 도시락 어떠세요?
            </p>
          </div>
        </div>

        {/* 정보 바 */}
        <div className="mdc-infobar">
          <div className="mdc-infobar__inner">
            <div className="mdc-infobar__item">
              <img src="/assets/icons/common/ic-timer.svg" width="14" height="15" alt="시간" />
              <span className="mdc-infobar__text">20분</span>
            </div>
            <div className="mdc-infobar__item">
              <img src="/assets/icons/common/ic-person.svg" width="14" height="13" alt="인분" />
              <span className="mdc-infobar__text">1인분</span>
            </div>
            <div className="mdc-infobar__item">
              <img src="/assets/icons/common/ic-star.svg" width="14" height="14" alt="난이도" />
              <span className="mdc-infobar__text">쉬움</span>
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div className="mdc-content">
          <div className="mdc-section-header">
            <p className="mdc-section-header__title">
              이런 <span className="mdc-section-header__accent">식재료</span>가 들어가요!
            </p>
            <p className="mdc-section-header__sub">요리 시작 전, 식재료를 미리 준비해주세요.</p>
          </div>

          <div className="mdc-ingredient-wrap">
            {/* 재료 */}
            <div className="mdc-ingredient-section">
              <div className="mdc-ingredient-section__hd">
                <button className="mdc-edit-btn" onClick={() => setEditOpen(true)}>편집</button>
              </div>
              <div className="mdc-ingredient-list">
                {editItems.map(item => (
                  <div key={item.name} className="mdc-ingredient-item">
                    <img
                      className={`mdc-ingredient-item__img${item.have ? '' : ' mdc-ingredient-item__img--none'}`}
                      src={item.icon}
                      alt={item.name}
                    />
                    <span className="mdc-ingredient-item__name">
                      {item.name}
                      {item.usedQty != null && (
                        <span className="mdc-ingredient-item__qty">
                          {item.isGram ? ` ${item.usedQty}g` : ` ${item.usedQty}`}
                        </span>
                      )}
                    </span>
                    <div className="mdc-ingredient-item__status">
                      <div className={`mdc-ingredient-item__dot${item.have ? '' : ' mdc-ingredient-item__dot--none'}`} />
                      <span className="mdc-ingredient-item__status-text">{item.have ? '보유' : '없음'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 양념장 */}
            <div className="mdc-sauce-section">
              <div className="mdc-sauce-pills">
                {SAUCE.map((row, i) => (
                  <div key={i} className="mdc-sauce-row">
                    {row.map(s => <span key={s} className="mdc-sauce-pill">{s}</span>)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 하단 고정 CTA ── */}
      <div className="mdc-cta-bar">
        <button className="mdc-cta-btn mdc-cta-btn--recipe" onClick={() => navigate('/recipe')}>
          레시피 보러가기
        </button>
        <button className="mdc-cta-btn mdc-cta-btn--lunchbox" onClick={() => navigate('/lunchbox-pack', { state: { menuIngredients: editItems } })}>
          도시락 담기
        </button>
      </div>

      {/* ── 편집 바텀시트 ── */}
      {editOpen && (
        <>
          <div className="mdc-edit-overlay" onClick={() => setEditOpen(false)} />
          <div className="mdc-edit-sheet">
            <div className="mdc-edit-sheet__handle" />

            <div className="mdc-edit-sheet__header">
              <div className="mdc-edit-sheet__title-row">
                <p className="mdc-edit-sheet__title">
                  <span className="mdc-edit-sheet__accent">식재료</span>를 수정할래요!
                </p>
                <button
                  className="mdc-edit-sheet__reset"
                  onClick={() => setEditItems(INGREDIENTS.map(i => ({ ...i })))}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M12.5 2C11.2 0.75 9.45 0 7.5 0C3.36 0 0 3.36 0 7.5S3.36 15 7.5 15c3.45 0 6.35-2.3 7.2-5.5h-1.95C11.95 11.65 9.88 13 7.5 13c-3.03 0-5.5-2.47-5.5-5.5S4.47 2 7.5 2c1.52 0 2.88.63 3.87 1.63L9 6h5V1L12.5 2Z" fill="rgba(42,32,24,0.4)"/>
                  </svg>
                  되돌리기
                </button>
              </div>
              <p className="mdc-edit-sheet__sub">필요한 식재료를 추가하거나 삭제할 수 있어요.</p>
            </div>

            <div className="mdc-edit-sheet__grid">
              {editItems.map(item => (
                <div key={item.name} className="mdc-edit-item">
                  <img
                    className={`mdc-ingredient-item__img${item.have ? '' : ' mdc-ingredient-item__img--none'}`}
                    src={item.icon}
                    alt={item.name}
                  />
                  <span className="mdc-ingredient-item__name">
                    {item.name}
                    {item.usedQty != null && (
                      <span className="mdc-ingredient-item__qty">
                        {item.isGram ? ` ${item.usedQty}g` : ` ${item.usedQty}`}
                      </span>
                    )}
                  </span>
                  <div className="mdc-ingredient-item__status">
                    <div className={`mdc-ingredient-item__dot${item.have ? '' : ' mdc-ingredient-item__dot--none'}`} />
                    <span className="mdc-ingredient-item__status-text">{item.have ? '보유' : '없음'}</span>
                  </div>
                  <button className="mdc-edit-item__remove" onClick={() => removeItem(item.name)}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 1L9 9M9 1L1 9" stroke="#2a2018" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* + 추가 버튼 */}
              <button className="mdc-edit-add" onClick={() => navigate('/ingredient-select', {
                state: { from: '/menu-detail', openEditSheet: true, existingItems: editItems }
              })}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3V17M3 10H17" stroke="#ff8c66" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <button className="mdc-edit-sheet__confirm" onClick={() => setEditOpen(false)}>
              확인
            </button>
          </div>
        </>
      )}
    </div>
  )
}
