import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { useFridge } from '../context/FridgeContext'

export default function MyPage() {
  const navigate = useNavigate()
  const { user } = useFridge()

  const menuSections = [
    {
      title: '나의 활동',
      items: [
        { icon: '📅', label: '도시락 기록', value: '' },
        { icon: '⭐', label: '즐겨찾기', value: '' },
        { icon: '🎁', label: '포인트', value: `${user.points}P` },
      ],
    },
    {
      title: '구독',
      items: [
        { icon: '📦', label: '구독 현황', value: user.subscription || '비구독', action: '/subscription' },
        { icon: '💳', label: '결제 수단 관리', value: '' },
        { icon: '📜', label: '결제 내역', value: '' },
      ],
    },
    {
      title: '설정',
      items: [
        { icon: '🔔', label: '알림 설정', value: '' },
        { icon: '🔒', label: '개인정보 처리방침', value: '' },
        { icon: '📋', label: '이용약관', value: '' },
        { icon: 'ℹ️', label: '앱 버전', value: 'v1.0.0' },
      ],
    },
  ]

  return (
    <>
      <Header type="main" />
      <div className="page-content">
        <div className="mypage-header">
          <div className="mypage-header__actions">
            <button className="mypage-header__action-btn">🔔</button>
            <button className="mypage-header__action-btn">⚙️</button>
          </div>
          <img
            className="mypage-header__avatar"
            src="/assets/mascot/mascot-default.png"
            alt="프로필"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <div className="mypage-header__name">
            {user.name}
            <button className="mypage-header__edit-btn">✏️</button>
          </div>
          <div className="mypage-header__stats">
            <div className="mypage-stat">
              <p className="mypage-stat__label">포인트</p>
              <p className="mypage-stat__value">{user.points}P</p>
            </div>
            <div className="mypage-stat">
              <p className="mypage-stat__label">구독현황</p>
              <p className="mypage-stat__value">{user.subscription || '비구독'}</p>
            </div>
          </div>
        </div>

        {menuSections.map((section) => (
          <div key={section.title}>
            <div className="menu-section">
              <p className="menu-section__title">{section.title}</p>
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="menu-item"
                  onClick={() => item.action && navigate(item.action)}
                  style={{ cursor: item.action ? 'pointer' : 'default' }}
                >
                  <span className="menu-item__icon">{item.icon}</span>
                  <span className="menu-item__label">{item.label}</span>
                  <span className="menu-item__value">{item.value}</span>
                  <span style={{ color: 'var(--gray-400)' }}>›</span>
                </div>
              ))}
            </div>
            <div className="menu-divider" />
          </div>
        ))}

        <footer className="mypage-footer">
          <p>회원탈퇴 | 사업자정보확인</p>
          <p>오늘머먹찌 · 02-000-0000</p>
          <p>contact@oheadmuk.com</p>
        </footer>
      </div>
      <BottomNav />
    </>
  )
}
