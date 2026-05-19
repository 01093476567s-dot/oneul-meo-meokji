import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

/* ── mock 상세 데이터 (실제 저장 데이터로 교체 예정) ── */
const MOCK_DETAIL = {
  1:  {
    title: '간단한 김치볶음밥',
    date: '2026-05-12',
    img: '/images/소불고기.jpg',
    tags: ['#완전 맛있는', '#다음에 또', '#돼지고기', '#간단', '#배추'],
    content: '내가 직접 만든 소불고기 너무 맛있었다!!\n다음에 또 해먹어야지',
    ingredients: [
      { name: '소고기', icon: null },
      { name: '깻잎', icon: null },
      { name: '버섯', icon: null },
    ],
  },
  2:  { title: '간단 요리 기록',    date: '2026-05-06', img: '/images/두부스테이크.jpg',      tags: ['#두부', '#건강식'], content: '두부로 만든 스테이크, 생각보다 맛있었다!', ingredients: [] },
  3:  { title: '오늘의 밥상',       date: '2026-05-05', img: '/images/간장계란버터밥.jpg',    tags: ['#계란', '#간단'], content: '간장 계란 버터밥, 최고의 조합', ingredients: [] },
  4:  { title: '단백질 챙기기',     date: '2026-05-04', img: '/assets/images/장조림.png',    tags: ['#장조림'], content: '', ingredients: [] },
  5:  { title: '한입 행복',         date: '2026-04-21', img: '/assets/images/우엉조림.png',  tags: ['#우엉', '#건강'], content: '', ingredients: [] },
  6:  { title: '냠냠 기록',         date: '2026-04-06', img: '/assets/images/연근.png',      tags: [], content: '', ingredients: [] },
  7:  { title: '청양고추 킥🔥',    date: '2026-03-30', img: null, tags: ['#매운맛'], content: '오늘은 청양 고추 한가득!', ingredients: [] },
  8:  { title: '계란 듬뿍 도시락', date: '2026-03-27', img: null, tags: ['#계란'], content: '', ingredients: [] },
  9:  { title: '낙지 매콤 한 끼',   date: '2026-03-25', img: null, tags: ['#낙지', '#매운맛'], content: '', ingredients: [] },
  10: { title: '참치 든든 도시락', date: '2026-03-23', img: null, tags: ['#참치'], content: '', ingredients: [] },
  11: { title: '그냥 밑반찬만 싸간', date: '2026-03-20', img: null, tags: [], content: '', ingredients: [] },
  12: { title: '오늘도 잘 먹었다', date: '2026-03-18', img: null, tags: [], content: '', ingredients: [] },
}

function formatHeaderDate(dateStr) {
  return dateStr.replace(/-/g, '.')
}

export default function LunchRecordDetail() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const [kebabOpen, setKebabOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const record = MOCK_DETAIL[state?.id] || MOCK_DETAIL[1]

  function handleDelete() {
    setDeleteModalOpen(false)
    navigate(-1)
  }

  return (
    <>
      {/* ── 헤더 ── */}
      <header className="di-header lrec-header">
        <button className="di-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/back_icon.svg" width="10" height="17" alt="뒤로" />
        </button>

        <span className="di-header__title lrec-header__title">
          {formatHeaderDate(record.date)}
        </span>

        <div className="lrec-kebab-wrap">
          <button
            className={`di-header__btn${kebabOpen ? ' lrec-btn--active' : ''}`}
            onClick={() => setKebabOpen(v => !v)}
          >
            <img src="/assets/icons/Kebab_icon.svg" width="4" height="18" alt="더보기" />
          </button>

          {kebabOpen && (
            <>
              <div className="lrec-kebab-overlay" onClick={() => setKebabOpen(false)} />
              <div className="lrec-kebab-menu">
                <button
                  className="lrec-kebab-item"
                  onClick={() => {
                    navigate('/lunch-record', { state: { date: record.date, name: record.title, tags: record.tags, content: record.content } })
                    setKebabOpen(false)
                  }}
                >
                  수정하기
                </button>
                <button
                  className="lrec-kebab-item lrec-kebab-item--danger"
                  onClick={() => { setKebabOpen(false); setDeleteModalOpen(true) }}
                >
                  삭제하기
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── 본문 ── */}
      <div className="lrd-content">
        {/* 대표 사진 */}
        <div className="lrd-photo">
          {record.img && (
            <img
              src={record.img}
              alt={record.title}
              className="lrd-photo__img"
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
          )}
        </div>

        {/* 제목 */}
        <h1 className="lrd-title">{record.title}</h1>

        {/* 태그 */}
        {record.tags.length > 0 && (
          <div className="lrd-tags">
            {record.tags.map((tag, i) => (
              <span key={i} className="lr-tag-chip">{tag}</span>
            ))}
          </div>
        )}

        {/* 메모 */}
        {record.content && (
          <p className="lrd-memo">{record.content}</p>
        )}

        {/* 구분선 */}
        <div className="lrd-divider" />

        {/* 사용한 식재료 */}
        <div className="lrd-ingredients">
          <p className="lrd-ingredients__label">사용한 식재료</p>
          {record.ingredients.length > 0 ? (
            <div className="lrd-ingredients__list">
              {record.ingredients.map((ing, i) => (
                <div key={i} className="lr-ingredient-card">
                  {ing.icon && (
                    <img src={ing.icon} alt={ing.name} className="lr-ingredient-card__img" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="lrd-ingredients__empty">기록된 식재료가 없어요</p>
          )}
        </div>
      </div>

      {/* ── 삭제 확인 팝업 (Figma 274-1263) ── */}
      {deleteModalOpen && (
        <div className="lrd-modal-overlay" onClick={() => setDeleteModalOpen(false)}>
          <div className="lrd-modal" onClick={e => e.stopPropagation()}>
            <p className="lrd-modal__text">도시락 기록을 정말로 삭제 하시겠습니까?</p>
            <div className="lrd-modal__actions">
              <button className="lrd-modal__btn lrd-modal__btn--cancel" onClick={() => setDeleteModalOpen(false)}>
                취소
              </button>
              <button className="lrd-modal__btn lrd-modal__btn--delete" onClick={handleDelete}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
