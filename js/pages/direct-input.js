/* ── 직접입력 페이지 ── */

const DI_CATEGORIES = [
  { id: 'all',      label: '전체' },
  { id: 'veg',      label: '야채/채소' },
  { id: 'dairy',    label: '유제품' },
  { id: 'meat',     label: '육류' },
  { id: 'seafood',  label: '수산물' },
  { id: 'fruit',    label: '과일' },
  { id: 'seasoning', label: '조미료' },
  { id: 'ambient',  label: '상온식품' },
];

const DI_ITEMS = [
  { name: '상추',       icon: '상추',       category: 'veg', expiry: '1개월'  },
  { name: '깻잎',       icon: '깻잎',       category: 'veg', expiry: '2개월'  },
  { name: '양배추',     icon: '양배추',     category: 'veg', expiry: '1개월'  },
  { name: '시금치',     icon: '시금치',     category: 'veg', expiry: '1개월'  },
  { name: '청경채',     icon: '청경채',     category: 'veg', expiry: '1개월'  },
  { name: '케일',       icon: '케일',       category: 'veg', expiry: '1개월'  },
  { name: '감자',       icon: '감자',       category: 'veg', expiry: '2개월'  },
  { name: '고구마',     icon: '고구마',     category: 'veg', expiry: '2개월'  },
  { name: '당근',       icon: '당근',       category: 'veg', expiry: '1개월'  },
  { name: '무',         icon: '무',         category: 'veg', expiry: '1개월'  },
  { name: '양파',       icon: '양파',       category: 'veg', expiry: '2개월'  },
  { name: '마늘',       icon: '마늘',       category: 'veg', expiry: '3개월'  },
  { name: '생강',       icon: '생강',       category: 'veg', expiry: '2개월'  },
  { name: '연근',       icon: '연근',       category: 'veg', expiry: '1개월'  },
  { name: '오이',       icon: '오이',       category: 'veg', expiry: '1주일'  },
  { name: '가지',       icon: '가지',       category: 'veg', expiry: '1개월'  },
  { name: '호박',       icon: '호박',       category: 'veg', expiry: '1개월'  },
  { name: '브로콜리',   icon: '브로콜리',   category: 'veg', expiry: '1주일'  },
  { name: '피망',       icon: '피망',       category: 'veg', expiry: '1개월'  },
  { name: '파프리카',   icon: '파프리카',   category: 'veg', expiry: '1개월'  },
  { name: '아스파라거스', icon: '아스파라거스', category: 'veg', expiry: '1주일' },
  { name: '토마토',     icon: '토마토',     category: 'veg', expiry: '1개월'  },
  { name: '옥수수',     icon: '옥수수',     category: 'veg', expiry: '1개월'  },
  { name: '콩나물',     icon: '콩나물',     category: 'veg', expiry: '3일'    },
  { name: '숙주',       icon: '숙주',       category: 'veg', expiry: '3일'    },
  { name: '표고버섯',   icon: '표고버섯',   category: 'veg', expiry: '1주일'  },
  { name: '팽이버섯',   icon: '팽이버섯',   category: 'veg', expiry: '1주일'  },
  { name: '새송이버섯', icon: '새송이버섯', category: 'veg', expiry: '2주일'  },
  { name: '양송이버섯', icon: '양송이버섯', category: 'veg', expiry: '1주일'  },
];

let diSelectedItems = [];
let diSearchQuery    = '';
let diActiveCat      = 'veg';
let diManualOpen     = false;
let diSelectedOpen   = false;

