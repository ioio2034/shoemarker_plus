# 📁 Publishing Guide

## 📌 Overview
- **프로젝트명** : 슈마커 플러스 온라인 플랫폼 서비스 구축
- **작업 범위** : PC / Mobile 반응형 퍼블리싱  
- **작업 방식**
  - HTML + SCSS 기반 스타일 작성
  - SCSS를 모듈 단위로 관리 후 **단일 CSS 파일(`style.css`)로 컴파일하여 사용**
  - Media Query

### 기준 해상도
| Device  | Width  |
|---------|--------|
| PC      | 1920px |
| Tablet  | 1024px |
| Mobile  | 375px  |

## 🎨 SCSS Strategy

### 📌 폴더 기준
SCSS는 역할 단위로 분리하여 관리하며, `style.scss`에서 통합하여 컴파일
| Folder | Description |
|--------|------------|
| base | 변수, mixin, reset, 공통 유틸 |
| layout | header, footer, container 등 레이아웃 |
| components | 재사용 UI |
| pages | 페이지 단위 스타일 |

### 📌 파일 기준
| File | Description |
|------|------------|
| `_variables.scss` | 색상, 폰트, spacing 변수 정의 |
| `_mixin.scss` | 반응형 및 공통 mixin |
| `_reset.scss` | 브라우저 초기화 |
| `_font.scss` | 폰트 선언 |
| `_helper.scss` | 공통 유틸 클래스 |
| `_header.scss` | 헤더 레이아웃 |
| `_footer.scss` | 푸터 레이아웃 |
| `_container.scss` | 공통 레이아웃 |
| `style.scss` | SCSS 통합 및 컴파일 진입 파일 |

### 📌 SCSS 작성 규칙
- SCSS는 `@use` 기반 모듈 시스템 사용
- 변수 및 mixin은 **사용하는 파일에서 직접 `@use` 선언**
- partial 파일(`_파일명.scss`)은 직접 컴파일하지 않음
- 최종 결과는 `style.css`로 단일 파일 출력

## 📱 Responsive Rules
- 반응형은 `max-width` Media Query 기준
- 구조 변경 없이 스타일 분기 방식 적용
- 동일 마크업 기준으로 디바이스별 스타일 제어
- PC/Mobile 구조가 다른 영역은 .--pc / .--mobile 형식으로 분리
- display 제어는 media query에서 처리

## 📂 Directory Structure
```
project/
├─ index.html  // 퍼블리싱 작업 현황판
├─ assets/
│  ├─ css/
│  │  ├─ style.css
│  │  └─ swiper-bundle.min.css
│  ├─ fonts/
│  ├─ images/
│  ├─ js/
│  │  └─ ui.js
│  └─ scss/
│     ├─ style.scss
│     ├─ base/
│     │  ├─ _font.scss
│     │  ├─ _helper.scss
│     │  ├─ _mixin.scss
│     │  ├─ _reset.scss
│     │  └─ _variables.scss
│     ├─ components/
│     │  └─ _button.scss
│     ├─ layout/
│     │  ├─ _container.scss
│     │  ├─ _footer.scss
│     │  └─ _header.scss
│     └─ pages/
│        └─ _main.scss
├─ html/
│  ├─ include/
│  │  ├─ header.html
│  │  └─ footer.html
│  ├─ page별 폴더/
│  └─ components.html //컴포넌트 가이드
└─ README.md
```

## 🔗 Path Rules
- 모든 리소스(css, js, images, fonts)는 상대경로 기준으로 작성
- 루트 절대경로(/assets/...)는 사용하지 않음
- HTML 위치 기준으로 ../../assets/... 형식으로 통일

## 🧩 Include 구조 (Header / Footer)
- `header`, `footer`는 `html/include` 폴더로 분리
- 각 페이지에서 script를 통해 include 방식으로 로드
- 해당 include 방식은 퍼블리싱 편의를 위한 구조이며 개발 환경에서 사용되지 않을 경우 **제거해도 무방함**

## 📊 Publishing Status Board
- 최상위 `index.html`은 **퍼블리싱 작업 현황판**으로 사용
- 페이지 리스트, 작업 상태(완료 / 진행중 / 대기), 각 페이지로 이동 가능한 링크를 포함

## ⚠️ Notes
- HTML은 디바이스별로 분리하지 않고 단일 구조로 유지하며, 반응형 처리는 CSS(Media Query)를 통해 제어
- 단, PC / Mobile 구조가 완전히 다른 경우에 한해 `. --pc / . --mobile` 클래스를 사용하여 예외적으로 분리 적용
- 페이지 구분은 .page-xxx 클래스 사용
- 스타일 수정 시 공통 컴포넌트 확인 후 수정