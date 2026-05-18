import { useNavigate } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'

export default function Header({ type = 'main', title = '' }) {
  const navigate = useNavigate()
  const { cart } = useFridge()

  if (type === 'main') {
    return (
      <header className="app-header">
        <button className="app-header__logo" onClick={() => navigate('/')}>
          <img
            src="/assets/images/logo.png"
            width="206"
            height="41"
            alt="오늘 머먹지?"
            onError={(e) => { e.currentTarget.src = '/images/logo.png' }}
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
        <img src="/assets/icons/home.svg" width="22" height="20" alt="홈" style={{ filter: 'brightness(0) invert(1)' }} />
      </button>
    </header>
  )
}
