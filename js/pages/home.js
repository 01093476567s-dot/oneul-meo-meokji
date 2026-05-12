/* 도시락 카드 데이터 — 로컬 이미지 사용 */
const LUNCHBOXES = [
  {
    id: 1,
    title: ['영양만점', '소불고기 도시락'],
    badge: 'AI 추천메뉴',
    desc: '가나다님의 냉장고에서 발견한 <br>식재료로 도시락 메뉴를 준비했어요. <br>오늘은 달콤짭짤한 소불고기 도시락 어떠세요?',
    image: 'images/소불고기.jpg',
  },
  {
    id: 2,
    title: ['건강한 한 끼', '두부 스테이크'],
    badge: 'AI 추천메뉴',
    desc: '담백한 두부스테이크에 <br> 신선한 채소를 곁들여 준비했어요. <br>오늘은 건강한 도시락 한 끼 어떠세요?',
    image: 'images/두부스테이크.jpg',
  },
  {
    id: 3,
    title: ['초간단 메뉴', '계란간장버터 밥'],
    badge: '초간단메뉴',
    desc: '냉장고 속 계란 하나로 만들 수 있어요.<br> 5분 만에 완성되는 초간단 메뉴! <br>오늘은 짭조름한 계란간장버터밥 어때요?',
    image: 'images/간장계란버터밥.jpg',
  },
];

/* 현재 활성 카드 인덱스 (슬라이더 표시용) */
let activeLunchboxIndex = 0;

function renderHomePage() {
  const state = Store.getState();
  const cartCount = state.cart.length;

  return `
    ${renderHeader({ type: 'main', cartCount })}
    <div class="page-content">
      <!-- 상단 탭 (오늘의 도시락 / 나의 도시락 기록) -->
      <div class="home-top-tab">
        <button
          class="home-top-tab__item ${state.homeTab === 'today' ? 'active' : ''}"
          onclick="switchHomeTab('today')"
        >오늘의 도시락${state.homeTab === 'today' ? '<img class="home-top-tab__dot" src="assets/icons/Ic_Dot_Active.svg" alt="">' : ''}</button>
        <button
          class="home-top-tab__item ${state.homeTab === 'calendar' ? 'active' : ''}"
          onclick="switchHomeTab('calendar')"
        >나의 도시락 기록${state.homeTab === 'calendar' ? '<img class="home-top-tab__dot" src="assets/icons/Ic_Dot_Active.svg" alt="">' : ''}</button>
      </div>

      <!-- 탭 콘텐츠 -->
      <div id="home-tab-content">
        ${state.homeTab === 'today' ? renderTodayTab() : renderCalendarTab()}
      </div>
    </div>
    ${renderBottomNav('home')}
  `;
}

/* ── 오늘의 도시락 탭 ── */
function renderTodayTab() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
  const state = Store.getState();
  const name = state.user.name;

  return `
    <!-- 웰컴 배너 -->
    <div class="home-welcome">
      <div class="home-welcome__greeting">
        <p><strong>${name.replace(/님$/, '')}</strong>님,</p>
        <p>오늘도 든든히!</p>
      </div>
      <img
        class="home-welcome__mascot"
        src="images/hello.png"
        alt="마스코트"
        onerror="this.style.fontSize='80px';this.style.textAlign='center';this.outerHTML='<div style=width:172px;text-align:center;font-size:80px>🐹</div>'"
      >
    </div>

    <!-- 도시락 섹션 -->
    <section class="lunchbox-section">
      <div class="lunchbox-section__header">
        <div class="lunchbox-section__title-area">
          <h2 class="lunchbox-section__title">오늘의 도시락</h2>
          <span class="lunchbox-section__date">${dateStr}</span>
        </div>
        <div class="lunchbox-section__indicator">
          <span id="lunchbox-current">${activeLunchboxIndex + 1}</span>
          <span class="total"> / ${LUNCHBOXES.length}</span>
        </div>
      </div>

      <!-- 카드 스크롤 -->
      <div class="lunchbox-scroll" id="lunchbox-scroll" onscroll="updateLunchboxIndicator(this)">
        ${LUNCHBOXES.map(lb => renderLunchboxCard(lb)).join('')}
      </div>
    </section>

    <!-- 내가 직접 만들래요 -->
    <div class="home-direct-btn">
      <button class="home-direct-btn__text" onclick="Router.navigate('fridge')">
        내가 직접 만들래요 !
        <img src="assets/icons/Ic_Arrow_Right.svg" width="6" height="11" alt="" style="vertical-align:middle">
      </button>
    </div>
  `;
}

