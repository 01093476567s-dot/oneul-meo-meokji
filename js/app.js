// 라우트 등록
Router.register('home',           () => renderHomePage());
Router.register('fridge',         () => renderFridgePage());
Router.register('mypage',         () => renderMypagePage());
Router.register('recipe',         (p) => renderRecipePage(p));
Router.register('add-ingredient', () => renderAddIngredientPage());
Router.register('camera',         () => renderCameraPage());
Router.register('scan',           () => renderScanPage());
Router.register('scan-complete',  () => renderScanCompletePage());
Router.register('subscription',   () => renderSubscriptionPage());
Router.register('direct-input',   () => renderDirectInputPage());

// 페이지 렌더 후 공통 초기화
document.addEventListener('pageRendered', ({ detail }) => {
  initAccordions();

  // 냉장고 이외 페이지로 이동 시 툴팁 상태 유지
  if (detail.path === 'fridge') {
    // fridge.js의 tooltipVisible은 각 렌더 시 renderFridgePage()가 참조
  }
});

// 앱 시작
Router.init();
