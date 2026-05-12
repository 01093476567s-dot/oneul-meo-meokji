/* ── 식재료 추가 페이지 ── */

const INGREDIENT_ICONS = [
  { name: '당근',    emoji: '🥕', category: '채소' },
  { name: '양파',    emoji: '🧅', category: '채소' },
  { name: '감자',    emoji: '🥔', category: '채소' },
  { name: '시금치',  emoji: '🥬', category: '채소' },
  { name: '브로콜리', emoji: '🥦', category: '채소' },
  { name: '토마토',  emoji: '🍅', category: '채소' },
  { name: '사과',    emoji: '🍎', category: '과일' },
  { name: '바나나',  emoji: '🍌', category: '과일' },
  { name: '달걀',    emoji: '🥚', category: '유제품' },
  { name: '우유',    emoji: '🥛', category: '유제품' },
  { name: '소고기',  emoji: '🥩', category: '육류' },
  { name: '닭고기',  emoji: '🍗', category: '육류' },
];

let selectedIngredients = [];
let favoritesOpen = false;
let cartSectionOpen = false;

function renderAddIngredientPage() {
  return `
    <!-- 상태바 -->
    <div class="add-ing-statusbar" aria-hidden="true">
      <span class="add-ing-statusbar__time">9:41</span>
      <div class="add-ing-statusbar__icons">
        <img src="assets/icons/Cellular Connection.svg" width="18" height="12" alt="">
        <img src="assets/icons/Wifi.svg" width="16" height="12" alt="">
        <img src="assets/icons/Vector-1.svg" width="26" height="12" alt="">
      </div>
    </div>

    <!-- 흰색 서브 헤더 -->
    <header class="add-ing-header">
      <button class="add-ing-header__btn" onclick="Router.back()">
        <!-- back_icon.svg 실제 크기: 10×17, fill #2A2018 -->
        <img src="assets/icons/back_icon.svg" width="10" height="17" alt="뒤로">
      </button>
      <span class="add-ing-header__title">식재료 추가</span>
      <button class="add-ing-header__btn" onclick="Router.navigate('home')">
        <!-- home_top_icon.svg 실제 크기: 27×24, fill #2A2018 -->
        <img src="assets/icons/home_top_icon.svg" width="27" height="24" alt="홈">
      </button>
    </header>

    <div class="add-ing-content">
      <!-- 입력 방법 선택 -->
      <div class="add-method-section">
        <button class="add-method-card" onclick="openCameraInput()">
          <!-- camera_icon.svg fill=white → 오렌지 원형 배경 위에 표시 -->
          <div class="add-method-card__icon-wrap">
            <img src="assets/icons/camera_icon.svg" width="52" height="35" alt="카메라"
              onerror="this.outerHTML='<span style=font-size:36px>📷</span>'">
          </div>
          <span class="add-method-card__title">사진촬영</span>
          <span class="add-method-card__subtitle">AI가 자동인식 해줘요!</span>
        </button>
        <button class="add-method-card" onclick="openManualInput()">
          <div class="add-method-card__icon-wrap add-method-card__icon-wrap--manual">
            <img src="assets/icons/pen_icon.svg" width="47" height="48" alt="직접입력"
              onerror="this.outerHTML='<span style=font-size:36px>✏️</span>'">
          </div>
          <span class="add-method-card__title">직접입력</span>
          <span class="add-method-card__subtitle">직접 입력할래요!</span>
        </button>
      </div>

      <!-- 즐겨찾기 재료 -->
      <div class="add-section" id="favorites-section">
        <div class="add-section__header" onclick="toggleFavorites()">
          <div class="add-section__text">
            <p class="add-section__title">즐겨찾기 재료</p>
            <p class="add-section__subtitle">옆으로 밀어서 목록에서 제거하기</p>
          </div>
          <img
            src="assets/icons/btn_open.svg"
            width="17" height="10" alt=""
            class="add-section__chevron ${favoritesOpen ? 'add-section__chevron--open' : ''}"
            onerror="this.outerHTML='<span class=add-section__chevron-fallback>›</span>'"
          >
        </div>
        <div class="add-section__body" id="favorites-body" ${favoritesOpen ? '' : 'style="display:none"'}>
          <div class="add-favorites-grid">
            ${INGREDIENT_ICONS.map(ing => `
              <div class="add-fav-item" onclick="addFavoriteToCart('${ing.name}','${ing.emoji}','${ing.category}')">
                <span class="add-fav-item__emoji">${ing.emoji}</span>
                <span class="add-fav-item__name">${ing.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- 담은 재료 -->
      <div class="add-section" id="cart-section">
        <div class="add-section__header" onclick="toggleCartSection()">
          <div class="add-section__text">
            <p class="add-section__title">담은 재료</p>
            <p class="add-section__subtitle">담은 재료를 확인해주세요! ⓘ</p>
          </div>
          <img
            src="assets/icons/btn_open.svg"
            width="17" height="10" alt=""
            class="add-section__chevron ${cartSectionOpen ? 'add-section__chevron--open' : ''}"
            onerror="this.outerHTML='<span class=add-section__chevron-fallback>›</span>'"
          >
        </div>
        <div class="add-section__body" id="cart-section-body" ${cartSectionOpen ? '' : 'style="display:none"'}>
          ${renderCartItems()}
        </div>
      </div>
    </div>

    <!-- 하단 CTA -->
    <div class="add-cta">
      <button class="add-cta__btn" onclick="saveIngredients()">
        마이냉장고에 추가하기 <span class="add-cta__point">(+10P)</span>
      </button>
    </div>
  `;
}

/* ── 담은 재료 목록 렌더 ── */
function renderCartItems() {
  if (selectedIngredients.length === 0) {
    return `<p class="add-section__empty">아직 담은 재료가 없어요</p>`;
  }
  return selectedIngredients.map((item, i) => `
    <div class="add-cart-item">
      <span class="add-cart-item__emoji">${item.emoji}</span>
      <span class="add-cart-item__name">${item.name}</span>
      <div class="quantity-control">
        <button class="quantity-btn" onclick="adjustCartQty(${i}, -1)">−</button>
        <span class="quantity-value">${item.quantity}</span>
        <button class="quantity-btn" onclick="adjustCartQty(${i}, 1)">+</button>
      </div>
      <button class="add-cart-item__remove" onclick="removeCartItem(${i})">✕</button>
    </div>
  `).join('');
}

/* ── 아코디언 토글 ── */
function toggleFavorites() {
  favoritesOpen = !favoritesOpen;
  const body    = document.getElementById('favorites-body');
  const chevron = document.querySelector('#favorites-section .add-section__chevron');
  if (body)    body.style.display = favoritesOpen ? '' : 'none';
  if (chevron) chevron.classList.toggle('add-section__chevron--open', favoritesOpen);
}

function toggleCartSection() {
  cartSectionOpen = !cartSectionOpen;
  const body    = document.getElementById('cart-section-body');
  const chevron = document.querySelector('#cart-section .add-section__chevron');
  if (body)    body.style.display = cartSectionOpen ? '' : 'none';
  if (chevron) chevron.classList.toggle('add-section__chevron--open', cartSectionOpen);
}

/* ── 즐겨찾기에서 담기 ── */
function addFavoriteToCart(name, emoji, category) {
  const existing = selectedIngredients.find(i => i.name === name);
  if (existing) {
    existing.quantity++;
  } else {
    selectedIngredients.push({ name, emoji, category, quantity: 1, expiryDate: '' });
  }

  /* 담은 재료 섹션 열기 */
  if (!cartSectionOpen) {
    cartSectionOpen = true;
    const body    = document.getElementById('cart-section-body');
    const chevron = document.querySelector('#cart-section .add-section__chevron');
    if (body)    body.style.display = '';
    if (chevron) chevron.classList.add('add-section__chevron--open');
  }

  const cartBody = document.getElementById('cart-section-body');
  if (cartBody) cartBody.innerHTML = renderCartItems();
}

function adjustCartQty(index, delta) {
  selectedIngredients[index].quantity = Math.max(1, selectedIngredients[index].quantity + delta);
  const cartBody = document.getElementById('cart-section-body');
  if (cartBody) cartBody.innerHTML = renderCartItems();
}

function removeCartItem(index) {
  selectedIngredients.splice(index, 1);
  const cartBody = document.getElementById('cart-section-body');
  if (cartBody) cartBody.innerHTML = renderCartItems();
}

/* ── 사진 촬영 → 자동인식 화면으로 이동 ── */
function openCameraInput() {
  Router.navigate('camera');
}

/* ── 직접 입력 바텀시트 ── */
function openManualInput() {
  BottomSheet.open(`
    <div style="padding: 0 16px 40px">
      <p style="font-size: 18px; font-weight: 700; color: var(--text-main); margin-bottom: 20px">직접 입력</p>
      <div style="display: flex; flex-direction: column; gap: 12px">
        <select id="manual-category"
          style="width:100%;padding:12px 16px;border:1px solid var(--gray-200);border-radius:8px;font-size:14px;font-family:var(--font-family);color:var(--text-main);background:#fff">
          <option value="">카테고리 선택</option>
          <option>채소</option><option>과일</option><option>육류</option>
          <option>해산물</option><option>유제품</option><option>곡류</option><option>기타</option>
        </select>
        <input id="manual-name" class="input-field" placeholder="식재료 이름">
        <input id="manual-expiry" type="date" class="input-field">
        <input id="manual-qty" type="number" class="input-field" placeholder="수량" min="1" value="1">
        <button
          style="width:100%;height:52px;background:var(--primary);color:#fff;border:none;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;font-family:var(--font-family)"
          onclick="submitManualIngredient()"
        >추가하기</button>
      </div>
    </div>
  `);
}

function submitManualIngredient() {
  const name       = document.getElementById('manual-name')?.value?.trim();
  const category   = document.getElementById('manual-category')?.value || '기타';
  const expiryDate = document.getElementById('manual-expiry')?.value || '';
  const quantity   = parseInt(document.getElementById('manual-qty')?.value) || 1;

  if (!name) { alert('식재료 이름을 입력해주세요'); return; }

  const existing = selectedIngredients.find(i => i.name === name);
  if (existing) {
    existing.quantity += quantity;
  } else {
    selectedIngredients.push({ name, emoji: '🥬', category, quantity, expiryDate });
  }

  BottomSheet.close();

  /* 담은 재료 섹션 열기 + 업데이트 */
  cartSectionOpen = true;
  const body    = document.getElementById('cart-section-body');
  const chevron = document.querySelector('#cart-section .add-section__chevron');
  if (body)    { body.style.display = ''; body.innerHTML = renderCartItems(); }
  if (chevron) chevron.classList.add('add-section__chevron--open');
}

/* ── 냉장고에 저장 ── */
function saveIngredients() {
  if (selectedIngredients.length === 0) { alert('재료를 먼저 담아주세요'); return; }
  selectedIngredients.forEach(ing => Store.addIngredient(ing));
  selectedIngredients  = [];
  favoritesOpen        = false;
  cartSectionOpen      = false;
  Router.navigate('fridge');
}
