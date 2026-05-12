const RECIPE_DETAIL = {
  id: 1,
  title: '영양만점\n소불고기\n도시락레시피',
  name: '소불고기',
  badge: '메인요리',
  image: 'images/소불고기.jpg',
  mascot: 'images/Img_Cooking_Hamster.png',
  kcal: 485,
  score: 98,
  nutrition: [
    { label: '순탄수', amount: '56.5g', percent: 30, color: '#382719' },
    { label: '단백질', amount: '64g', percent: 34, color: '#ff876d' },
    { label: '지방', amount: '28.9g', percent: 35, color: '#394c7c' },
  ],
  ingredients: [
    { name: '소고기 150g', icon: 'assets/icons/Recipe_page/Img_Item.svg' },
    { name: '양파 1/4개', icon: 'assets/icons/Recipe_page/Img_Item-1.svg' },
    { name: '대파 조금', icon: 'assets/icons/Recipe_page/Img_Item-2.svg' },
    { name: '감자 반개', icon: 'assets/icons/Recipe_page/Img_Item-3.svg' },
    { name: '된장 조금', icon: 'assets/icons/Recipe_page/Img_Item-4.svg' },
  ],
  steps: [
    {
      title: '재료 준비',
      desc: '재료 : 소불고기 150g , 양파 1/4개, 대파 조금\n양념 : 간장 2큰술, 설탕1/2큰술, 다진마늘 1/2큰술,\n참기름 1/2큰술, 물1.5큰술 후추소금 조금',
    },
    {
      title: '재료 손질',
      desc: '양파 채썰고 대파는 어슷 썰기로 준비해줍니다.\n고기는 뭉친거 풀어줍니다',
    },
    {
      title: '양념에 재우기',
      desc: '고기와 양파 채소를 전부 넣고 섞어줍니다.\n10 ~ 15분 양념에 재료를 재워줍니다.',
    },
    {
      title: '볶기 (5~6분)',
      desc: '고기와 양념 채소를 전부 넣고 섞어줍니다.\n10 ~ 15분 양념에 재료를 재워줍니다.',
    },
    {
      title: '마무리',
      desc: '국물 자작해지면 불을 끄고 부족한간은 간장을 조금 추가\n해서 맞춰주세요. 마지막에 참기름 살짝 추가 해주면\n더 맛있답니다.',
    },
  ],
};

