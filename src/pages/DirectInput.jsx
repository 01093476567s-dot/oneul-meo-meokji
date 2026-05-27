import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'

const DI_CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'veg', label: '야채/채소' },
  { id: 'dairy', label: '유제품' },
  { id: 'meat', label: '육류' },
  { id: 'seafood', label: '수산물' },
  { id: 'fruit', label: '과일' },
  { id: 'seasoning', label: '조미료' },
  { id: 'ambient', label: '상온식품' },
]


const DI_ITEMS = [
  // 야채/채소
  { name: '상추', icon: '상추', folder: 'Add_Ingredient_page', category: 'veg', expiry: '1개월' },
  { name: '깻잎', icon: '깻잎', folder: 'Ingradient', category: 'veg', expiry: '2개월' },
  { name: '양배추', icon: '양배추', folder: 'Add_Ingredient_page', category: 'veg', expiry: '1개월' },
  { name: '시금치', icon: '시금치', folder: 'Add_Ingredient_page', category: 'veg', expiry: '1개월' },
  { name: '청경채', icon: '청경채', folder: 'Add_Ingredient_page', category: 'veg', expiry: '1개월' },
  { name: '케일', icon: '케일', folder: 'Add_Ingredient_page', category: 'veg', expiry: '1개월' },
  { name: '감자', icon: '감자', folder: 'Add_Ingredient_page', category: 'veg', expiry: '2개월' },
  { name: '고구마', icon: '고구마', folder: 'Add_Ingredient_page', category: 'veg', expiry: '2개월' },
  { name: '당근', icon: '당근', folder: 'Ingradient', category: 'veg', expiry: '1개월' },
  { name: '무', icon: '무', folder: 'Add_Ingredient_page', category: 'veg', expiry: '1개월' },
  { name: '양파', icon: '양파', folder: 'Ingradient', category: 'veg', expiry: '2개월' },
  { name: '마늘', icon: '마늘', folder: 'Add_Ingredient_page', category: 'veg', expiry: '3개월' },
  { name: '생강', icon: '생강', folder: 'Add_Ingredient_page', category: 'veg', expiry: '2개월' },
  { name: '연근', icon: '연근', folder: 'Add_Ingredient_page', category: 'veg', expiry: '1개월' },
  { name: '오이', icon: '오이', folder: 'Add_Ingredient_page', category: 'veg', expiry: '1주일' },
  { name: '가지', icon: '가지', folder: 'Add_Ingredient_page', category: 'veg', expiry: '1개월' },
  { name: '호박', icon: '호박', folder: 'Add_Ingredient_page', category: 'veg', expiry: '1개월' },
  { name: '브로콜리', icon: '브로콜리', folder: 'Add_Ingredient_page', category: 'veg', expiry: '1주일' },
  { name: '피망', icon: '피망', folder: 'Add_Ingredient_page', category: 'veg', expiry: '1개월' },
  { name: '파프리카', icon: '파프리카', folder: 'Add_Ingredient_page', category: 'veg', expiry: '1개월' },
  { name: '아스파라거스', icon: '아스파라거스', folder: 'Add_Ingredient_page', category: 'veg', expiry: '1주일' },
  { name: '토마토', icon: '토마토', folder: 'Add_Ingredient_page', category: 'veg', expiry: '1개월' },
  { name: '옥수수', icon: '옥수수', folder: 'Add_Ingredient_page', category: 'veg', expiry: '1개월' },
  { name: '콩나물', icon: '콩나물', folder: 'Ingradient', category: 'veg', expiry: '3일' },
  { name: '숙주', icon: '숙주', folder: 'Add_Ingredient_page', category: 'veg', expiry: '3일' },
  { name: '표고버섯', icon: '표고버섯', folder: 'Ingradient', category: 'veg', expiry: '1주일' },
  { name: '팽이버섯', icon: '팽이버섯', folder: 'Add_Ingredient_page', category: 'veg', expiry: '1주일' },
  { name: '새송이버섯', icon: '새송이버섯', folder: 'Add_Ingredient_page', category: 'veg', expiry: '2주일' },
  { name: '양송이버섯', icon: '양송이버섯', folder: 'Add_Ingredient_page', category: 'veg', expiry: '1주일' },
  { name: '대파', icon: '대파', folder: 'Ingradient', category: 'veg', expiry: '1주일' },
  // 육류
  { name: '소고기', icon: '소고기', folder: 'Ingradient', category: 'meat', expiry: '3일' },
  { name: '소갈비', icon: '소갈비', folder: 'Ingradient', category: 'meat', expiry: '3일' },
  { name: '삼겹살', icon: '삼겹살', folder: 'Ingradient', category: 'meat', expiry: '3일' },
  { name: '닭가슴살', icon: '닭가슴살', folder: 'Ingradient', category: 'meat', expiry: '2일' },
  { name: '닭고기', icon: '닭고기', folder: 'Ingradient', category: 'meat', expiry: '2일' },
  { name: '오리고기', icon: '오리고기', folder: 'Ingradient', category: 'meat', expiry: '2일' },
  { name: '국거리', icon: '국거리', folder: 'Ingradient', category: 'meat', expiry: '3일' },
  { name: '다짐육', icon: '다짐육', folder: 'Ingradient', category: 'meat', expiry: '2일' },
  { name: '베이컨', icon: '베이컨', folder: 'Ingradient', category: 'meat', expiry: '1주일' },
  { name: '소시지', icon: '소시지', folder: 'Ingradient', category: 'meat', expiry: '1주일' },
  { name: '햄', icon: '햄', folder: 'Ingradient', category: 'meat', expiry: '1주일' },
  { name: '스팸', icon: '스팸', folder: 'Ingradient', category: 'meat', expiry: '1개월' },
  { name: '돼지고기', icon: '돼지고기', folder: 'Ingradient', category: 'meat', expiry: '3일' },
  { name: '등심', icon: '등심', folder: 'Ingradient', category: 'meat', expiry: '3일' },
  // 상온식품
  { name: '라면', icon: '라면', folder: 'Ingradient', category: 'ambient', expiry: '6개월' },
  { name: '파스타면', icon: '파스타면', folder: 'Ingradient', category: 'ambient', expiry: '2년' },
  { name: '소면', icon: '소면', folder: 'Ingradient', category: 'ambient', expiry: '2년' },
  { name: '라면면', icon: '라면면', folder: 'Ingradient', category: 'ambient', expiry: '6개월' },
  { name: '당면', icon: '당면', folder: 'Ingradient', category: 'ambient', expiry: '2년' },
  { name: '밀가루', icon: '밀가루', folder: 'Ingradient', category: 'ambient', expiry: '1년' },
  { name: '부침가루', icon: '부침가루', folder: 'Ingradient', category: 'ambient', expiry: '1년' },
  { name: '전분가루', icon: '전분가루', folder: 'Ingradient', category: 'ambient', expiry: '2년' },
  // 유제품
  { name: '달걀', icon: '계란', folder: 'Ingradient', category: 'dairy', expiry: '1개월' },
  { name: '우유', icon: '우유', folder: 'Ingradient', category: 'dairy', expiry: '2주일' },
  { name: '요거트', icon: '요거트', folder: 'Ingradient', category: 'dairy', expiry: '2주일' },
  { name: '요구르트', icon: '요구르트', folder: 'Ingradient', category: 'dairy', expiry: '2주일' },
  { name: '체다치즈', icon: '체다치즈', folder: 'Ingradient', category: 'dairy', expiry: '1개월' },
  { name: '버터', icon: '버터', folder: 'Ingradient', category: 'dairy', expiry: '3개월' },
  { name: '마가린', icon: '마가린', folder: 'Ingradient', category: 'dairy', expiry: '3개월' },
  { name: '크림치즈', icon: '크림치즈', folder: 'Ingradient', category: 'dairy', expiry: '2주일' },
  { name: '모짜렐라', icon: '모짜렐라', folder: 'Ingradient', category: 'dairy', expiry: '1주일' },
  // 조미료
  { name: '식용유', icon: '식용유', folder: 'Ingradient', category: 'seasoning', expiry: '1년' },
  { name: '후추', icon: '후추', folder: 'Ingradient', category: 'seasoning', expiry: '2년' },
  { name: '소금', icon: '소금', folder: 'Ingradient', category: 'seasoning', expiry: '2년' },
  { name: '설탕', icon: '설탕', folder: 'Ingradient', category: 'seasoning', expiry: '2년' },
  { name: '미원', icon: '미원', folder: 'Ingradient', category: 'seasoning', expiry: '2년' },
  { name: '치킨스톡', icon: '치킨스톡', folder: 'Ingradient', category: 'seasoning', expiry: '1년' },
  { name: '간장', icon: '간장', folder: 'Ingradient', category: 'seasoning', expiry: '2년' },
  { name: '참기름', icon: '참기름', folder: 'Ingradient', category: 'seasoning', expiry: '1년' },
  { name: '올리브유', icon: '올리브유', folder: 'Ingradient', category: 'seasoning', expiry: '1년' },
  { name: '맛술', icon: '맛술', folder: 'Ingradient', category: 'seasoning', expiry: '1년' },
  { name: '굴소스', icon: '굴소스', folder: 'Ingradient', category: 'seasoning', expiry: '1년' },
  { name: '케찹', icon: '케찹', folder: 'Ingradient', category: 'seasoning', expiry: '1년' },
  { name: '고추장', icon: '고추장', folder: 'Ingradient', category: 'seasoning', expiry: '2년' },
  { name: '된장', icon: '된장', folder: 'Ingradient', category: 'seasoning', expiry: '2년' },
  // 수산물
  { name: '고등어', icon: '고등어', folder: 'Ingradient', category: 'seafood', expiry: '2일' },
  { name: '연어', icon: '연어', folder: 'Ingradient', category: 'seafood', expiry: '2일' },
  { name: '참치', icon: '참치캔', folder: 'Ingradient', category: 'seafood', expiry: '3년' },
  { name: '갈치', icon: '갈치', folder: 'Ingradient', category: 'seafood', expiry: '2일' },
  { name: '굴비', icon: '굴비', folder: 'Ingradient', category: 'seafood', expiry: '3일' },
  { name: '조기', icon: '조기', folder: 'Ingradient', category: 'seafood', expiry: '2일' },
  { name: '새우', icon: '새우', folder: 'Ingradient', category: 'seafood', expiry: '2일' },
  { name: '오징어', icon: '오징어', folder: 'Ingradient', category: 'seafood', expiry: '2일' },
  { name: '낙지', icon: '낙지', folder: 'Ingradient', category: 'seafood', expiry: '1일' },
  { name: '쭈꾸미', icon: '쭈꾸미', folder: 'Ingradient', category: 'seafood', expiry: '1일' },
  { name: '게', icon: '게', folder: 'Ingradient', category: 'seafood', expiry: '2일' },
  { name: '전복', icon: '전복', folder: 'Ingradient', category: 'seafood', expiry: '3일' },
  { name: '조개', icon: '조개', folder: 'Ingradient', category: 'seafood', expiry: '2일' },
  { name: '홍합', icon: '홍합', folder: 'Ingradient', category: 'seafood', expiry: '2일' },
  { name: '명란', icon: '명란', folder: 'Ingradient', category: 'seafood', expiry: '1주일' },
  { name: '날치알', icon: '날치알', folder: 'Ingradient', category: 'seafood', expiry: '1주일' },
  // 과일
  { name: '사과', icon: '사과', folder: 'Ingradient', category: 'fruit', expiry: '1개월' },
  { name: '배', icon: '배', folder: 'Ingradient', category: 'fruit', expiry: '2주일' },
  { name: '바나나', icon: '바나나', folder: 'Ingradient', category: 'fruit', expiry: '1주일' },
  { name: '포도', icon: '포도', folder: 'Ingradient', category: 'fruit', expiry: '1주일' },
  { name: '딸기', icon: '딸기', folder: 'Ingradient', category: 'fruit', expiry: '3일' },
  { name: '블루베리', icon: '블루베리', folder: 'Ingradient', category: 'fruit', expiry: '1주일' },
  { name: '키위', icon: '키위', folder: 'Ingradient', category: 'fruit', expiry: '2주일' },
  { name: '귤', icon: '귤', folder: 'Ingradient', category: 'fruit', expiry: '1개월' },
  { name: '오렌지', icon: '오렌지', folder: 'Ingradient', category: 'fruit', expiry: '2주일' },
  { name: '자몽', icon: '자몽', folder: 'Ingradient', category: 'fruit', expiry: '2주일' },
  { name: '레몬', icon: '레몬', folder: 'Ingradient', category: 'fruit', expiry: '1개월' },
  { name: '수박', icon: '수박', folder: 'Ingradient', category: 'fruit', expiry: '1주일' },
  { name: '복숭아', icon: '복숭아', folder: 'Ingradient', category: 'fruit', expiry: '1주일' },
  { name: '참외', icon: '참외', folder: 'Ingradient', category: 'fruit', expiry: '1주일' },
  { name: '망고', icon: '망고', folder: 'Ingradient', category: 'fruit', expiry: '1주일' },
  { name: '파인애플', icon: '파인애플', folder: 'Ingradient', category: 'fruit', expiry: '3일' },
  { name: '아보카도', icon: '아보카도', folder: 'Ingradient', category: 'fruit', expiry: '3일' },
  { name: '체리', icon: '체리', folder: 'Ingradient', category: 'fruit', expiry: '3일' },
]

