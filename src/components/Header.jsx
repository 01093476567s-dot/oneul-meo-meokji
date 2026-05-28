import { useNavigate } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'

export default function Header({ type = 'main', title = '', onHamburger }) {
  const navigate = useNavigate()
  const { cart } = useFridge()

  if (type === 'fridge') {
    return (
      <div className="chatbot-header">
        <h1 className="chatbot-header__title">냉장고</h1>
        <button className="chatbot-header__icon-btn" onClick={onHamburger}>
          <img src="/assets/icons/common/ic-menu.svg" width="28" alt="메뉴" />
        </button>
      </div>
    )
  }

  if (type === 'main') {
    return (
      <header className="app-header">
        <button className="app-header__logo" onClick={() => navigate('/')}>
          <img
            src="/assets/images/brand/img-logo.svg"
            height="36"
            alt="오늘 머먹지?"
          />
        </button>
        <button className="app-header__cart-btn" onClick={() => navigate('/cart')}>
          <img src="/assets/icons/Ic_Cart.svg" width="35" height="30" alt="장바구니" className="app-header__cart-icon" />
          {cart.length > 0 && (
            <span className="app-header__badge">{cart.length}</span>
          )}
        </button>
      </header>
    )
  }

  return (
    <header className="app-header--sub">
      <button className="app-header__back" onClick={() => navigate(-1)}>
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M9 1L1 9L9 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <span className="app-header__center">{title}</span>
      <button className="app-header__home" onClick={() => navigate('/')}>
        <img src="/assets/icons/navigation/ic-home.svg" width="22" height="22" alt="홈" style={{ filter: 'brightness(0) invert(1)' }} />
      </button>
    </header>
  )
}
