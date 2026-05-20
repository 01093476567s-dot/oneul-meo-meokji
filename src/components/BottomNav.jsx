import { NavLink } from 'react-router-dom'

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav__inner">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `bottom-nav__item${isActive ? ' active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <span className="bottom-nav__icon">
                <img
                  src={isActive ? '/assets/icons/navigation/ic-home-fill.svg' : '/assets/icons/navigation/ic-home.svg'}
                  width="26" height="26" alt=""
                />
              </span>
              <span>홈</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/fridge"
          className={({ isActive }) => `bottom-nav__item${isActive ? ' active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <span className="bottom-nav__icon">
                <img
                  src={isActive ? '/assets/icons/navigation/ic-fridge-fill.svg' : '/assets/icons/navigation/ic-fridge.svg'}
                  width="26" height="26" alt=""
                />
              </span>
              <span>냉장고</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/mypage"
          className={({ isActive }) => `bottom-nav__item${isActive ? ' active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <span className="bottom-nav__icon">
                <img
                  src={isActive ? '/assets/icons/navigation/ic-user-fill.svg' : '/assets/icons/navigation/ic-user.svg'}
                  width="26" height="26" alt=""
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