function renderDirectInputPage() {
  return `
    <!-- 상태바 -->
    <div class="di-statusbar" aria-hidden="true">
      <span class="di-statusbar__time">9:41</span>
      <div class="di-statusbar__icons">
        <img src="assets/icons/Cellular Connection.svg" width="18" height="12" alt="">
        <img src="assets/icons/Wifi.svg" width="16" height="12" alt="">
        <img src="assets/icons/Vector-1.svg" width="26" height="12" alt="">
      </div>
    </div>

    <!-- 헤더 -->
    <header class="di-header">
      <button class="di-header__btn" onclick="Router.back()">
        <img src="assets/icons/back_icon.svg" width="10" height="17" alt="뒤로">
      </button>
      <span class="di-header__title">직접입력</span>
      <button class="di-header__btn" onclick="Router.navigate('home')">
        <img src="assets/icons/home_top_icon.svg" width="27" height="24" alt="홈">
      </button>
    </header>

    <div class="di-content">

      <!-- 검색바 -->
      <div class="di-search">
        <img src="assets/icons/Add_Ingredient_page/Ic_Search.svg" width="19" height="19" alt="">
        <input
          class="di-search__input"
          type="text"
          placeholder="찾고싶은 식재료가 있나요?"
          oninput="diOnSearch(this.value)"
        >
      </div>

      <!-- 카테고리 탭 -->
      <div class="di-category-wrap">
        <div class="di-category-list" id="di-cat-list">
          ${_diRenderCats()}
        </div>
        <div class="di-category-divider"></div>
      </div>

      <!-- 식재료 그리드 -->
      <div class="di-grid" id="di-grid">
        ${_diRenderGrid()}
      </div>

      <!-- 직접입력 아코디언 -->
      <div class="di-section" id="di-manual-section">
        <div class="di-section__header" onclick="diToggleManual()">
          <div class="di-section__text">
            <p class="di-section__title">직접입력</p>
            <p class="di-section__subtitle">원하는 식재료를 직접 입력할 수 있어요.</p>
          </div>
          <img src="assets/icons/btn_open.svg" width="17" height="10" alt=""
            class="di-section__chevron ${diManualOpen ? 'di-section__chevron--open' : ''}">
        </div>
        <div class="di-section__body" id="di-manual-body" ${diManualOpen ? '' : 'style="display:none"'}>
          <div class="di-manual-form">
            <input id="di-manual-name"   class="di-input-field" placeholder="식재료 이름" type="text">
            <input id="di-manual-expiry" class="di-input-field" type="date">
            <div class="di-manual-row">
              <input id="di-manual-qty" class="di-input-field di-input-field--small"
                type="number" placeholder="수량" min="1" value="1">
              <button class="di-manual-add-btn" onclick="diAddManual()">추가</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 선택된 재료 아코디언 -->
      <div class="di-section" id="di-selected-section">
        <div class="di-section__header" onclick="diToggleSelected()">
          <div class="di-section__text">
            <p class="di-section__title" id="di-sel-title">
              선택된 재료${diSelectedItems.length > 0 ? ` <span class="di-section__count">${diSelectedItems.length}</span>` : ''}
            </p>
            <p class="di-section__subtitle">자주 쓰는 재료는 즐겨찾기 추가가 가능해요!</p>
          </div>
          <img src="assets/icons/btn_open.svg" width="17" height="10" alt=""
            class="di-section__chevron ${diSelectedOpen ? 'di-section__chevron--open' : ''}">
        </div>
        <div class="di-section__body" id="di-selected-body" ${diSelectedOpen ? '' : 'style="display:none"'}>
          ${_diRenderSelectedItems()}
        </div>
      </div>

    </div>

    <!-- 하단 CTA -->
    <div class="di-cta">
      <button class="di-cta__btn" onclick="diSaveItems()">재료 담기</button>
    </div>
  `;
}

/* ── 카테고리 탭 렌더 ── */
function _diRenderCats() {
  return DI_CATEGORIES.map(cat => `
    <button
      class="di-cat-chip ${cat.id === diActiveCat ? 'di-cat-chip--active' : ''}"
      onclick="diSetCategory('${cat.id}')"
    >${cat.label}</button>
  `).join('');
}

/* ── 그리드 렌더 ── */
function _diRenderGrid() {
  let items = DI_ITEMS;

  if (diActiveCat !== 'all') {
    items = items.filter(i => i.category === diActiveCat);
  }
  if (diSearchQuery) {
    items = items.filter(i => i.name.includes(diSearchQuery));
  }

  if (items.length === 0) {
    return `<p class="di-grid__empty">검색 결과가 없어요.</p>`;
  }

  return items.map(item => {
    const sel = diSelectedItems.some(s => s.name === item.name);
    return `
      <div
        class="di-card ${sel ? 'di-card--active' : ''}"
        onclick="diToggleItem('${item.name}','${item.icon}','${item.category}','${item.expiry}')"
      >
        <img class="di-card__img"
          src="assets/icons/Add_Ingredient_page/${item.icon}.svg"
          alt="${item.name}"
          onerror="this.style.opacity='0.3'">
        <span class="di-card__name">${item.name}</span>
      </div>
    `;
  }).join('');
}

/* ── 선택된 재료 렌더 ── */
function _diRenderSelectedItems() {
  if (diSelectedItems.length === 0) {
    return `<p class="di-section__empty">아직 담은 재료가 없어요</p>`;
  }
  return diSelectedItems.map((item, i) => `
    <div class="di-sel-item">
      ${item.icon
        ? `<img class="di-sel-item__img" src="assets/icons/Add_Ingredient_page/${item.icon}.svg" alt="${item.name}">`
        : `<span class="di-sel-item__emoji">🥬</span>`}
      <div class="di-sel-item__info">
        <span class="di-sel-item__name">${item.name}</span>
        <div class="di-sel-item__expiry">
          <span>유통기한 ${item.expiry || '미설정'}</span>
          <img src="assets/icons/Frame_page/Ic_Edit.svg" width="7" height="9" alt="">
        </div>
      </div>
      <div class="di-sel-item__qty">
        <button class="di-sel-qty-btn" onclick="diAdjustQty(${i},-1)">−</button>
        <span class="di-sel-qty-val">${item.qty}</span>
        <button class="di-sel-qty-btn" onclick="diAdjustQty(${i},1)">+</button>
      </div>
      <button class="di-sel-star" onclick="diToggleStar(${i})">
        ${item.starred ? '★' : '☆'}
      </button>
    </div>
  `).join('');
}

