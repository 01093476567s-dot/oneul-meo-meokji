import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'

const RECIPE = {
  title: '영양만점\n소불고기\n도시락레시피',
  name: '소불고기',
  badge: '메인요리',
  image: '/images/소불고기.jpg',
  mascot: '/images/Img_Cooking_Hamster.png',
  kcal: 485,
  score: 98,
  nutrition: [
    { label: '순탄수', amount: '56.5g', percent: 30, color: '#382719' },
    { label: '단백질', amount: '64g', percent: 34, color: '#ff876d' },
    { label: '지방', amount: '28.9g', percent: 35, color: '#394c7c' },
  ],
  ingredients: [
    { name: '소고기 150g', icon: '/assets/icons/Recipe_page/Img_Item.svg' },
    { name: '양파 1/4개', icon: '/assets/icons/Recipe_page/Img_Item-1.svg' },
    { name: '대파 조금', icon: '/assets/icons/Recipe_page/Img_Item-2.svg' },
    { name: '감자 반개', icon: '/assets/icons/Recipe_page/Img_Item-3.svg' },
    { name: '된장 조금', icon: '/assets/icons/Recipe_page/Img_Item-4.svg' },
  ],
  steps: [
    { title: '재료 준비', desc: '재료 : 소불고기 150g , 양파 1/4개, 대파 조금\n양념 : 간장 2큰술, 설탕1/2큰술, 다진마늘 1/2큰술,\n참기름 1/2큰술, 물1.5큰술 후추소금 조금' },
    { title: '재료 손질', desc: '양파 채썰고 대파는 어슷 썰기로 준비해줍니다.\n고기는 뭉친거 풀어줍니다' },
    { title: '양념에 재우기', desc: '고기와 양파 채소를 전부 넣고 섞어줍니다.\n10 ~ 15분 양념에 재료를 재워줍니다.' },
    { title: '볶기 (5~6분)', desc: '고기와 양념 채소를 전부 넣고 섞어줍니다.\n10 ~ 15분 양념에 재료를 재워줍니다.' },
    { title: '마무리', desc: '국물 자작해지면 불을 끄고 부족한간은 간장을 조금 추가\n해서 맞춰주세요. 마지막에 참기름 살짝 추가 해주면\n더 맛있답니다.' },
  ],
}

function IngredientPopup({ onClose }) {
  return (
    <div className="ingredient-popup open" id="ingredient-popup">
      <button className="ingredient-popup__dim" onClick={onClose} aria-label="팝업 닫기" />
      <section className="ingredient-popup__panel">
        <div className="ingredient-popup__handle" />
        <div className="ingredient-popup__header">
          <div>
            <p>오늘 만들 도시락</p>
            <h2>필요한 식재료</h2>
          </div>
          <button className="ingredient-popup__close" onClick={onClose}>×</button>
        </div>
        <div className="ingredient-popup__hero">
          <img src={RECIPE.image} alt={RECIPE.name} />
          <div>
            <strong>{RECIPE.name}</strong>
            <span>{RECIPE.ingredients.length}가지 재료를 준비해주세요</span>
          </div>
        </div>
        <div className="ingredient-popup__grid">
          {RECIPE.ingredients.map((item) => (
            <article key={item.name} className="ingredient-popup__item">
              <img src={item.icon} alt="" />
              <span>{item.name}</span>
            </article>
          ))}
        </div>
        <button className="ingredient-popup__submit" onClick={onClose}>확인했어요</button>
      </section>
    </div>
  )
}

