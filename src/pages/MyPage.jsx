import { useNavigate } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'

export default function MyPage() {
  const navigate = useNavigate()
  const { user } = useFridge()

  return (
    <div className="mp-page">
      {/* ── 오렌지 헤더 ── */}
      <div className="mp-header">
        {/* 알림·설정 버튼 */}
        <div className="mp-header__top-actions">
          <button className="mp-header__icon-btn" aria-label="알림">
            <img src="/assets/icons/Mypage/Ic_Notification.svg" width="47" height="47" alt="알림"
              onError={(e) => { e.currentTarget.style.display = 'none' }} />
          </button>
          <button className="mp-header__icon-btn" aria-label="설정">
            <img src="/assets/icons/Mypage/Ic_Setting.svg" width="47" height="47" alt="설정"
              onError={(e) => { e.currentTarget.style.display = 'none' }} />
          </button>
        </div>

        {/* 캐릭터 프로필 */}
        <div className="mp-header__character-area">
          <img
            className="mp-header__character"
            src="/assets/icons/Mypage/구독.svg"
            alt="구독 캐릭터"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </div>

        {/* 닉네임 */}
        <div className="mp-header__name-row">
          <span className="mp-header__name">{user.name}</span>
          <img src="/assets/icons/Mypage/Ic_Edit_Nickname.svg" width="18" height="18" alt="닉네임 수정"
            onError={(e) => { e.currentTarget.style.display = 'none' }} />
        </div>

        {/* 포인트 · 구독현황 카드 */}
        <div className="mp-status-grid">
          <div className="mp-status-card">
            <div className="mp-status-card__label-wrap">
              <img src="/assets/icons/Mypage/포인트.svg" width="19" height="18" alt=""
                onError={(e) => { e.currentTarget.style.display = 'none' }} />
              <span className="mp-status-card__label">포인트</span>
            </div>
            <span className="mp-status-card__value">{user.points}P</span>
          </div>
          <div className="mp-status-card" onClick={() => navigate('/subscription')} style={{ cursor: 'pointer' }}>
            <div className="mp-status-card__label-wrap">
              <img src="/assets/icons/Mypage/구독.svg" width="14" height="19" alt=""
                onError={(e) => { e.currentTarget.style.display = 'none' }} />
              <span className="mp-status-card__label">구독현황</span>
            </div>
            <span className="mp-status-card__value">{user.subscription || '비구독'}</span>
          </div>
        </div>
      </div>

      {/* ── 메뉴 섹션 ── */}
      <div className="mp-menu-wrap">

        {/* 도시락 & 기록 */}
        <div className="mp-menu-section">
          <h3 className="mp-menu-section__title">도시락 &amp; 기록</h3>
          <div className="mp-menu-list">
            <div className="mp-menu-item">
              <img src="/assets/icons/Mypage/오늘의 메뉴추천.svg" className="mp-menu-item__icon" alt="" />
              <span className="mp-menu-item__label">오늘의 메뉴 추천</span>
            </div>
            <div className="mp-menu-item">
              <img src="/assets/icons/Mypage/레시피탐색.svg" className="mp-menu-item__icon" alt="" />
              <span className="mp-menu-item__label">레시피 탐색</span>
            </div>
            <div className="mp-menu-item">
              <img src="/assets/icons/Mypage/나의도시락기록.svg" className="mp-menu-item__icon" alt="" />
              <span className="mp-menu-item__label">나의 도시락 기록</span>
            </div>
          </div>
        </div>

        <div className="mp-divider" />

        {/* 냉장고 관리 */}
        <div className="mp-menu-section">
          <h3 className="mp-menu-section__title">냉장고 관리</h3>
          <div className="mp-menu-list">
            <div className="mp-menu-item" onClick={() => navigate('/fridge')} style={{ cursor: 'pointer' }}>
              <img src="/assets/icons/Mypage/MY냉장고.svg" className="mp-menu-item__icon" alt="" />
              <span className="mp-menu-item__label">MY냉장고</span>
            </div>
            <div className="mp-menu-item" onClick={() => navigate('/add-ingredient')} style={{ cursor: 'pointer' }}>
              <img src="/assets/icons/Mypage/식재료등록.svg" className="mp-menu-item__icon" alt="" />
              <span className="mp-menu-item__label">식재료 등록</span>
            </div>
          </div>
        </div>

        <div className="mp-divider" />

        {/* 구독현황 */}
        <div className="mp-menu-section">
          <h3 className="mp-menu-section__title">구독현황</h3>
          <div className="mp-menu-list">
            <div className="mp-menu-item" onClick={() => navigate('/subscription')} style={{ cursor: 'pointer' }}>
              <img src="/assets/icons/Mypage/구독현황.svg" className="mp-menu-item__icon" alt="" />
              <span className="mp-menu-item__label">구독현황</span>
              <span className="mp-menu-item__sub">아직 구독 전이신가요?</span>
            </div>
            <div className="mp-menu-item">
              <img src="/assets/icons/Mypage/장바구니.svg" className="mp-menu-item__icon" alt="" />
              <span className="mp-menu-item__label">장바구니</span>
              <span className="mp-menu-item__sub">담은 상품 3개</span>
            </div>
            <div className="mp-menu-item">
              <img src="/assets/icons/Mypage/밀키트스토어.svg" className="mp-menu-item__icon" alt="" />
              <span className="mp-menu-item__label">밀키트 스토어</span>
            </div>
            <div className="mp-menu-item">
              <img src="/assets/icons/Mypage/주문내역.svg" className="mp-menu-item__icon" alt="" />
              <span className="mp-menu-item__label">주문내역</span>
            </div>
          </div>
        </div>

        <div className="mp-divider" />

        {/* 고객지원 */}
        <div className="mp-menu-section">
          <h3 className="mp-menu-section__title">고객지원</h3>
          <div className="mp-menu-list">
            <div className="mp-menu-item">
              <span className="mp-menu-item__label">1:1문의</span>
              <span className="mp-menu-item__sub">고객센터 · 평일 09 - 18시</span>
            </div>
            <div className="mp-menu-item">
              <span className="mp-menu-item__label">공지사항 · 약관</span>
              <span className="mp-menu-item__sub">이용약관 · 개인정보처리방침</span>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <footer className="mp-footer">
          <div className="mp-footer__links">
            <span className="mp-footer__link-bold">회원탈퇴</span>
            <span className="mp-footer__divider">|</span>
            <span>사업자정보확인</span>
          </div>
          <p>고객센터 : 010-1234-5678</p>
          <p>이메일 : mmg@mmg.com</p>
        </footer>

      </div>

    </div>
  )
}
