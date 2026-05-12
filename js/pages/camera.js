function renderCameraPage() {
  return `
    <main class="camera-page">

      <!-- 상태바 (white on black) -->
      <div class="camera-statusbar" aria-hidden="true">
        <span class="camera-statusbar__time">9:41</span>
        <div class="camera-statusbar__icons">
          <img src="assets/icons/Cellular Connection.svg" width="18" height="12" alt="">
          <img src="assets/icons/Wifi.svg" width="16" height="12" alt="">
          <img src="assets/icons/Vector-1.svg" width="26" height="12" alt="">
        </div>
      </div>

      <!-- 헤더 -->
      <header class="camera-header">
        <button class="camera-header__btn" type="button" aria-label="이전 화면" onclick="Router.back()">
          <img src="assets/icons/back_icon.svg" width="10" height="17" alt="" class="camera-header__back-icon">
        </button>
        <span class="camera-header__title">자동인식</span>
        <button class="camera-header__btn" type="button" aria-label="플래시" onclick="toggleFlash(this)">
          <svg class="camera-flash-icon" width="15" height="21" viewBox="0 0 15 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 0L0 12.5H6.5L5.5 21L15 8.5H8.5L8.5 0Z" fill="white"/>
          </svg>
        </button>
      </header>

      <!-- 카메라 뷰 -->
      <div class="camera-view">
        <!-- 뷰파인더 프레임 (4개 모서리 브라켓) -->
        <div class="camera-frame" id="camera-frame">
          <span class="camera-frame__corner camera-frame__corner--tl"></span>
          <span class="camera-frame__corner camera-frame__corner--tr"></span>
          <span class="camera-frame__corner camera-frame__corner--bl"></span>
          <span class="camera-frame__corner camera-frame__corner--br"></span>

          <p class="camera-guide">
            영수증을 촬영해주세요.<br>
            식재료를 자동으로 스캔합니다.
          </p>
        </div>
      </div>

      <!-- 촬영 버튼 -->
      <div class="camera-bottom">
        <button class="camera-capture-btn" type="button" onclick="capturePhoto()">촬영 하기</button>
      </div>
    </main>
  `;
}

function toggleFlash(btn) {
  btn.classList.toggle('camera-header__btn--flash-on');
  const icon = btn.querySelector('.camera-flash-icon path');
  if (btn.classList.contains('camera-header__btn--flash-on')) {
    icon.setAttribute('fill', '#FF8C66');
  } else {
    icon.setAttribute('fill', 'white');
  }
}

function capturePhoto() {
  Router.navigate('scan');
}

let _scanTimer = null;

/* ── 스캔 화면 ── */
function renderScanPage() {
  return `
    <main class="scan-page">

      <!-- layer 0: 영수증 배경 이미지 -->
      <img class="scan-receipt" src="images/Receipt.PNG" alt="" aria-hidden="true">

      <!-- layer 1: 어두운 마스크 -->
      <div class="scan-mask" aria-hidden="true"></div>

      <!-- layer 2: 상태바 -->
      <div class="camera-statusbar scan-layer" aria-hidden="true">
        <span class="camera-statusbar__time">9:41</span>
        <div class="camera-statusbar__icons">
          <img src="assets/icons/Cellular Connection.svg" width="18" height="12" alt="">
          <img src="assets/icons/Wifi.svg" width="16" height="12" alt="">
          <img src="assets/icons/Vector-1.svg" width="26" height="12" alt="">
        </div>
      </div>

      <!-- layer 2: 헤더 -->
      <header class="camera-header scan-layer">
        <button class="camera-header__btn" type="button" aria-label="이전 화면" onclick="Router.back()">
          <img src="assets/icons/back_icon.svg" width="10" height="17" alt="" class="camera-header__back-icon">
        </button>
        <span class="camera-header__title">자동인식</span>
        <button class="camera-header__btn" type="button" aria-label="플래시">
          <svg width="15" height="21" viewBox="0 0 15 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 0L0 12.5H6.5L5.5 21L15 8.5H8.5L8.5 0Z" fill="white"/>
          </svg>
        </button>
      </header>

      <!-- layer 2: 카메라 프레임 코너 브라켓 -->
      <div class="scan-frame" aria-hidden="true">
        <span class="camera-frame__corner camera-frame__corner--tl"></span>
        <span class="camera-frame__corner camera-frame__corner--tr"></span>
        <span class="camera-frame__corner camera-frame__corner--bl"></span>
        <span class="camera-frame__corner camera-frame__corner--br"></span>
      </div>

      <!-- layer 3: 스캔 라인 애니메이션 -->
      <div class="scan-line-wrap" aria-hidden="true">
        <div class="scan-line"></div>
      </div>

      <!-- layer 2: 안내 텍스트 -->
      <p class="scan-guide-text">식재료를 스캔중입니다.</p>

      <!-- layer 2: 하단 스캔중 버튼 -->
      <div class="scan-bottom-bar">스캔중</div>
    </main>
  `;
}

