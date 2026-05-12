function renderHeader({ type = 'main', title = '', cartCount = 0 } = {}) {
  if (type === 'main') {
    return `
      <header class="app-header">
        <!-- 상태바 42px -->
        <div class="app-header__status">
          <span class="app-header__time">9:41</span>
          <div class="app-header__status-icons">
            <img src="assets/icons/Cellular Connection.svg" width="18" height="12" alt="">
            <img src="assets/icons/Wifi.svg" width="16" height="12" alt="">
            <img src="assets/icons/Vector-1.svg" width="26" height="12" alt="">
          </div>
        </div>
        <!-- GNB 62px -->
        <div class="app-header__gnb">
          <div class="app-header__logo">오늘 머먹찌?</div>
          <button class="app-header__cart-btn" onclick="Router.navigate('cart')">
            <img src="assets/icons/Ic_Cart.svg" width="35" height="30" alt="장바구니">
            ${cartCount > 0 ? `
              <span class="app-header__cart-badge-wrap">
                <img src="assets/icons/Cart_Num_Bg.svg" width="18" height="18" alt="" class="app-header__cart-badge-bg">
                <span class="app-header__cart-badge-num">${cartCount}</span>
              </span>
            ` : ''}
          </button>
        </div>
      </header>
    `;
  }

  /* 서브 페이지 헤더 */
  return `
    <header class="app-header--sub">
      <button class="app-header__back" onclick="Router.back()">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M9 1L1 9L9 17" stroke="white" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <span class="app-header__center">${title}</span>
      <button class="app-header__home" onclick="Router.navigate('home')">
        <img src="assets/icons/home.svg" width="22" height="20" alt="홈"
          style="filter: brightness(0) invert(1)">
      </button>
    </header>
  `;
}
