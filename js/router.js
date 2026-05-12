const Router = {
  routes: {},
  currentPage: null,

  register(path, handler) {
    this.routes[path] = handler;
  },

  navigate(path, params = {}) {
    const handler = this.routes[path];
    if (!handler) return;

    history.pushState({ path, params }, '', `#${path}`);
    this._render(path, params);
  },

  back() {
    history.back();
  },

  _render(path, params = {}) {
    const app = document.getElementById('app');
    const handler = this.routes[path];
    if (!handler) return;

    this.currentPage = path;
    app.innerHTML = handler(params);

    // 페이지 진입 후 초기화 이벤트
    document.dispatchEvent(new CustomEvent('pageRendered', { detail: { path, params } }));
  },

  init() {
    window.addEventListener('popstate', (e) => {
      if (e.state?.path) {
        this._render(e.state.path, e.state.params || {});
      } else {
        this._render('home');
      }
    });

    const hash = location.hash.replace('#', '') || 'home';
    this._render(hash);
  }
};
