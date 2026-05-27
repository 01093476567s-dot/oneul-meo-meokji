import { useNavigate } from 'react-router-dom'

const INGREDIENTS = [
  { icon: '/assets/icons/Ingradient/소고기.svg',              name: '소고기 150g',   have: true },
  { icon: '/assets/icons/Add_Ingredient_page/양파.svg',       name: '양파 1/4개',    have: true },
  { icon: '/assets/icons/Ingradient/대파.svg',               name: '대파 조금',     have: true },
  { icon: '/assets/icons/Add_Ingredient_page/표고버섯.svg',   name: '표고 버섯 2개', have: true },
  { icon: '/assets/icons/Add_Ingredient_page/당근.svg',       name: '당근 조금',     have: false },
]

const SAUCE = [
  ['간장 2큰술', '설탕 1/2큰술', '참기름 1/2큰술'],
  ['다진마늘 1/2큰술', '후추 조금', '소금 조금'],
]

export default function MenuDetail() {
  const navigate = useNavigate()

  return (
    <div className="mdc-page">
      {/* ── 헤더 ── */}
      <div className="mdc-header">
        <button className="mdc-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/action/ic-chevron-left.svg" width="10" height="17" alt="뒤로" />
        </button>
        <h1 className="mdc-header__title">오늘의 추천 메뉴</h1>
        <button className="mdc-header__btn" onClick={() => navigate('/')}>
          <svg width="22" height="20" viewBox="0 0 30 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M29.7556 12.7086L25.8729 9.33506C25.9067 9.25332 25.9237 9.16595 25.9237 9.07295V1.49437C25.9237 1.10544 25.6076 0.789782 25.2182 0.789782H21.3073C20.9179 0.789782 20.6018 1.10544 20.6018 1.49437V4.75804L15.3252 0.175379C15.1897 0.059826 15.0232 0.00345918 14.8596 0.00627754C14.6621 -0.0190877 14.4561 0.0316428 14.2981 0.172561L0.23727 12.6072C-0.0533707 12.8665 -0.0815857 13.3118 0.178015 13.6021C0.316281 13.7599 0.51098 13.8388 0.705681 13.8388C0.872165 13.8388 1.03865 13.7796 1.17409 13.6612L14.8173 1.59583L28.8357 13.7683C28.9683 13.8839 29.1348 13.9403 29.2985 13.9403C29.496 13.9403 29.6907 13.8585 29.8318 13.6979C30.0829 13.4104 30.0491 12.9651 29.7556 12.7086Z" fill="#2A2018"/>
            <path d="M26.2392 13.7396C26.2928 13.4916 26.2138 13.221 26.0022 13.0491L15.1977 4.1008C15.1949 4.09798 15.1892 4.09517 15.1864 4.09235C15.1666 4.07544 15.1441 4.06135 15.1215 4.04725C15.1046 4.03598 15.0876 4.02471 15.0679 4.01625C15.0453 4.00498 15.0227 3.99652 15.0002 3.98807C14.9804 3.97961 14.9607 3.97116 14.9381 3.96552C14.9155 3.95988 14.8929 3.95707 14.8732 3.95143C14.8506 3.94861 14.828 3.94297 14.8055 3.94016C14.7829 3.93734 14.7603 3.94016 14.7377 3.94016C14.7152 3.94016 14.6926 3.94016 14.6728 3.94297C14.6503 3.94579 14.6277 3.95143 14.6023 3.95707C14.5797 3.9627 14.56 3.96552 14.5402 3.97116C14.5176 3.9768 14.4979 3.98807 14.4781 3.99652C14.4556 4.00498 14.4358 4.01343 14.4132 4.02471C14.3935 4.03598 14.3766 4.04725 14.3596 4.05853C14.337 4.07262 14.3173 4.08671 14.2975 4.10362C14.2947 4.10644 14.2891 4.10926 14.2863 4.11208L4.02073 13.0604C4.01509 13.066 4.00944 13.0717 4.0038 13.0773C3.98405 13.0942 3.96994 13.1139 3.95301 13.1337C3.9389 13.1506 3.92479 13.1647 3.91068 13.1844C3.89657 13.2041 3.88528 13.2238 3.874 13.2436C3.86271 13.2633 3.85143 13.283 3.84296 13.3028C3.8345 13.3225 3.82603 13.345 3.82039 13.3648C3.81192 13.3873 3.80628 13.407 3.80063 13.4296C3.79499 13.4493 3.79217 13.4719 3.78935 13.4944C3.78653 13.5198 3.78371 13.5451 3.78088 13.5705C3.78088 13.579 3.77806 13.5846 3.77806 13.593V26.0587C3.77806 26.0981 3.7837 26.1376 3.78935 26.177C3.7837 26.2165 3.77806 26.2531 3.77806 26.2954C3.77806 26.6843 4.09409 27 4.4835 27H25.5196C25.5253 27 25.5309 26.9972 25.5366 26.9972C25.5422 26.9972 25.5479 27 25.5535 27C25.9429 27 26.2589 26.6843 26.2589 26.2954V13.8974C26.2561 13.8439 26.2505 13.7903 26.2392 13.7396ZM17.4099 25.5852H12.5847V17.0061H17.4099V25.5852Z" fill="#2A2018"/>
          </svg>
        </button>
      </div>

      {/* ── 히어로 이미지 ── */}
      <div className="mdc-hero">
        <img className="mdc-hero__img" src="/assets/images/recipe-main-picture.jpg" alt="소불고기 도시락" />
        <div className="mdc-hero__gradient" />

        {/* 히어로 텍스트 콘텐츠 */}
        <div className="mdc-hero__content">
          <div className="mdc-hero__badge"><span className="mdc-hero__badge-text">AI 추천메뉴</span></div>
          <p className="mdc-hero__title">영양만점<br />소불고기 도시락</p>
          <p className="mdc-hero__desc">냉장고 속 식재료로 바로 만들 수 있어요.</p>
        </div>
      </div>

      {/* ── 정보 바 (Figma 317:2583) ── */}
      <div className="mdc-infobar">
        <div className="mdc-infobar__inner">
          <div className="mdc-infobar__item">
            <img src="/assets/icons/common/ic-timer.svg" width="14" height="15" alt="시간" />
            <span className="mdc-infobar__text">20분</span>
          </div>
          <div className="mdc-infobar__item">
            <img src="/assets/icons/common/ic-person.svg" width="14" height="13" alt="인분" />
            <span className="mdc-infobar__text">1인분</span>
          </div>
          <div className="mdc-infobar__item">
            <img src="/assets/icons/common/ic-star.svg" width="14" height="14" alt="난이도" />
            <span className="mdc-infobar__text">쉬움</span>
          </div>
        </div>
      </div>

      {/* ── 본문 ── */}
      <div className="mdc-content">
        {/* 섹션 제목 */}
        <div className="mdc-section-header">
          <p className="mdc-section-header__title">
            이런 <span className="mdc-section-header__accent">식재료</span>가 들어가요!
          </p>
          <p className="mdc-section-header__sub">요리 시작 전, 식재료를 미리 준비해주세요.</p>
        </div>

        {/* 재료 + 양념장 카드 */}
        <div className="mdc-card">
          {/* 재료 */}
          <div className="mdc-ingredient-section">
            <p className="mdc-card__title">재료</p>
            <div className="mdc-ingredient-list">
              {INGREDIENTS.map(item => (
                <div key={item.name} className="mdc-ingredient-item">
                  <img
                    className={`mdc-ingredient-item__img${item.have ? '' : ' mdc-ingredient-item__img--none'}`}
                    src={item.icon}
                    alt={item.name}
                  />
                  <span className="mdc-ingredient-item__name">{item.name}</span>
                  <div className="mdc-ingredient-item__status">
                    <div className={`mdc-ingredient-item__dot${item.have ? '' : ' mdc-ingredient-item__dot--none'}`} />
                    <span className="mdc-ingredient-item__status-text">{item.have ? '보유' : '없음'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 양념장 */}
          <div className="mdc-sauce-section">
            <p className="mdc-card__title">양념장</p>
            <div className="mdc-sauce-pills">
              {SAUCE.map((row, i) => (
                <div key={i} className="mdc-sauce-row">
                  {row.map(s => <span key={s} className="mdc-sauce-pill">{s}</span>)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA 버튼 */}
        <div className="mdc-cta-bar">
          <button className="mdc-cta-btn mdc-cta-btn--recipe" onClick={() => navigate('/recipe')}>
            레시피 보러가기
          </button>
          <button className="mdc-cta-btn mdc-cta-btn--lunchbox" onClick={() => navigate('/lunchbox-pack')}>
            도시락 담기
          </button>
        </div>
      </div>
    </div>
  )
}
