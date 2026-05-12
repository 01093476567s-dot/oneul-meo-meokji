function renderMypagePage() {
  const { user } = Store.getState();

  const menuSections = [
    {
      title: '나의 활동',
      items: [
        { icon: '📅', label: '도시락 기록', value: '' },
        { icon: '⭐', label: '즐겨찾기', value: '' },
        { icon: '🎁', label: '포인트', value: `${user.points}P` },
      ]
    },
    {
      title: '구독',
      items: [
        { icon: '📦', label: '구독 현황', value: user.subscription || '비구독', action: 'subscription' },
        { icon: '💳', label: '결제 수단 관리', value: '' },
        { icon: '📜', label: '결제 내역', value: '' },
      ]
    },
    {
      title: '설정',
      items: [
        { icon: '🔔', label: '알림 설정', value: '' },
        { icon: '🔒', label: '개인정보 처리방침', value: '' },
        { icon: '📋', label: '이용약관', value: '' },
        { icon: 'ℹ️', label: '앱 버전', value: 'v1.0.0' },
      ]
    },
  ];

  return `
    ${renderHeader({ type: 'main' })}
    <div class="page-content">
      <div class="mypage-header">
        <div class="mypage-header__actions">
          <button class="mypage-header__action-btn">🔔</button>
          <button class="mypage-header__action-btn">⚙️</button>
        </div>
        <img class="mypage-header__avatar" src="assets/mascot/mascot-default.png" alt="프로필"
          onerror="this.outerHTML='<div style=width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;font-size:40px;margin:0 auto var(--space-8)>🐹</div>'">
        <div class="mypage-header__name">
          ${user.name}
          <button class="mypage-header__edit-btn">✏️</button>
        </div>
        <div class="mypage-header__stats">
          <div class="mypage-stat">
            <p class="mypage-stat__label">포인트</p>
            <p class="mypage-stat__value">${user.points}P</p>
          </div>
          <div class="mypage-stat">
            <p class="mypage-stat__label">구독현황</p>
            <p class="mypage-stat__value">${user.subscription || '비구독'}</p>
          </div>
        </div>
      </div>

      ${menuSections.map(section => `
        <div class="menu-section">
          <p class="menu-section__title">${section.title}</p>
          ${section.items.map(item => `
            <div class="menu-item" onclick="${item.action ? `Router.navigate('${item.action}')` : ''}">
              <span class="menu-item__icon">${item.icon}</span>
              <span class="menu-item__label">${item.label}</span>
              <span class="menu-item__value">${item.value}</span>
              <span style="color: var(--gray-400)">›</span>
            </div>
          `).join('')}
        </div>
        <div class="menu-divider"></div>
      `).join('')}

      <footer class="mypage-footer">
        <p>회원탈퇴 | 사업자정보확인</p>
        <p>오늘머먹찌 · 02-000-0000</p>
        <p>contact@oheadmuk.com</p>
      </footer>
    </div>
    ${renderBottomNav('mypage')}
  `;
}
