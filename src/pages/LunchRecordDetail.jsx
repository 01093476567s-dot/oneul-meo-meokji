import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

/* ── mock 상세 데이터 (실제 저장 데이터로 교체 예정) ── */
const MOCK_DETAIL = {
  1:  {
    title: '감태 뿌린 도시락',
    date: '2026-05-12',
    images: [
      '/assets/images/lunch-records-1.jpg',
      '/assets/images/lunch-records-1-1.jpg',
      '/assets/images/lunch-records-1-2.jpg',
    ],
    tags: ['#감태후레이크', '#진미채', '#시금치무침', '#계란말이', '#알록달록'],
    content: '감태 솔솔 뿌리니까 진짜 밥도둑이었다!!\n감태가 몰랐는데 단백질이 엄청 듬뿍이라네\n새우 넣은 계란말이도 대 성공\n\n왕 만족 ^.^',
  },
  2:  { title: '간단 요리 기록',    date: '2026-05-06', images: ['/assets/images/lunch-records-2.jpg'], tags: ['#두부', '#건강식'], content: '두부로 만든 스테이크, 생각보다 맛있었다!' },
  3:  { title: '오늘의 밥상',       date: '2026-05-05', images: ['/assets/images/lunch-records-3.jpg'], tags: ['#계란', '#간단'], content: '간장 계란 버터밥, 최고의 조합' },
  4:  { title: '단백질 챙기기',     date: '2026-05-04', images: ['/assets/images/lunch-records-4.jpg'], tags: ['#장조림'], content: '' },
  5:  { title: '한입 행복',         date: '2026-04-21', images: ['/assets/images/lunch-records-5.jpg'], tags: ['#우엉', '#건강'], content: '' },
  6:  { title: '냠냠 기록',         date: '2026-04-06', images: ['/assets/images/lunch-records-6.jpg'], tags: [], content: '' },
  7:  { title: '청양고추 킥🔥',    date: '2026-03-30', images: ['/assets/images/lunch-records-7.jpg'], tags: ['#매운맛'], content: '오늘은 청양 고추 한가득!' },
  8:  { title: '가지 도시락',       date: '2026-03-27', images: ['/assets/images/lunch-records-8.jpg'], tags: ['#가지'], content: '' },
  9:  { title: '우삼겹 + 상큼유자', date: '2026-03-25', images: ['/assets/images/lunch-records-9.jpg'], tags: ['#우삼겹'], content: '' },
  10: { title: '미나리 초무침',     date: '2026-03-23', images: ['/assets/images/lunch-records-10.jpg'], tags: ['#미나리'], content: '' },
  11: { title: '간단 돈까스',       date: '2026-03-20', images: ['/assets/images/lunch-records-11.jpg'], tags: [], content: '' },
  12: { title: '오늘도 잘 먹었다',  date: '2026-03-18', images: ['/assets/images/lunch-records-12.jpg'], tags: [], content: '' },
}

function formatHeaderDate(dateStr) {
  return dateStr.replace(/-/g, '.')
}

function PhotoCarousel({ images }) {
  const [idx, setIdx] = useState(0)
  const touchStartX = useRef(null)

  if (!images || images.length === 0) {
    return <div className="lrd-photo" />
  }

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
  }

  function onTouchEnd(e) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (dx < -40 && idx < images.length - 1) setIdx(i => i + 1)
    else if (dx > 40 && idx > 0) setIdx(i => i - 1)
  }

  return (
    <div className="lrd-carousel" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div
        className="lrd-carousel__track"
        style={{ transform: `translateX(${-idx * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className="lrd-carousel__slide">
            <img
              src={src}
              alt=""
              className="lrd-photo__img"
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
          </div>
        ))}
      </div>

      {/* 우상단 카운터 */}
      {images.length > 1 && (
        <div className="lrd-carousel__counter">{idx + 1}/{images.length}</div>
      )}

      {/* 하단 점 인디케이터 */}
      {images.length > 1 && (
        <div className="lrd-carousel__dots">
          {images.map((_, i) => (
            <span
              key={i}
              className={`lrd-carousel__dot${i === idx ? ' lrd-carousel__dot--active' : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  )
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
          <img src="/assets/icons/action/ic-chevron-left.svg" height="16" alt="뒤로" />
        </button>

        <span className="di-header__title lrec-header__title">
          {formatHeaderDate(record.date)}
        </span>

        <div className="lrec-kebab-wrap">
          <button
            className={`di-header__btn${kebabOpen ? ' lrec-btn--active' : ''}`}
            onClick={() => setKebabOpen(v => !v)}
          >
            <img src="/assets/icons/common/ic-more-vertical.svg" width="4" alt="더보기" />
          </button>

          {kebabOpen && (
            <>
              <div className="lrec-kebab-overlay" onClick={() => setKebabOpen(false)} />
              <div className="lrec-kebab-menu">
                <button
                  className="lrec-kebab-item"
                  onClick={() => {
                    navigate('/lunch-record', { state: { date: record.date, name: record.title, tags: record.tags, content: record.content, isEdit: true } })
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
        {/* 사진 캐러셀 */}
        <PhotoCarousel images={record.images} />

        {/* 제목 */}
        <h1 className="lrd-title">{record.title}</h1>

        {/* 태그 */}
        {record.tags.length > 0 && (
          <div className="lrd-tags">
            <div className="lrd-tags__row">
              {record.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="lr-tag-chip">{tag}</span>
              ))}
            </div>
            {record.tags.length > 3 && (
              <div className="lrd-tags__row">
                {record.tags.slice(3).map((tag, i) => (
                  <span key={i} className="lr-tag-chip">{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 메모 */}
        {record.content && (
          <p className="lrd-memo">{record.content}</p>
        )}
      </div>

      {/* ── 삭제 확인 팝업 ── */}
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
