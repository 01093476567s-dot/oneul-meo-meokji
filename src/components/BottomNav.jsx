import { NavLink } from 'react-router-dom'

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav__inner">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `bottom-nav__item bottom-nav__item--home${isActive ? ' active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <span className="bottom-nav__icon">
                <img
                  src={isActive ? '/assets/icons/navigation/ic-home-fill.svg' : '/assets/icons/navigation/ic-home.svg'}
                  alt=""
                />
              </span>
              <span>홈</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/fridge"
          className={({ isActive }) => `bottom-nav__item bottom-nav__item--fridge${isActive ? ' active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <span className="bottom-nav__icon">
                <img
                  src={isActive ? '/assets/icons/navigation/ic-fridge-fill.svg' : '/assets/icons/navigation/ic-fridge.svg'}
                  alt=""
                />
              </span>
              <span>냉장고</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/chatbot"
          className={({ isActive }) => `bottom-nav__item bottom-nav__item--chat${isActive ? ' active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <span className="bottom-nav__icon">
                <img
                  src={isActive ? '/assets/icons/navigation/ic-chat-fill.svg' : '/assets/icons/navigation/ic-chat.svg'}
                  alt=""
                />
              </span>
              <span>챗봇</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/mypage"
          className={({ isActive }) => `bottom-nav__item bottom-nav__item--mypage${isActive ? ' active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <span className="bottom-nav__icon">
                <img
                  src={isActive ? '/assets/icons/navigation/ic-user-fill.svg' : '/assets/icons/navigation/ic-user.svg'}
                  alt=""
                />
              </span>
              <span>마이페이지</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  )
}
