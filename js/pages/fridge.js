/* ── 냉장고 페이지 ── */

let tooltipVisible = true;

function renderFridgePage() {
  const state = Store.getState();
  const isEmpty = state.fridge.length === 0;
  const cartCount = state.cart.length;

  return `
    ${renderHeader({ type: 'main', cartCount })}
    <div class="page-content">
      ${isEmpty ? renderFridgeEmpty() : renderFridgeFull(state.fridge)}
    </div>

    <!-- FAB + 툴팁 묶음 -->
    <div class="fab-container">
      ${tooltipVisible ? renderFabTooltip() : ''}
      <button class="fab-btn" onclick="Router.navigate('add-ingredient')" aria-label="재료 추가">
        <img src="assets/icons/Icon.svg" width="19" height="19" alt="+">
      </button>
    </div>

    ${renderBottomNav('fridge')}
  `;
}

/* ── 빈 냉장고 ── */
function renderFridgeEmpty() {
  return `
    <div class="fridge-empty">
      <!-- 말풍선 + 슬픈 햄스터 일러스트 -->
      <div class="fridge-empty__illustration">
        <img
          class="fridge-empty__speech-bubble"
          src="images/말풍선.png"
          alt="말풍선"
          onerror="this.style.display='none'"
        >
        <img
          class="fridge-empty__hamster"
          src="images/텅비어-슬픈-햄스터.png"
          alt="빈 냉장고 햄스터"
          onerror="this.outerHTML='<span style=position:absolute;top:73px;left:13px;font-size:100px>🐹</span>'"
        >
      </div>

      <p class="fridge-empty__title">냉장고가 텅~ 비었어요.</p>
      <p class="fridge-empty__subtitle">엇, 처음이신가요? 처음 식재료를 입력하면 포인트를 드려요.</p>
    </div>
  `;
}

/* ── 툴팁 ── */
function renderFabTooltip() {
  return `
    <div class="fab-tooltip" id="fab-tooltip">
      <div class="fab-tooltip__body">
        <span class="fab-tooltip__text">재료를 추가해서 냉장고를 채워봐요</span>
        <button
          class="fab-tooltip__close"
          onclick="closeTooltip(event)"
          aria-label="툴팁 닫기"
        >
          <img src="assets/icons/Tooltip_CloseIcon.svg" width="11" height="12" alt="닫기">
        </button>
      </div>
      <!-- Tooltip_Arrow.svg: 아래 방향 삼각형 -->
      <div class="fab-tooltip__arrow-wrap">
        <img src="assets/icons/Tooltip_Arrow.svg" width="22" height="16" alt="">
      </div>
    </div>
  `;
}

function closeTooltip(e) {
  e.stopPropagation();
  tooltipVisible = false;
  const el = document.getElementById('fab-tooltip');
  if (el) el.remove();
}

/* ── 재료 있는 냉장고 ── */
function renderFridgeFull(ingredients) {
  const expiring = Store.getExpiringIngredients();

  return `
    ${expiring.length > 0 ? renderExpiryBanner(expiring) : ''}
    ${renderFridgeMascotArea()}
    ${renderCategoryTabs()}
    <p class="fridge-expiry-guide">
      ⓘ&nbsp;
      <span style="color:var(--status-danger)">■</span> 1일 이하&emsp;
      <span style="color:var(--status-warning)">■</span> 2~7일&emsp;
      <span style="color:var(--status-safe)">■</span> 넉넉해요
    </p>
    ${renderIngredientGrid(ingredients)}
  `;
}

