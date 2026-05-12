const PLANS = [
  {
    id: 'weekly3',
    name: '주 3회 플랜',
    price: '39,000원/월',
    desc: '한 달에 12번, 영양 가득 도시락',
    hot: true,
    mascot: 'mascot-chef.png',
    emoji: '👨‍🍳',
  },
  {
    id: 'weekly5',
    name: '주 5회 플랜',
    price: '59,000원/월',
    desc: '평일 매일! 최고의 선택',
    hot: false,
    mascot: 'mascot-chef.png',
    emoji: '🍱',
  },
  {
    id: 'daily',
    name: '매일 플랜',
    price: '79,000원/월',
    desc: '하루도 빠짐없이 건강하게',
    hot: false,
    mascot: 'mascot-chef.png',
    emoji: '⭐',
  },
];

let selectedPlanId = null;

function renderSubscriptionPage() {
  return `
    ${renderHeader({ type: 'sub', title: '구독 시작하기' })}
    <div style="padding-bottom: calc(52px + var(--space-32))">
      <div class="subscription-intro">
        <h2>플랜을 선택해주세요!</h2>
        <p>어떤 플랜을 원하시나요?</p>
      </div>

      <div id="plan-list">
        ${PLANS.map(plan => renderPlanCard(plan)).join('')}
      </div>
    </div>

    <div style="position: fixed; bottom: var(--space-16); left: 50%; transform: translateX(-50%); width: 100%; max-width: var(--max-width);">
      <button class="btn ${selectedPlanId ? 'btn-dark' : 'btn-disabled'}" id="plan-next-btn"
        onclick="subscribePlan()">다음</button>
    </div>
  `;
}

function renderPlanCard(plan) {
  const isSelected = selectedPlanId === plan.id;
  return `
    <div class="plan-card ${isSelected ? 'selected' : ''}" onclick="selectPlan('${plan.id}')">
      <span style="font-size: 40px; flex-shrink: 0">${plan.emoji}</span>
      <div class="plan-card__info">
        <p class="plan-card__name">${plan.name}</p>
        <p class="plan-card__price">${plan.price}</p>
        <p class="plan-card__desc">${plan.desc}</p>
      </div>
      ${plan.hot ? `<span class="plan-card__hot-badge">HOT</span>` : ''}
    </div>
  `;
}

function selectPlan(planId) {
  selectedPlanId = selectedPlanId === planId ? null : planId;
  document.getElementById('plan-list').innerHTML = PLANS.map(p => renderPlanCard(p)).join('');

  const btn = document.getElementById('plan-next-btn');
  if (btn) {
    btn.className = `btn ${selectedPlanId ? 'btn-dark' : 'btn-disabled'}`;
  }
}

function subscribePlan() {
  if (!selectedPlanId) return;
  const plan = PLANS.find(p => p.id === selectedPlanId);
  Store.setState(s => ({ user: { ...s.user, subscription: plan.name } }));
  alert(`${plan.name}으로 구독을 시작합니다!`);
  Router.navigate('mypage');
}
