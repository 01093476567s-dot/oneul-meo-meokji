import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DISHES = [
  { id: 1, name: '장조림',   date: '5월 6일',  img: '/assets/images/장조림.png',   progress: 70 },
  { id: 2, name: '우엉조림', date: '5월 12일', img: '/assets/images/우엉조림.png', progress: 50 },
  { id: 3, name: '연근조림', date: '5월 14일', img: '/assets/images/연근.png',     progress: 70 },
]

export default function BanchanList() {
  const navigate = useNavigate()
  const [dishes, setDishes] = useState(DISHES)
  const [openKebabId, setOpenKebabId] = useState(null)

  function handleDelete(id) {
    setDishes(prev => prev.filter(d => d.id !== id))
    setOpenKebabId(null)
  }

  return (
    <>
      {/* ── 헤더 ── */}
      <header className="di-header lrec-header">
        <button className="di-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/back_icon.svg" width="10" height="17" alt="뒤로" />
        </button>
        <span className="di-header__title lrec-header__title">밑반찬</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="di-header__btn" style={{ padding: 4 }}>
            <img src="/assets/icons/Ic_Search.svg" width="20" height="20" alt="검색" />
          </button>
          <button className="di-header__btn" style={{ padding: 4 }}>
            <img src="/assets/icons/Kebab_icon.svg" width="4" height="18" alt="더보기" />
          </button>
        </div>
      </header>

      <div className="bl-content">
        {/* ── 타이틀 ── */}
        <div className="bl-section-title">
          <p className="bl-title">만들어둔 밑반찬을 확인해요.</p>
          <p className="bl-subtitle">사용량을 설정할 수 있어요.</p>
        </div>

        {/* ── 목록 ── */}
        <div className="bl-list">
          {dishes.map((dish) => (
            <div key={dish.id} className="bl-item">
              <div className="lr-divider" style={{ margin: 0 }} />
              <div className="bl-item__row">
                <img
                  className="bl-item__img"
                  src={dish.img}
                  alt={dish.name}
                  onError={e => { e.currentTarget.style.opacity = '0.2' }}
                />
                <div className="bl-item__info">
                  <p className="bl-item__name">{dish.name}</p>
                  <p className="bl-item__date">{dish.date}</p>
                </div>
                <span className="bl-item__progress">{dish.progress}%</span>

                {/* 아이템 케밥 */}
                <div className="lrec-kebab-wrap">
                  <button
                    className="di-header__btn bl-item__kebab"
                    onClick={() => setOpenKebabId(prev => prev === dish.id ? null : dish.id)}
                  >
                    <img src="/assets/icons/Kebab_color_icon.svg" width="4" height="18" alt="더보기" />
                  </button>
                  {openKebabId === dish.id && (
                    <>
                      <div className="lrec-kebab-overlay" onClick={() => setOpenKebabId(null)} />
                      <div className="lrec-kebab-menu bl-item__kebab-menu">
                        <button
                          className="lrec-kebab-item"
                          onClick={() => { navigate('/banchan-register'); setOpenKebabId(null) }}
                        >
                          수정하기
                        </button>
                        <button
                          className="lrec-kebab-item lrec-kebab-item--danger"
                          onClick={() => handleDelete(dish.id)}
                        >
                          삭제하기
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="lr-divider" style={{ margin: 0 }} />
        </div>

        {/* ── 추가 버튼 ── */}
        <button className="bl-add-btn" onClick={() => navigate('/banchan-register')}>
          <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
            <path d="M11.5 1V22M1 11.5H22" stroke="#ff8c66" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </>
  )
}