function renderRecipePage() {
  const recipe = RECIPE_DETAIL;

  return `
    <main class="recipe-page">
      <section class="recipe-hero" aria-label="${recipe.name} 레시피">
        <img class="recipe-hero__image" src="${recipe.image}" alt="${recipe.name}">
        <div class="recipe-status" aria-hidden="true">
          <span>9:41</span>
          <span class="recipe-status__icons">▴ ))) ▰</span>
        </div>
        <button class="recipe-hero__back" type="button" aria-label="이전 화면" onclick="Router.back()">
          <img src="assets/icons/back_icon.svg" alt="" width="10" height="18">
        </button>
        <div class="recipe-hero__shade"></div>
        <h1 class="recipe-hero__title">${recipe.title.replace(/\n/g, '<br>')}</h1>
      </section>

      <section class="nutrition-card">
        <div class="recipe-section-head">
          <div>
            <h2>도시락 영양 점수</h2>
            <p>칼로리와 영양표를 확인해봐요</p>
          </div>
          <button type="button">자세히 보기 <span>›</span></button>
        </div>

        <div class="nutrition-bars" aria-label="영양 비율">
          ${recipe.nutrition.map(item => `
            <div class="nutrition-bars__item" style="--bar-color:${item.color}; --bar-width:${item.percent}%;">
              <strong>${item.percent}%</strong>
            </div>
          `).join('')}
        </div>

        <div class="nutrition-legend">
          ${recipe.nutrition.map(item => `
            <span><i style="background:${item.color}"></i>${item.label} ${item.amount}</span>
          `).join('')}
          <span><i></i>총${recipe.kcal}kcal</span>
        </div>

        <p class="nutrition-summary">단단지가 고루 분배된 영양만점 도시락 입니다.</p>
        <strong class="nutrition-score">영양점수 ${recipe.score}점</strong>
      </section>

      <div class="recipe-mascot">
        <img class="recipe-mascot__char" src="${recipe.mascot}" alt="요리하는 캐릭터">
        <div class="recipe-mascot__bubble">
          <img class="recipe-mascot__bubble-img" src="images/Img_Speech_Bubble.png" alt="" aria-hidden="true">
          <span class="recipe-mascot__bubble-text">같이 만들어봐요</span>
        </div>
      </div>

      <section class="ingredient-card">
        <div class="recipe-section-head">
          <div>
            <h2>이런 식재료가 들어가요!</h2>
            <p>요리 시작 전, 식재료를 미리 준비해주세요.</p>
          </div>
          <button type="button" onclick="openIngredientOverview()">한눈에 보기 <span>›</span></button>
        </div>

        <div class="ingredient-list">
          ${recipe.ingredients.map(item => `
            <article class="ingredient-item">
              <img src="${item.icon}" alt="">
              <strong>${item.name}</strong>
              <span aria-hidden="true">×</span>
            </article>
          `).join('')}
        </div>
      </section>

      <section class="recipe-steps-card">
        <div class="recipe-steps-card__title">
          <h2>${recipe.name}</h2>
          <span>${recipe.badge}</span>
          <button type="button" aria-label="찜하기">♥</button>
        </div>

        <ol class="recipe-step-list">
          ${recipe.steps.map((step, index) => `
            <li>
              <h3><span>${index + 1}</span> ${step.title}</h3>
              <p>${step.desc.replace(/\n/g, '<br>')}</p>
            </li>
          `).join('')}
        </ol>
      </section>

      <div class="recipe-dots" aria-hidden="true">
        <span class="active"></span><span></span><span></span>
      </div>

      <div class="recipe-cta-wrap">
        <button class="recipe-cta" type="button" onclick="markRecipeDone()">오늘 만들었어요 !</button>
      </div>
    </main>
  `;
}

function markRecipeDone() {
  alert('오늘의 도시락 기록에 저장했어요!');
}

function openIngredientOverview() {
  closeIngredientOverview();

  const recipe = RECIPE_DETAIL;
  const popup = document.createElement('div');
  popup.className = 'ingredient-popup';
  popup.id = 'ingredient-popup';
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-modal', 'true');
  popup.setAttribute('aria-label', '식재료 한눈에 보기');
  popup.innerHTML = `
    <button class="ingredient-popup__dim" type="button" aria-label="팝업 닫기" onclick="closeIngredientOverview()"></button>
    <section class="ingredient-popup__panel">
      <div class="ingredient-popup__handle" aria-hidden="true"></div>
      <div class="ingredient-popup__header">
        <div>
          <p>오늘 만들 도시락</p>
          <h2>필요한 식재료</h2>
        </div>
        <button class="ingredient-popup__close" type="button" aria-label="닫기" onclick="closeIngredientOverview()">×</button>
      </div>

      <div class="ingredient-popup__hero">
        <img src="${recipe.image}" alt="${recipe.name}">
        <div>
          <strong>${recipe.name}</strong>
          <span>${recipe.ingredients.length}가지 재료를 준비해주세요</span>
        </div>
      </div>

      <div class="ingredient-popup__grid">
        ${recipe.ingredients.map(item => `
          <article class="ingredient-popup__item">
            <img src="${item.icon}" alt="">
            <span>${item.name}</span>
          </article>
        `).join('')}
      </div>

      <button class="ingredient-popup__submit" type="button" onclick="closeIngredientOverview()">확인했어요</button>
    </section>
  `;

  document.body.appendChild(popup);
  requestAnimationFrame(() => popup.classList.add('open'));
}

function closeIngredientOverview() {
  const popup = document.getElementById('ingredient-popup');
  if (!popup) return;

  popup.classList.remove('open');
  popup.addEventListener('transitionend', () => popup.remove(), { once: true });
  window.setTimeout(() => popup.remove(), 260);
}

window.markRecipeDone = markRecipeDone;
window.openIngredientOverview = openIngredientOverview;
window.closeIngredientOverview = closeIngredientOverview;