export default function DirectInput() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { addIngredient, addFavorite, removeFavorite, isFavorite } = useFridge()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'veg')
  const [selectedItems, setSelectedItems] = useState([])
  const [selectedOpen, setSelectedOpen] = useState(false)

  const filteredItems = DI_ITEMS.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false
    if (searchQuery && !item.name.includes(searchQuery)) return false
    return true
  })

  function toggleItem(item) {
    setSelectedItems((prev) => {
      const idx = prev.findIndex((s) => s.name === item.name)
      if (idx >= 0) return prev.filter((_, i) => i !== idx)
      if (!selectedOpen) setSelectedOpen(true)
      return [...prev, { ...item, qty: 1, starred: isFavorite(item.name), frozen: false }]
    })
  }

  function toggleFrozen(i) {
    setSelectedItems((prev) =>
      prev.map((item, idx) => idx === i ? { ...item, frozen: !item.frozen } : item)
    )
  }

  function adjustQty(i, delta) {
    setSelectedItems((prev) =>
      prev.map((item, idx) => idx === i ? { ...item, qty: Math.max(1, item.qty + delta) } : item)
    )
  }

  function toggleStar(i) {
    setSelectedItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== i) return item
        const next = !item.starred
        if (next) addFavorite(item)
        else removeFavorite(item.name)
        return { ...item, starred: next }
      })
    )
  }

  function resolveExpiryDate(expiry) {
    if (!expiry) return ''
    if (/^\d{4}-\d{2}-\d{2}$/.test(expiry)) return expiry
    const today = new Date()
    const n = parseInt(expiry) || 0
    let days = 0
    if (expiry.includes('개월')) days = n * 30
    else if (expiry.includes('주일') || expiry.includes('주')) days = n * 7
    else if (expiry.includes('일')) days = n
    if (!days) return ''
    const d = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
    return d.toISOString().split('T')[0]
  }

  function saveItems() {
    if (selectedItems.length === 0) { alert('재료를 먼저 선택해주세요'); return }
    selectedItems.forEach((item) => addIngredient({
      name: item.name,
      icon: item.icon || item.name,
      folder: item.folder || 'Ingradient',
      category: item.category,
      quantity: item.qty,
      expiryDate: resolveExpiryDate(item.expiry),
      storageType: item.frozen ? '냉동' : '냉장',
    }))
    navigate('/fridge')
  }

  return (
    <>
      {/* 헤더 */}
      <header className="di-header">
        <button className="di-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/action/ic-chevron-left.svg" height="16" alt="뒤로" />
        </button>
        <span className="di-header__title">직접입력</span>
        <button className="di-header__btn" onClick={() => navigate('/')}>
          <img src="/assets/icons/home_top_icon.svg" width="27" height="24" alt="홈" />
        </button>
      </header>

      <div className="di-content">
        {/* 검색바 */}
        <div className="di-search">
          <img src="/assets/icons/common/ic-search.svg" width="19" height="19" alt="" />
          <input
            className="di-search__input"
            type="text"
            placeholder="찾고싶은 식재료가 있나요?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 카테고리 탭 */}
        <div className="di-category-wrap">
          <div className="di-category-list">
            {DI_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`di-cat-chip${cat.id === activeCategory ? ' di-cat-chip--active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="di-category-divider" />
        </div>

        {/* 식재료 그리드 */}
        <div className="di-grid">
          {filteredItems.length === 0 ? (
            <p className="di-grid__empty">검색 결과가 없어요.</p>
          ) : (
            filteredItems.map((item) => {
              const isSelected = selectedItems.some((s) => s.name === item.name)
              return (
                <div
                  key={item.name}
                  className={`di-card${isSelected ? ' di-card--active' : ''}`}
                  onClick={() => toggleItem(item)}
                >
                  <img
                    className="di-card__img"
                    src={`/assets/icons/${item.folder || 'Add_Ingredient_page'}/${item.icon}.svg`}
                    alt={item.name}
                    onError={(e) => { e.currentTarget.style.opacity = '0.3' }}
                  />
                  <span className="di-card__name">{item.name}</span>
                </div>
              )
            })
          )}
        </div>

        {/* 선택된 재료 */}
        <div className="di-section">
          <div className="di-section__header" onClick={() => setSelectedOpen((o) => !o)}>
            <div className="di-section__text">
              <p className="di-section__title">
                선택된 재료{selectedItems.length > 0 && (
                  <span className="di-section__count"> {selectedItems.length}</span>
                )}
              </p>
              <p className="di-section__subtitle">자주 쓰는 재료는 즐겨찾기 추가가 가능해요!</p>
            </div>
            <img
              src="/assets/icons/action/ic-chevron-down.svg" width="17" height="10" alt=""
              className={`di-section__chevron${selectedOpen ? ' di-section__chevron--open' : ''}`}
            />
          </div>
          {selectedOpen && (
            <div className="di-section__body">
              {selectedItems.length === 0 ? (
                <p className="di-section__empty">아직 담은 재료가 없어요</p>
              ) : (
                selectedItems.map((item, i) => (
                  <div key={i} className="di-sel-item">
                    <img
                      className="di-sel-item__img"
                      src={item.icon.startsWith?.('blob:') || item.icon.startsWith?.('data:')
                        ? item.icon
                        : `/assets/icons/${item.folder || 'Add_Ingredient_page'}/${item.icon}.svg`}
                      alt={item.name}
                      onError={(e) => { e.currentTarget.style.opacity = '0.3' }}
                    />
                    <div className="di-sel-item__info">
                      <span className="di-sel-item__name">{item.name}</span>
                      <div className="di-sel-item__expiry">
                        <span>유통기한 {item.expiry || '미설정'}</span>
                      </div>
                    </div>
                    <button
                      className={`di-sel-freeze-btn${item.frozen ? ' di-sel-freeze-btn--active' : ''}`}
                      onClick={() => toggleFrozen(i)}
                    >
                      <img
                        src="/assets/icons/common/badge-frozen.svg"
                        width="28" height="28"
                        alt="냉동"
                        style={{ filter: item.frozen ? 'none' : 'saturate(0) brightness(1.6)' }}
                      />
                    </button>
                    <div className="di-sel-item__qty">
                      <button className="di-sel-qty-btn" onClick={() => adjustQty(i, -1)}>−</button>
                      <span className="di-sel-qty-val">{item.qty}</span>
                      <button className="di-sel-qty-btn" onClick={() => adjustQty(i, 1)}>+</button>
                    </div>
                    <button className="di-sel-star" onClick={() => toggleStar(i)}>
                      <svg width="19" height="18" viewBox="0 0 23 22" fill="none">
                        <path d="M4.21638 20.9552C4.39056 18.6865 5.03103 17.1043 5.51339 15.4845C5.81352 14.4735 5.60986 13.8085 4.69606 13.2373C3.2195 12.3147 1.82333 11.2635 0.612075 10.0058C-0.40892 8.9465 -0.138263 7.96231 1.31686 7.73437C2.98368 7.47156 4.68266 7.37234 6.3736 7.31334C7.32492 7.27848 7.79656 6.92985 8.09937 6.01807C8.63265 4.41172 9.30528 2.85364 9.94038 1.28215C10.1976 0.643901 10.5648 0.0136972 11.3339 0.000288556C12.1137 -0.0158018 12.4835 0.643901 12.7434 1.25802C13.3651 2.73564 13.9949 4.21863 14.4853 5.74185C14.7881 6.68582 15.1847 7.11221 16.2593 7.09076C17.9476 7.05857 19.6412 7.22752 21.3294 7.35356C21.9485 7.39915 22.6291 7.50642 22.9105 8.17149C23.216 8.89019 22.6774 9.34876 22.2272 9.77248C21.0909 10.8398 19.9467 11.9018 18.7649 12.9208C18.0199 13.5617 17.8645 14.267 18.1593 15.1842C18.6684 16.753 19.0945 18.3486 19.3464 19.9845C19.4429 20.6173 19.459 21.2663 18.9042 21.7115C18.2879 22.2022 17.6823 21.8241 17.1785 21.4916C15.7635 20.561 14.3701 19.5983 13.0087 18.59C12.2209 18.0054 11.5724 18.1341 10.8327 18.6651C9.34815 19.727 7.98146 20.974 6.30124 21.7383C4.95064 22.3497 4.16814 21.808 4.21638 20.9552Z"
                          fill={item.starred ? '#FFC700' : '#C8C2BC'} />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>

      {/* 하단 CTA */}
      <div className="di-cta">
        <button className="di-cta__btn" onClick={saveItems}>재료 담기</button>
      </div>
    </>
  )
}
