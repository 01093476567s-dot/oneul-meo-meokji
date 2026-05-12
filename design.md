# 오늘 머먹찌? — Design Guide
> 바이브코딩용 디자인 가이드 · v2.0 · 2026.04  
> 기반: 전체 화면 디자인 (35개 스크린) 실측 분석

---

## 목차
1. [브랜드 & 컬러 시스템](#1-브랜드--컬러-시스템)
2. [타이포그래피](#2-타이포그래피)
3. [간격 & 그리드](#3-간격--그리드)
4. [공통 컴포넌트](#4-공통-컴포넌트)
5. [화면별 레이아웃 스펙](#5-화면별-레이아웃-스펙)
6. [마스코트 & 일러스트 가이드](#6-마스코트--일러스트-가이드)
7. [모션 & 인터랙션](#7-모션--인터랙션)
8. [바이브코딩 CSS 변수 템플릿](#8-바이브코딩-css-변수-템플릿)

---

## 1. 브랜드 & 컬러 시스템

### Primary Colors

| 토큰 | HEX | 사용처 |
|------|-----|--------|
| `--primary` | `#FF8C66` | 헤더 BG, CTA 버튼, 활성 탭 텍스트/아이콘 ✅ 피그마 실측 |
| `--primary-light` | `#FFB49A` | 태그 호버, 선택 배경 경계 |
| `--primary-bg` | `#FFF0E8` | 선택된 아이콘 BG, 태그 BG |
| `--primary-dark` | `#E06B48` | 버튼 pressed 상태 |

### Secondary Colors (서브 색상)

| 토큰 | HEX | 사용처 |
|------|-----|--------|
| `--dark-navy` | `#3A4D7A` | 다음/시작하기/입력완료/재료담기 버튼 ✅ 피그마 실측 |
| `--dark-navy-light` | `#4D6399` | Dark Navy 버튼 hover |

### Neutral Colors (피그마 실측값)

| 토큰 | HEX | 사용처 |
|------|-----|--------|
| `--white` | `#FFFFFF` | 카드 BG |
| `--bg-base` | `#FFFAF5` | 앱 전체 기본 배경 ✅ 피그마 실측 |
| `--border-warm` | `#ECE4DA` | 하단 탭바 상단 구분선 ✅ 피그마 실측 |
| `--text-main` | `#2A2018` | 본문 기본 텍스트 (Dark Brown) ✅ 피그마 실측 |
| `--text-sub` | `rgba(42,32,24,0.5)` | 보조 텍스트, 날짜, 비활성 인디케이터 ✅ 피그마 실측 |
| `--text-inactive-tab` | `#B3AFAC` | 비활성 상단 탭 텍스트 ✅ 피그마 실측 |
| `--text-inactive-nav` | `#B0A090` | 비활성 하단 탭 텍스트/아이콘 ✅ 피그마 실측 |
| `--gray-200` | `#E0E0E0` | 구분선, 테두리 |
| `--gray-400` | `#BDBDBD` | 비활성 아이콘 |

### Semantic Colors (유통기한 상태)

| 토큰 | HEX | 상태 |
|------|-----|------|
| `--status-safe` | `#9E9E9E` | 넉넉해요 (7일 초과) |
| `--status-warning` | `#4CAF50` | 일주일 남았어요 (2~7일) |
| `--status-danger` | `#F44336` | 하루 남았어요 (1일 이하) |
| `--status-expired` | `#212121` | 지났어요 (만료) |

### Calendar Colors

| 용도 | HEX |
|------|-----|
| 일요일 | `#F44336` |
| 토요일 | `#90CAF9` |
| 기록된 날짜 점 | `#FF8C66` |
| 오늘 날짜 BG | `#FF8C66` |
| 오늘 날짜 텍스트 | `#FFFFFF` |
| 이번달 기록 횟수 | `#FF8C66` |

---

## 2. 타이포그래피

### 폰트
- **기본**: Pretendard (피그마 실측) — 없을 시 Noto Sans KR 대체
- **가중치**: 300 Light / 400 Regular / 500 Medium / 600 SemiBold / 700 Bold

```html
<!-- Pretendard (권장) -->
<link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
<!-- 대체 폰트 -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### 텍스트 스케일

| 토큰 | 크기 | 굵기 | Line Height | 사용처 |
|------|------|------|-------------|--------|
| `--text-display` | 28px | 700 Bold | 1.3 | 앱 타이틀, 절감액 숫자 |
| `--text-h1` | 24px | 700 Bold | 1.3 | 레시피 제목, 페이지 대제목 |
| `--text-h2` | 20px | 700 Bold | 1.4 | 인사말, 섹션 대제목 |
| `--text-h3` | 18px | 600 SemiBold | 1.4 | 카드 타이틀, 섹션 타이틀 |
| `--text-h4` | 16px | 600 SemiBold | 1.5 | 아코디언 헤더, 메뉴 항목 |
| `--text-body1` | 14px | 400 Regular | 1.6 | 본문 텍스트, 설명 |
| `--text-body2` | 13px | 400 Regular | 1.6 | 카드 설명, 보조 정보 |
| `--text-caption` | 11px | 400 Regular | 1.5 | 레이블, 날짜, 태그 |
| `--text-price` | 22px | 700 Bold | 1.2 | 구독 요금 |

---

## 3. 간격 & 그리드

### Spacing Scale

| 토큰 | 값 | 사용처 |
|------|-----|--------|
| `--space-2` | 2px | 점(•) 마진 |
| `--space-4` | 4px | 태그 내부 상하 패딩 |
| `--space-6` | 6px | 아이콘-텍스트 간격 |
| `--space-8` | 8px | 인라인 요소 간격 |
| `--space-12` | 12px | 카드 내부 섹션 간격 |
| `--space-16` | 16px | 화면 좌우 여백 (기본), 카드 패딩 |
| `--space-20` | 20px | 섹션 상하 패딩 |
| `--space-24` | 24px | 섹션 간 간격 |
| `--space-32` | 32px | 대섹션 간 간격 |

### 뷰포트 & 레이아웃
- 최대 너비: **430px** (iPhone 14 Pro Max 기준)
- 화면 좌우 여백: **16px**
- 기본 배경: `--bg-base` (`#FFF6F2`)
- 앱 최대 너비로 중앙 정렬

### 주요 UI 높이

| 컴포넌트 | 높이 |
|----------|------|
| 앱 헤더 | 56px |
| 하단 탭 바 | 60px |
| 상단 탭 바 (홈) | 44px |
| 카테고리 탭 바 | 44px |
| CTA 버튼 (Full) | 52px |
| 카드 버튼 (플랜/입력방식) | 72px |
| 식재료 아이콘 그리드 셀 | 72px |
| 바텀 탭 아이콘 | 24px |

### Border Radius

| 용도 | 값 |
|------|-----|
| 버튼 (Full) | 12px |
| Pill 버튼 / 태그 | 100px (완전 둥근) |
| 카드 | 12px |
| 아이콘 셀 선택 배경 | 12px |
| 바텀시트 | 20px 상단만 |
| 뱃지 (원형) | 50% |
| 입력 필드 | 10px |
| 툴팁 | 10px |

---

## 4. 공통 컴포넌트

### 4.1 앱 헤더

```
배경: --primary (#F4724E)
높이: 56px (Status bar 제외)
position: sticky, top: 0, z-index: 100

[기본 헤더]
좌측: 앱 타이틀 "오늘 머먹찌?" (White, 20px Bold)
우측: 장바구니 아이콘 + 뱃지 (숫자, White, #F44336 배경, 원형 16px)

[서브 페이지 헤더]
좌측: < 뒤로가기 아이콘 (White, 24px)
중앙: 페이지 타이틀 (White, 16px SemiBold)
우측: 홈 아이콘 (White, 24px)
```

### 4.2 하단 탭 바 (Bottom Navigation)

```
배경: --white
높이: 60px
position: fixed, bottom: 0
상단 구분선: 1px solid --gray-200
z-index: 100

탭 3개: 홈 / 냉장고 / 마이페이지
아이콘: 24px
텍스트: 10px
간격: 아이콘-텍스트 4px

활성: 아이콘 + 텍스트 --primary
비활성: 아이콘 + 텍스트 --gray-600

main에 padding-bottom: 60px 추가 필수
```

### 4.3 상단 탭 바 (홈 탭 전환)

```
배경: --white
높이: 44px
하단 구분선: 1px solid --gray-200

탭 2개: "오늘의 도시락" / "나의 도시락 기록"
활성: --primary 텍스트 + 하단 2px solid --primary 언더라인
비활성: --gray-600 텍스트
```

### 4.4 CTA 버튼 (Full-Width)

```css
/* Primary CTA */
.btn-primary {
  background: var(--primary);       /* #F4724E */
  color: white;
  height: 52px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  width: calc(100% - 32px);
  margin: 0 16px;
}

/* Dark Navy CTA (다음 / 시작하기 / 입력완료) */
.btn-dark {
  background: var(--dark-navy);     /* #1E2D4E */
  color: white;
  height: 52px;
  border-radius: 12px;
}

/* 비활성 CTA */
.btn-disabled {
  background: var(--gray-200);      /* #E0E0E0 */
  color: var(--gray-600);
  pointer-events: none;
}

/* Pill CTA (카메라 화면 촬영 하기) */
.btn-pill {
  border-radius: 100px;
  background: white;
  color: var(--text-primary);
}
```

### 4.5 카드

```css
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 16px;
  margin: 0 16px 12px;
}

/* 선택된 플랜 카드 */
.card--selected {
  border: 2px solid var(--primary);
}

/* 입력방식 카드 (사진촬영/직접입력) */
.card--method {
  width: calc(50% - 24px);
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
```

### 4.6 태그 / Pill

```css
/* 기본 태그 (카테고리 탭, 알레르기) */
.tag {
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 13px;
  border: 1px solid var(--gray-200);
  background: white;
  color: var(--text-primary);
}

/* 활성 태그 */
.tag--active {
  background: var(--primary-bg);   /* #FFF0EB */
  color: var(--primary);            /* #F4724E */
  border-color: var(--primary);
}

/* 선택된 알레르기 태그 */
.tag--selected {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

/* AI 추천메뉴 뱃지 */
.badge-ai {
  padding: 2px 8px;
  border-radius: 100px;
  font-size: 10px;
  background: var(--primary-bg);
  color: var(--primary);
}
```

### 4.7 수량 조절 컨트롤

```css
.quantity-control {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  padding: 4px 12px;
}

.quantity-btn {
  width: 28px;
  height: 28px;
  font-size: 18px;
  color: var(--primary);
  background: none;
}

.quantity-value {
  font-size: 16px;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
}
```

### 4.8 수량 뱃지 (냉장고 그리드)

```css
.quantity-badge {
  position: absolute;
  top: -4px;
  left: -4px;
  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

/* 유통기한 상태별 색상 */
.badge--safe    { background: var(--status-safe); }     /* Gray */
.badge--warning { background: var(--status-warning); }  /* Green */
.badge--danger  { background: var(--status-danger); }   /* Red */
.badge--expired { background: var(--status-expired); }  /* Black */
```

### 4.9 아코디언

```css
.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 12px;
  cursor: pointer;
}

.accordion-arrow {
  transition: transform 0.2s ease;
  color: var(--gray-600);
}

.accordion--open .accordion-arrow {
  transform: rotate(180deg);
}

.accordion-content {
  overflow: hidden;
  transition: max-height 0.2s ease;
}
```

### 4.10 바텀시트

```css
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  background: white;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.12);
  z-index: 200;
}

.bottom-sheet-handle {
  width: 36px;
  height: 4px;
  background: var(--gray-200);
  border-radius: 2px;
  margin: 12px auto 16px;
}

/* 딤드 배경 */
.bottom-sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 199;
}
```

### 4.11 FAB (Floating Action Button)

```css
.fab {
  position: fixed;
  bottom: 76px;          /* 탭 바(60px) + 여백(16px) */
  right: 16px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  font-size: 28px;
  box-shadow: 0 4px 12px rgba(244, 114, 78, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
```

### 4.12 툴팁

```css
/* Dark Navy 툴팁 (냉장고 빈 상태) */
.tooltip-dark {
  background: var(--dark-navy);
  color: white;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 13px;
  position: relative;
}

/* 닫기 버튼 */
.tooltip-close {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.7);
  font-size: 16px;
}
```

### 4.13 검색바

```css
.search-bar {
  background: var(--primary-bg);    /* #FFF0EB */
  border-radius: 10px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 16px 12px;
}

.search-icon {
  color: var(--primary);
  font-size: 16px;
}

.search-input {
  background: none;
  border: none;
  font-size: 14px;
  color: var(--text-primary);
  flex: 1;
}

.search-input::placeholder {
  color: var(--primary-light);
}
```

### 4.14 입력 필드

```css
.input-field {
  width: 100%;
  border: 1px solid var(--gray-200);
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 14px;
  color: var(--text-primary);
  background: white;
}

.input-field:focus {
  border-color: var(--primary);
  outline: none;
}

.input-field::placeholder {
  color: var(--gray-400);
}
```

### 4.15 토글 스위치

```css
.toggle {
  width: 48px;
  height: 28px;
  border-radius: 14px;
  background: var(--gray-200);
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
}

.toggle--on {
  background: var(--primary);
}

.toggle-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 3px;
  left: 3px;
  transition: transform 0.2s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}

.toggle--on .toggle-thumb {
  transform: translateX(20px);
}
```

---

## 5. 화면별 레이아웃 스펙

### 5.1 홈 — 오늘의 도시락

```
[헤더 56px: Primary BG]
[탭 44px: White]
[인사 섹션: padding 20px 16px]
  - 좌: 이름 22px Bold / 우: 마스코트 80px
[도시락 섹션 헤더: padding 16px 16px 8px]
  - 좌: "오늘의 도시락" 14px SemiBold + 날짜 12px Gray
  - 우: "N/3" 12px Gray
[카드 슬라이더: overflow-x scroll, padding 0 16px, gap 12px]
  - 카드: width 160px, height 200px, border-radius 12px
  - 이미지 전체 + 하단 그라디언트 오버레이
  - 하단: AI 태그 (10px Pill) + 도시락명 (13px Bold White) + 설명 (11px White 0.8)
["내가 직접 만들래요! >" : right 16px, Primary, 13px, padding 8px 0]
[하단 탭 바 60px: fixed]
```

### 5.2 캘린더 (나의 도시락 기록)

```
[절감액 카드: margin 16px, padding 16px]
  - 좌: 마스코트 48px / 우: 텍스트 그룹
  - "이번 달 절감액" 12px Gray
  - 금액 24px Bold Primary
  - "N회 × N원" 11px Gray
[섹션 타이틀: 22px Bold, padding 20px 16px 16px]
[캘린더 카드: margin 0 16px, padding 16px]
  - 월 네비게이션: < 2026년 N월 > (14px)
  - "이번달 기록 N회" 12px Primary
  - 7열 그리드 (일~토 헤더 + 날짜 셀)
  - 날짜 셀: 32px × 32px, 기록된 날 하단 점(•) 6px
[하단 CTA 영역: padding 24px 16px]
  - 캘린더 아이콘 48px (Gray, + 서클 Primary)
  - 텍스트 12px Gray
```

### 5.3 레시피 상세

```
[풀스크린 이미지 헤더: height 280px]
  - < 뒤로가기: 좌상단 White 원형 배경
  - 타이틀: 좌하단, 26px Bold White, 최대 3줄
  - 하단 그라디언트: transparent → rgba(0,0,0,0.7)
[영양 점수 카드: margin 16px, padding 16px]
  - "도시락 영양 점수" + "자세히 보기 >"
  - 가로 바: 3분할 (탄수화물/단백질/지방), 각각 색상
  - 영양소 범례 + kcal
  - "영양점수 N점" Primary Bold
[마스코트 영역: center, padding 24px]
  - 마스코트 쌍 일러스트 + 말풍선
[식재료 섹션: padding 0 16px]
  - 헤더: "이런 식재료가 들어가요!" + "한눈에 보기 >"
  - 가로 스크롤: 식재료 아이콘 56px + 이름 + ×
[레시피 단계: padding 16px]
  - 단계 번호 (Primary) + 단계명 Bold + 설명
[하단 CTA: 고정, 마진 16px]
```

### 5.4 냉장고 (재료 있음)

```
[헤더 56px]
[경고 배너: Primary BG 연한 버전, padding 12px 16px]
  - "▲ 유통기한이 얼마 남지 않은 식재료가 있어요!"
  - V/∧ 아코디언 토글
  - 열림: 임박 식재료 5열 그리드 (뱃지 + 아이콘 + 이름)
[마스코트 영역: height 160px, center]
  - 냉장고 + 햄스터 + 말풍선 일러스트
[카테고리 탭: 가로 스크롤, height 44px, padding 0 16px]
[유통기한 안내: 12px Gray, padding 8px 16px, ⓘ 아이콘]
[식재료 그리드: 5열, padding 0 16px, gap 12px]
  - 셀: position relative, width calc(20% - 10px)
  - 아이콘 이미지: 56px
  - 이름: 11px center
  - 뱃지: position absolute, top -4px, left -4px
  - 마지막 셀: 점선 테두리, + 아이콘
[FAB: fixed, bottom 76px, right 16px, 56px 원형]
[하단 탭 바]
```

### 5.5 식재료 추가 — 직접입력

```
[헤더 56px]
[검색바: margin 12px 16px]
[카테고리 탭: 가로 스크롤, height 44px]
[아이콘 그리드: 6열]
  - 셀: padding 8px 4px
  - 아이콘: 48px 이미지
  - 이름: 11px center
  - 선택 시: #FFF0EB 배경, border-radius 12px
[직접입력 아코디언: margin 12px 16px]
  - [카테고리 V] [아이콘 V] → 가로 2열
  - 입력 필드 3개 (이름/유통기한/수량)
  - [입력완료] Dark Navy
[선택된 재료 아코디언]
  - 재료 행: 아이콘 40px + 이름그룹 + 수량컨트롤 + ★
[하단 CTA 52px: margin 16px]
```

### 5.6 사진촬영 — 카메라

```
[전체 배경: #000000]
[헤더: 배경 없음 (투명), White 텍스트/아이콘]
[스캔 프레임: position absolute, center]
  - 4모서리 Primary 색상 L자 라인, 두께 3px, 길이 24px
  - 내부 영역: 투명
[안내 텍스트: white, 14px, center, 하단 1/3 지점]
[하단 CTA 영역: padding 24px 16px]
  - "촬영 하기" Pill 버튼: White BG, 52px, 전체 너비, radius 100px
```

### 5.7 마이페이지

```
[헤더 영역: Primary BG, padding 20px 16px 24px]
  - 우상단: 알림(🔔) + 설정(⚙️) White 24px
  - 마스코트: 80px 원형, White 테두리 2px, center
  - 이름: 18px Bold White + 편집(✏️)
  - 2열 버튼: [포인트 340P] [구독현황 비구독/주N회]
    - 배경: rgba(255,255,255,0.25)
    - 텍스트: White, 14px
    - border-radius: 10px, padding: 10px 16px

[메뉴 섹션: margin 16px 0]
  - 섹션 타이틀: 14px Bold #212121, padding 16px 16px 8px
  - 메뉴 항목: height 48px, padding 0 16px
    - 좌: 아이콘 20px Gray + 텍스트 14px
    - 우: 보조텍스트 12px Gray (상태 정보)
  - 섹션 간 구분: 8px Gray BG

[푸터: padding 24px 16px, center]
  - "회원탈퇴 | 사업자정보확인" Gray 12px
  - 연락처 / 이메일 Gray 12px
```

### 5.8 구독 시작하기 — 플랜 선택

```
[헤더 56px]
["플랜을 선택해주세요!" 20px Bold, center, padding 24px 16px 8px]
["어떤 플랜을 원하시나요?" 13px Gray, center, padding 0 16px 20px]

[플랜 카드: margin 0 16px 12px, padding 16px]
  - height 80px
  - 좌: 마스코트 일러스트 56px
  - 우: 플랜명 14px Bold + 가격 22px Bold #1E2D4E + 설명 12px Gray
  - HOT 뱃지: 8px, Red, Pill
  - 선택: Primary 테두리 2px

[하단 CTA "다음": margin 16px, position sticky bottom 16px]
  - 미선택: Gray BG
  - 선택: Dark Navy BG
```

---

## 6. 마스코트 & 일러스트 가이드

### 마스코트 상황별 버전

| 상황 | 모습 | 화면 |
|------|------|------|
| 기본 | 귀여운 햄스터, 문 안에서 손 흔들기 | 홈 인사 섹션 |
| 고민 | 말풍선(···), 빈 냉장고 앞 | 냉장고 빈 상태 |
| 관리 | 메모지 들고 냉장고 옆 | 냉장고 재료 있음 |
| 절약 | 동전/음식 안고 앉아있음 | 캘린더 절감액 카드 |
| 요리 | 셰프 모자, 냄비 앞 쌍으로 | 레시피 상세 |
| 구독배지 | 구독 텍스트 배지 착용 | 마이페이지 (비구독) |
| 요리사 | 셰프 모자 + 숫자 들고 있음 | 마이페이지 (구독 중), 플랜 선택 |
| 실망 | 통통한 얼굴, 실망 표정 | 구독현황 빈 상태 |

### 식재료 아이콘 스타일
- **스타일**: 수채화 느낌, 파스텔 컬러 일러스트
- **배경**: 투명
- **크기**: 56px (냉장고 그리드) / 48px (직접입력 그리드) / 40px (재료 리스트)
- **해상도**: 2x / 3x Retina 대응

### 음식 사진 (도시락 카드)
- 실제 음식 사진 (소불고기덮밥, 두부스테이크 등)
- 하단 그라디언트 오버레이: `linear-gradient(transparent 40%, rgba(0,0,0,0.65) 100%)`

---

## 7. 모션 & 인터랙션

| 요소 | 애니메이션 | 시간 | Easing |
|------|-----------|------|--------|
| 페이지 전환 | Slide (우→좌) | 300ms | ease-in-out |
| 탭 전환 (홈) | Fade | 200ms | ease |
| 아코디언 | Height expand/collapse | 200ms | ease |
| 카드 탭 | scale(0.97) | 100ms | ease |
| 버튼 탭 | scale(0.96) opacity(0.9) | 100ms | ease |
| 바텀시트 등장 | Slide up | 250ms | ease-out |
| 바텀시트 사라짐 | Slide down | 200ms | ease-in |
| 토글 | Background + thumb | 200ms | ease |
| 툴팁 등장 | Fade + scale | 150ms | ease |
| FAB | scale(0.9) on press | 100ms | ease |

---

## 8. 바이브코딩 CSS 변수 템플릿

파일: `css/variables.css`

```css
:root {
  /* Primary — 피그마 실측값 */
  --primary:             #FF8C66;
  --primary-light:       #FFB49A;
  --primary-bg:          #FFF0E8;
  --primary-dark:        #E06B48;

  /* Dark Navy (서브 색상) — 피그마 실측값 */
  --dark-navy:           #3A4D7A;
  --dark-navy-light:     #4D6399;

  /* Neutral — 피그마 실측값 */
  --white:               #FFFFFF;
  --bg-base:             #FFFAF5;   /* 앱 기본 배경 */
  --border-warm:         #ECE4DA;   /* 하단 탭바 구분선 */
  --text-main:           #2A2018;   /* 기본 텍스트 (Dark Brown) */
  --text-sub:            rgba(42, 32, 24, 0.5); /* 보조 텍스트 */
  --text-inactive-tab:   #B3AFAC;   /* 비활성 상단 탭 */
  --text-inactive-nav:   #B0A090;   /* 비활성 하단 탭 */
  --gray-200:            #E0E0E0;
  --gray-400:            #BDBDBD;

  /* Status */
  --status-safe:    #9E9E9E;
  --status-warning: #4CAF50;
  --status-danger:  #F44336;
  --status-expired: #212121;

  /* Calendar */
  --cal-sunday:     #F44336;
  --cal-saturday:   #90CAF9;

  /* Typography */
  --font-family:    'Pretendard', 'Noto Sans KR', sans-serif; /* 피그마 실측 */
  --text-display:   28px;
  --text-h1:        24px;
  --text-h2:        20px;
  --text-h3:        18px;
  --text-h4:        16px;
  --text-body1:     14px;
  --text-body2:     13px;
  --text-caption:   11px;
  --text-price:     22px;

  /* Spacing */
  --space-2:   2px;
  --space-4:   4px;
  --space-6:   6px;
  --space-8:   8px;
  --space-12:  12px;
  --space-16:  16px;
  --space-20:  20px;
  --space-24:  24px;
  --space-32:  32px;

  /* Border Radius */
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   20px;
  --radius-full: 100px;

  /* Shadow */
  --shadow-card:    0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-fab:     0 4px 12px rgba(244, 114, 78, 0.4);
  --shadow-sheet:   0 -4px 20px rgba(0, 0, 0, 0.12);

  /* Layout */
  --max-width:      430px;
  --header-height:  56px;
  --tab-height:     60px;
  --screen-px:      16px;
}

/* Reset & Base */
*, *::before, *::after { box-sizing: border-box; }
body {
  font-family: var(--font-family);
  font-size: var(--text-body1);
  color: var(--text-primary);
  background: var(--bg-base);
  max-width: var(--max-width);
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
}

/* 스크롤바 숨김 */
* { -ms-overflow-style: none; scrollbar-width: none; }
*::-webkit-scrollbar { display: none; }
```

---

*오늘 머먹찌? Design Guide v2.0 — 문서 끝*