export default function Recipe() {
  const navigate = useNavigate()
  const { addRecord } = useFridge()
  const [showPopup, setShowPopup] = useState(false)

  function markRecipeDone() {
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    addRecord({ date: dateStr, name: RECIPE.name, savedAmount: 8000 })
    alert('오늘의 도시락 기록에 저장했어요!')
  }

  return (
    <main className="recipe-page">
      <section className="recipe-hero" aria-label={`${RECIPE.name} 레시피`}>
        <img className="recipe-hero__image" src={RECIPE.image} alt={RECIPE.name} />
        <div className="recipe-status" aria-hidden="true">
          <span>9:41</span>
          <span className="recipe-status__icons">▴ ))) ▰</span>
        </div>
        <button className="recipe-hero__back" onClick={() => navigate(-1)} aria-label="이전 화면">
          <img src="/assets/icons/back_icon.svg" alt="" width="10" height="18" />
        </button>
        <div className="recipe-hero__shade" />
        <h1 className="recipe-hero__title">
          {RECIPE.title.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </h1>
      </section>

      <section className="nutrition-card">
        <div className="recipe-section-head">
          <div>
            <h2>도시락 영양 점수</h2>
            <p>칼로리와 영양표를 확인해봐요</p>
          </div>
          <button type="button">자세히 보기 <span>›</span></button>
        </div>
        <div className="nutrition-bars" aria-label="영양 비율">
          {RECIPE.nutrition.map((item) => (
            <div
              key={item.label}
              className="nutrition-bars__item"
              style={{ '--bar-color': item.color, '--bar-width': `${item.percent}%` }}
            >
              <strong>{item.percent}%</strong>
            </div>
          ))}
        </div>
        <div className="nutrition-legend">
          {RECIPE.nutrition.map((item) => (
            <span key={item.label}>
              <i style={{ background: item.color }} />{item.label} {item.amount}
            </span>
          ))}
          <span><i />총{RECIPE.kcal}kcal</span>
        </div>
        <p className="nutrition-summary">단단지가 고루 분배된 영양만점 도시락 입니다.</p>
        <strong className="nutrition-score">영양점수 {RECIPE.score}점</strong>
      </section>

      <div className="recipe-mascot">
        <img className="recipe-mascot__char" src={RECIPE.mascot} alt="요리하는 캐릭터"
          onError={(e) => { e.currentTarget.style.display = 'none' }} />
        <div className="recipe-mascot__bubble">
          <img className="recipe-mascot__bubble-img" src="/images/Img_Speech_Bubble.png" alt="" aria-hidden="true"
            onError={(e) => { e.currentTarget.style.display = 'none' }} />
          <span className="recipe-mascot__bubble-text">같이 만들어봐요</span>
        </div>
      </div>

      <section className="ingredient-card">
        <div className="recipe-section-head">
          <div>
            <h2>이런 식재료가 들어가요!</h2>
            <p>요리 시작 전, 식재료를 미리 준비해주세요.</p>
          </div>
          <button type="button" onClick={() => setShowPopup(true)}>한눈에 보기 <span>›</span></button>
        </div>
        <div className="ingredient-list">
          {RECIPE.ingredients.map((item) => (
            <article key={item.name} className="ingredient-item">
              <img src={item.icon} alt="" />
              <strong>{item.name}</strong>
              <span aria-hidden="true">×</span>
            </article>
          ))}
        </div>
      </section>

      <section className="recipe-steps-card">
        <div className="recipe-steps-card__title">
          <h2>{RECIPE.name}</h2>
          <span>{RECIPE.badge}</span>
          <button type="button" aria-label="찜하기">♥</button>
        </div>
        <ol className="recipe-step-list">
          {RECIPE.steps.map((step, index) => (
            <li key={index}>
              <h3><span>{index + 1}</span> {step.title}</h3>
              <p>{step.desc.split('\n').map((line, i) => (<span key={i}>{line}<br /></span>))}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="recipe-dots" aria-hidden="true">
        <span className="active" /><span /><span />
      </div>

      <div className="recipe-cta-wrap">
        <button className="recipe-cta" onClick={markRecipeDone}>오늘 만들었어요 !</button>
      </div>

      {showPopup && <IngredientPopup onClose={() => setShowPopup(false)} />}
    </main>
  )
}
