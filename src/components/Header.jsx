import { useNavigate } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'

export default function Header({ type = 'main', title = '' }) {
  const navigate = useNavigate()
  const { cart } = useFridge()

  if (type === 'main') {
    return (
      <header className="app-header">
        <div className="app-header__status">
          <span className="app-header__time">9:41</span>
          <div className="app-header__status-icons">
            <img src="/assets/icons/Cellular Connection.svg" width="18" height="12" alt="" />
            <img src="/assets/icons/Wifi.svg" width="16" height="12" alt="" />
            <img src="/assets/icons/Vector-1.svg" width="26" height="12" alt="" />
          </div>
        </div>
        <div className="app-header__gnb">
          <div className="app-header__logo">오늘 머먹찌?</div>
          <button className="app-header__cart-btn" onClick={() => navigate('/cart')}>
            <img src="/assets/icons/Ic_Cart.svg" width="35" height="30" alt="장바구니" />
            {cart.length > 0 && (
              <span className="app-header__cart-badge-wrap">
                <img src="/assets/icons/Cart_Num_Bg.svg" width="18" height="18" alt="" className="app-header__cart-badge-bg" />
                <span className="app-header__cart-badge-num">{cart.length}</span>
              </span>
            )}
          </button>
        </div>
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
