const Store = {
  _state: {
    user: {
      name: '가나다님',   /* Figma 디자인 기준 — 실제 이름으로 교체 가능 */
      points: 340,
      subscription: null,
    },
    fridge: [],       // { id, name, icon, category, quantity, expiryDate }
    cart: [],         // { recipeId, name }
    records: [],      // { date, recipeId, name, savedAmount }
    activeTab: 'home', // 'home' | 'fridge' | 'mypage'
    homeTab: 'today',  // 'today' | 'calendar'
  },
  _listeners: [],

  getState() {
    return this._state;
  },

  setState(updater) {
    const prev = this._state;
    this._state = { ...prev, ...updater(prev) };
    this._listeners.forEach(fn => fn(this._state));
  },

  subscribe(fn) {
    this._listeners.push(fn);
    return () => {
      this._listeners = this._listeners.filter(l => l !== fn);
    };
  },

  // 냉장고 재료 추가
  addIngredient(ingredient) {
    this.setState(s => ({
      fridge: [...s.fridge, { id: Date.now(), ...ingredient }]
    }));
  },

  // 냉장고 재료 수량 변경
  updateIngredientQty(id, qty) {
    this.setState(s => ({
      fridge: s.fridge.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, qty) } : item
      ).filter(item => item.quantity > 0)
    }));
  },

  // 유통기한 임박 재료 (2일 이하)
  getExpiringIngredients() {
    const today = new Date();
    return this._state.fridge.filter(item => {
      const expiry = new Date(item.expiryDate);
      const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
      return diff <= 2;
    });
  },
};