/* renderScanPage 정의 이후에 이벤트 위임으로 클릭 전환 처리 */
document.addEventListener('pageRendered', ({ detail }) => {
  if (detail.path !== 'scan') return;
  const page = document.querySelector('.scan-page');
  if (!page) return;
  page.addEventListener('click', () => Router.navigate('scan-complete'), { once: true });
});

/* ── 스캔 완료 화면 ── */
const DETECTED_TAGS = [
  { name: '양파',    left: 187, top: 315, width: 54  },
  { name: '대파',    left: 133, top: 337, width: 54  },
  { name: '당근',    left: 132, top: 384, width: 54  },
  { name: '콩나물',  left:  79, top: 456, width: 70  },
  { name: '청양고추', left: 106, top: 505, width: 80  },
  { name: '등심',    left: 160, top: 529, width: 51  },
  { name: '유정란',  left: 118, top: 578, width: 61  },
  { name: '라면',    left: 130, top: 604, width: 56  },
];

function renderScanCompletePage() {
  const tags = DETECTED_TAGS.map(t => `
    <span class="detected-tag" style="left:${t.left}px;top:${t.top}px;width:${t.width}px">${t.name}</span>
  `).join('');

  return `
    <main class="scan-complete-page">

      <!-- layer 0: 영수증 배경 이미지 -->
      <img class="scan-receipt" src="images/Receipt.PNG" alt="" aria-hidden="true">

      <!-- layer 1: 어두운 마스크 -->
      <div class="scan-complete-mask" aria-hidden="true"></div>

      <!-- layer 2: 인식된 식재료 태그 -->
      ${tags}

      <!-- layer 3: 상태바 -->
      <div class="camera-statusbar scan-layer" aria-hidden="true">
        <span class="camera-statusbar__time">9:41</span>
        <div class="camera-statusbar__icons">
          <img src="assets/icons/Cellular Connection.svg" width="18" height="12" alt="">
          <img src="assets/icons/Wifi.svg" width="16" height="12" alt="">
          <img src="assets/icons/Vector-1.svg" width="26" height="12" alt="">
        </div>
      </div>

      <!-- layer 3: 헤더 -->
      <header class="camera-header scan-layer">
        <button class="camera-header__btn" type="button" aria-label="이전 화면" onclick="Router.back()">
          <img src="assets/icons/back_icon.svg" width="10" height="17" alt="" class="camera-header__back-icon">
        </button>
        <span class="camera-header__title">자동인식</span>
        <button class="camera-header__btn" type="button" aria-label="플래시">
          <svg width="15" height="21" viewBox="0 0 15 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 0L0 12.5H6.5L5.5 21L15 8.5H8.5L8.5 0Z" fill="white"/>
          </svg>
        </button>
      </header>

      <!-- layer 3: 카메라 프레임 코너 브라켓 -->
      <div class="scan-frame" aria-hidden="true">
        <span class="camera-frame__corner camera-frame__corner--tl"></span>
        <span class="camera-frame__corner camera-frame__corner--tr"></span>
        <span class="camera-frame__corner camera-frame__corner--bl"></span>
        <span class="camera-frame__corner camera-frame__corner--br"></span>
      </div>

      <!-- 안내 텍스트 -->
      <p class="scan-complete-guide">
        <span class="scan-complete-guide__count">${DETECTED_TAGS.length}개</span> 식재료를 인식했습니다.
      </p>

      <!-- 하단 스캔완료 버튼 -->
      <div class="scan-complete-bottom">
        <button class="scan-complete-btn" type="button" onclick="completeScan()">스캔완료</button>
      </div>
    </main>
  `;
}

