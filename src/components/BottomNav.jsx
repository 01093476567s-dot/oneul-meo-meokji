import { NavLink } from 'react-router-dom'

function FridgeIcon({ active }) {
  return <img src="/assets/icons/Ic_Tab_Fridge.svg" width="19" height="28" alt="" />
}

function MypageIcon({ active }) {
  if (!active) {
    return <img src="/assets/icons/Ic_Tab.svg" width="24" height="25" alt="" />
  }
  return (
    <svg width="24" height="25" viewBox="0 0 31 31" fill="none">
      <path d="M14.8948 0.00201831C6.66771 0.173644 -0.444082 7.36688 0.0216611 16.0445C0.514981 25.2551 5.08969 30.4611 16.2737 30.988C23.8113 31.3433 31.0518 23.7316 30.9997 16.2101C31.015 6.56596 21.4091 -0.133476 14.8948 0.00201831ZM24.3751 26.2969C21.7523 27.9289 19.1815 29.6783 14.9162 29.5699C12.6151 29.4223 9.60311 28.4588 6.75657 26.9202C6.24792 26.6462 5.9599 26.3481 6.06408 25.7519C6.47467 23.4365 7.48888 21.5968 9.98919 20.9223C10.4304 20.8019 10.8839 20.7206 11.3159 20.573C12.1218 20.296 13.0441 20.1274 13.1452 19.0435C13.2371 18.0498 13.2739 17.1977 12.3026 16.3878C10.363 14.7679 9.7226 12.5759 10.4396 10.149C11.0555 8.06844 12.4987 6.72855 14.7048 6.32207C16.865 5.92161 18.7617 6.98147 19.5522 9.0169C20.5634 11.6274 20.3029 13.994 18.1519 16.0265C16.5678 17.5259 17.0489 19.5614 19.0957 20.2358C19.9107 20.5038 20.7626 20.6844 21.5623 20.9855C23.6214 21.7594 24.3016 23.5118 24.7459 25.4237C24.847 25.8272 24.7244 26.0801 24.3751 26.2969Z" fill="#FF8C66" />
    </svg>
  )
}

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
                  src={isActive ? '/assets/icons/home.svg' : '/assets/icons/Ic_Tab-2.svg'}
                  width="26" height="24" alt=""
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
                <FridgeIcon active={isActive} />
              </span>
              <span>냉장고</span>
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
                <MypageIcon active={isActive} />
              </span>
              <span>마이페이지</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  )
}