/* 유통기한 경고 배너 */
function renderExpiryBanner(expiring) {
  return `
    <div class="expiry-banner" id="expiry-banner">
      <div class="expiry-banner__header" onclick="toggleExpiryBanner()">
        <span>⚠ 유통기한이 얼마 남지 않은 식재료가 있어요!</span>
        <button class="expiry-banner__toggle">∨</button>
      </div>
      <div class="expiry-banner__grid">
        ${expiring.slice(0, 5).map(item => `
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
            <span style="font-size:32px">${item.emoji || '🥬'}</span>
            <span style="font-size:11px;text-align:center">${item.name}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function toggleExpiryBanner() {
  const banner = document.getElementById('expiry-banner');
  if (banner) banner.classList.toggle('expiry-banner--open');
}

/* 냉장고 관리 마스코트 */
function renderFridgeMascotArea() {
  return `
    <div class="fridge-mascot-area">
      <img
        class="fridge-mascot-area__img"
        src="images/재료관리.png"
        alt="마스코트"
        onerror="this.outerHTML='<span style=font-size:100px>🐹</span>'"
      >
    </div>
  `;
}

/* 카테고리 탭 */
const FRIDGE_CATEGORIES = ['전체', '채소', '과일', '육류', '해산물', '유제품', '곡류', '기타'];
let activeFridgeCategory = '전체';

function renderCategoryTabs() {
  return `
    <div class="fridge-category-tabs">
      ${FRIDGE_CATEGORIES.map(cat => `
        <button
          class="tag ${activeFridgeCategory === cat ? 'tag--active' : ''}"
          onclick="filterFridgeCategory(this, '${cat}')"
        >${cat}</button>
      `).join('')}
    </div>
  `;
}

function filterFridgeCategory(btn, category) {
  activeFridgeCategory = category;
  document.querySelectorAll('.fridge-category-tabs .tag')
    .forEach(t => t.classList.remove('tag--active'));
  btn.classList.add('tag--active');

  const state = Store.getState();
  const filtered = category === '전체'
    ? state.fridge
    : state.fridge.filter(i => i.category === category);

  const grid = document.querySelector('.ingredient-grid');
  if (grid) grid.outerHTML = renderIngredientGrid(filtered);
}

/* 식재료 그리드 */
function renderIngredientGrid(ingredients) {
  const badgeClass = (item) => {
    const today = new Date();
    const expiry = new Date(item.expiryDate);
    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    if (diff <= 1)  return 'qty-badge--danger';
    if (diff <= 7)  return 'qty-badge--warning';
    return 'qty-badge--safe';
  };

  return `
    <div class="ingredient-grid">
      ${ingredients.map(item => `
        <div class="ingredient-cell" onclick="showIngredientDetail(${item.id})">
          <span class="qty-badge ${badgeClass(item)}">${item.quantity}</span>
          <span style="font-size:40px;line-height:56px">${item.emoji || '🥬'}</span>
          <span class="ingredient-cell__name">${item.name}</span>
        </div>
      `).join('')}
      <div class="ingredient-cell--add">
        <div class="ingredient-cell--add__box" onclick="Router.navigate('add-ingredient')">+</div>
        <span class="ingredient-cell__name">추가</span>
      </div>
    </div>
  `;
}

/* 재료 상세 (바텀시트) */
function showIngredientDetail(id) {
  const item = Store.getState().fridge.find(i => i.id === id);
  if (!item) return;

  BottomSheet.open(`
    <div style="padding: 0 16px 32px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
        <span style="font-size:48px">${item.emoji || '🥬'}</span>
        <div>
          <p style="font-size:18px;font-weight:700">${item.name}</p>
          <p style="font-size:13px;color:var(--text-sub)">유통기한: ${item.expiryDate || '미입력'}</p>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
        <p style="font-size:14px;font-weight:600">수량</p>
        <div class="quantity-control">
          <button class="quantity-btn" onclick="updateIngredientQty(${item.id}, ${item.quantity - 1})">−</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateIngredientQty(${item.id}, ${item.quantity + 1})">+</button>
        </div>
      </div>
      <button
        style="width:100%;height:48px;background:var(--status-danger);color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer"
        onclick="deleteIngredient(${item.id})"
      >삭제</button>
    </div>
  `);
}

function updateIngredientQty(id, qty) {
  Store.updateIngredientQty(id, qty);
  BottomSheet.close();
  setTimeout(() => Router.navigate('fridge'), 200);
}

function deleteIngredient(id) {
  Store.setState(s => ({ fridge: s.fridge.filter(i => i.id !== id) }));
  BottomSheet.close();
  setTimeout(() => Router.navigate('fridge'), 200);
}