function _diRefreshSelected() {
  const title = document.getElementById('di-sel-title');
  if (title) {
    title.innerHTML = `선택된 재료${diSelectedItems.length > 0
      ? ` <span class="di-section__count">${diSelectedItems.length}</span>` : ''}`;
  }
  const body = document.getElementById('di-selected-body');
  if (body) body.innerHTML = _diRenderSelectedItems();
}

/* ── 이벤트 핸들러 ── */
function diOnSearch(val) {
  diSearchQuery = val;
  const grid = document.getElementById('di-grid');
  if (grid) grid.innerHTML = _diRenderGrid();
}

function diSetCategory(catId) {
  diActiveCat = catId;
  const list = document.getElementById('di-cat-list');
  if (list) list.innerHTML = _diRenderCats();
  const grid = document.getElementById('di-grid');
  if (grid) grid.innerHTML = _diRenderGrid();
}

function diToggleItem(name, icon, category, expiry) {
  const idx = diSelectedItems.findIndex(s => s.name === name);
  if (idx >= 0) {
    diSelectedItems.splice(idx, 1);
  } else {
    diSelectedItems.push({ name, icon, category, expiry, qty: 1, starred: false });
    if (!diSelectedOpen) {
      diSelectedOpen = true;
      const body    = document.getElementById('di-selected-body');
      const chevron = document.querySelector('#di-selected-section .di-section__chevron');
      if (body)    body.style.display = '';
      if (chevron) chevron.classList.add('di-section__chevron--open');
    }
  }
  const grid = document.getElementById('di-grid');
  if (grid) grid.innerHTML = _diRenderGrid();
  _diRefreshSelected();
}

function diToggleManual() {
  diManualOpen = !diManualOpen;
  const body    = document.getElementById('di-manual-body');
  const chevron = document.querySelector('#di-manual-section .di-section__chevron');
  if (body)    body.style.display = diManualOpen ? '' : 'none';
  if (chevron) chevron.classList.toggle('di-section__chevron--open', diManualOpen);
}

function diToggleSelected() {
  diSelectedOpen = !diSelectedOpen;
  const body    = document.getElementById('di-selected-body');
  const chevron = document.querySelector('#di-selected-section .di-section__chevron');
  if (body)    body.style.display = diSelectedOpen ? '' : 'none';
  if (chevron) chevron.classList.toggle('di-section__chevron--open', diSelectedOpen);
}

function diAdjustQty(i, d) {
  diSelectedItems[i].qty = Math.max(1, diSelectedItems[i].qty + d);
  _diRefreshSelected();
}

function diToggleStar(i) {
  diSelectedItems[i].starred = !diSelectedItems[i].starred;
  _diRefreshSelected();
}

function diAddManual() {
  const name   = document.getElementById('di-manual-name')?.value?.trim();
  const expiry = document.getElementById('di-manual-expiry')?.value || '미설정';
  const qty    = parseInt(document.getElementById('di-manual-qty')?.value) || 1;
  if (!name) { alert('식재료 이름을 입력해주세요'); return; }

  const existing = diSelectedItems.find(i => i.name === name);
  if (existing) {
    existing.qty += qty;
  } else {
    diSelectedItems.push({ name, icon: '', category: '기타', expiry, qty, starred: false });
  }

  document.getElementById('di-manual-name').value   = '';
  document.getElementById('di-manual-expiry').value = '';
  document.getElementById('di-manual-qty').value    = '1';

  if (!diSelectedOpen) {
    diSelectedOpen = true;
    const body    = document.getElementById('di-selected-body');
    const chevron = document.querySelector('#di-selected-section .di-section__chevron');
    if (body)    body.style.display = '';
    if (chevron) chevron.classList.add('di-section__chevron--open');
  }
  _diRefreshSelected();
}

function diSaveItems() {
  if (diSelectedItems.length === 0) { alert('재료를 먼저 선택해주세요'); return; }
  diSelectedItems.forEach(item => Store.addIngredient({
    name:       item.name,
    emoji:      '🥬',
    category:   item.category,
    quantity:   item.qty,
    expiryDate: item.expiry || '',
  }));
  diSelectedItems = [];
  diSearchQuery   = '';
  diActiveCat     = 'veg';
  diManualOpen    = false;
  diSelectedOpen  = false;
  Router.navigate('fridge');
}