function renderLunchboxCard(lb) {
  return `
    <div class="lunchbox-card" onclick="Router.navigate('recipe', { id: ${lb.id} })">
      <img
        class="lunchbox-card__img"
        src="${lb.image}"
        alt="${lb.title.join(' ')}"
        onerror="this.parentElement.style.background='#d4a88a'"
      >
      <div class="lunchbox-card__overlay"></div>

      <!-- 제목: Figma mt-31px -->
      <h3 class="lunchbox-card__title">
        ${lb.title[0]}<br>${lb.title[1]}
      </h3>

      <!-- 뱃지: Figma mt-98px -->
      <span class="lunchbox-card__badge">${lb.badge}</span>

      <!-- 설명: Figma mt-285px -->
      <p class="lunchbox-card__desc">${lb.desc}</p>
    </div>
  `;
}

/* 스크롤 위치로 인디케이터 업데이트 */
function updateLunchboxIndicator(el) {
  const cardWidth = 254 + 12; /* card width + gap */
  const index = Math.round(el.scrollLeft / cardWidth);
  activeLunchboxIndex = index;
  const indicator = document.getElementById('lunchbox-current');
  if (indicator) indicator.textContent = index + 1;
}

/* ── 나의 도시락 기록 탭 ── */
function renderCalendarTab() {
  const state = Store.getState();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const totalSaved = state.records.reduce((sum, r) => sum + (r.savedAmount || 0), 0);
  const recordCount = state.records.length;
  const avgSaved = recordCount > 0 ? Math.round(totalSaved / recordCount) : 0;

  return `
    <!-- 절감액 카드 -->
    <div class="saving-card">
      <img class="saving-card__mascot" src="images/만족.png" alt=""
        onerror="this.outerHTML='<span style=font-size:36px>🐹</span>'">
      <div>
        <p class="saving-card__label">이번 달 절감액</p>
        <p class="saving-card__amount">${totalSaved.toLocaleString()}원</p>
        <p class="saving-card__detail">${recordCount}회 × ${avgSaved.toLocaleString()}원</p>
      </div>
    </div>

    <div style="padding: 20px 16px 16px">
      <h2 style="font-size: 22px; font-weight: 700;">${year}년 ${month + 1}월 도시락 기록</h2>
    </div>

    <!-- 캘린더 -->
    <div class="calendar-card">
      <div class="calendar-nav">
        <button class="calendar-nav__btn" onclick="changeCalendarMonth(-1)">‹</button>
        <span class="calendar-nav__title">${year}년 ${month + 1}월</span>
        <button class="calendar-nav__btn" onclick="changeCalendarMonth(1)">›</button>
      </div>
      <p class="calendar-record-count">이번달 기록 ${recordCount}회</p>
      ${renderCalendarGrid(year, month)}
    </div>
  `;
}

/* 캘린더 그리드 */
function renderCalendarGrid(year, month) {
  const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
  const firstDay  = new Date(year, month, 1).getDay();
  const lastDate  = new Date(year, month + 1, 0).getDate();
  const today     = new Date();
  const recordDates = Store.getState().records.map(r => r.date);

  let html = `<div class="calendar-grid">`;

  /* 헤더 */
  html += DAYS.map((d, i) =>
    `<div class="calendar-grid__header ${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}">${d}</div>`
  ).join('');

  /* 빈 셀 */
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="calendar-cell"></div>`;
  }

  /* 날짜 셀 */
  for (let d = 1; d <= lastDate; d++) {
    const date = new Date(year, month, d);
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = date.toDateString() === today.toDateString();
    const dow = date.getDay();
    const hasRecord = recordDates.includes(dateStr);

    html += `
      <div class="calendar-cell ${isToday ? 'today' : ''} ${dow === 0 ? 'sun' : dow === 6 ? 'sat' : ''}">
        <span class="calendar-cell__num">${d}</span>
        ${hasRecord ? `<span class="calendar-cell__dot"></span>` : ''}
      </div>
    `;
  }

  html += `</div>`;
  return html;
}

/* 탭 전환 */
function switchHomeTab(tab) {
  Store.setState(s => ({ homeTab: tab }));
  document.getElementById('home-tab-content').innerHTML =
    tab === 'today' ? renderTodayTab() : renderCalendarTab();

  const dotImg = `<img class="home-top-tab__dot" src="assets/icons/Ic_Dot_Active.svg" alt="">`;
  document.querySelectorAll('.home-top-tab__item').forEach((btn, i) => {
    const isActive = (i === 0 && tab === 'today') || (i === 1 && tab === 'calendar');
    btn.classList.toggle('active', isActive);
    /* 점 업데이트 */
    const existing = btn.querySelector('.home-top-tab__dot');
    if (existing) existing.remove();
    if (isActive) btn.insertAdjacentHTML('beforeend', dotImg);
  });
}

/* 캘린더 월 이동 (단순 re-render) */
function changeCalendarMonth(delta) {
  /* TODO: 월 상태 관리 추가 시 구현 */
  switchHomeTab('calendar');
}