function completeScan() {
  openScanResultSheet();
}

/* ── 스캔 결과 바텀시트 ── */
const SCAN_RESULT_DATA = [
  { name: '양파',              icon: 'Img_Wrapper',   expiry: '1개월', qty: 12,  unit: ''  },
  { name: '대파',              icon: 'Img_Wrapper-1', expiry: '1개월', qty: 2,   unit: ''  },
  { name: '당근',              icon: 'Img_Wrapper-2', expiry: '1개월', qty: 4,   unit: ''  },
  { name: '콩나물',            icon: 'Img_Wrapper-3', expiry: '7일',   qty: 200, unit: 'g' },
  { name: '청양고추',          icon: 'Img_Wrapper-4', expiry: '14일',  qty: 5,   unit: ''  },
  { name: '등심',              icon: 'Img_Wrapper-5', expiry: '3일',   qty: 250, unit: 'g' },
  { name: '달걀(유정란)',      icon: 'Img_Wrapper-6', expiry: '1개월', qty: 15,  unit: ''  },
  { name: '라면(오짬)', icon: 'Img_Wrapper-7', expiry: '6개월', qty: 5,   unit: ''  },
];

let _scanItems = [];

function openScanResultSheet() {
  _scanItems = SCAN_RESULT_DATA.map(d => ({ ...d }));
  BottomSheet.open(_buildScanSheet());
}

function _buildScanSheet() {
  return `
    <div class="sr-sheet">
      <p class="sr-sheet__title">발견된 식재료</p>
      <p class="sr-sheet__sub">AI가 <span class="sr-sheet__count">${_scanItems.length}개 항목</span>을 인식했습니다.</p>
      <div class="sr-list" id="sr-list">
        ${_buildScanItems()}
      </div>
      <button class="sr-cta" onclick="saveScanResult()">
        <img src="assets/icons/Frame_page/Plus_icon.svg" width="13" height="13" alt=""> 재료 담기
      </button>
    </div>
  `;
}

function _buildScanItems() {
  return _scanItems.map((item, i) => `
    <div class="sr-item">
      <div class="sr-item__left">
        <img class="sr-item__img" src="assets/icons/Frame_page/${item.icon}.svg" width="60" height="47" alt="${item.name}">
        <div class="sr-item__info">
          <span class="sr-item__name">${item.name}</span>
          <div class="sr-item__expiry">
            <span>유통기한 ${item.expiry}</span>
            <img src="assets/icons/Frame_page/Ic_Edit.svg" width="7" height="9" alt="">
          </div>
        </div>
      </div>
      <div class="sr-item__right">
        <button class="sr-qty-btn" onclick="adjustScanQty(${i},-1)">−</button>
        <span class="sr-qty-val">${item.qty}${item.unit}</span>
        <button class="sr-qty-btn" onclick="adjustScanQty(${i},1)">+</button>
      </div>
    </div>
  `).join('');
}

function adjustScanQty(i, d) {
  const step = _scanItems[i].unit === 'g' ? 50 : 1;
  _scanItems[i].qty = Math.max(step, _scanItems[i].qty + d * step);
  const list = document.getElementById('sr-list');
  if (list) list.innerHTML = _buildScanItems();
}

function saveScanResult() {
  BottomSheet.close();
  Router.navigate('fridge');
}
