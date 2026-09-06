# CLAUDE.md

Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 문서.

MAIMU 프론트엔드 — CRA 5 기반 React 18 SPA. 백엔드는 별도 저장소(`MAIMU_BE_V3`)이며,
두 저장소는 상위 `Maimu/` 워크스페이스 폴더 안에 나란히 있다. 상위 폴더의 `CLAUDE.md`에
두 저장소를 잇는 계약(색상·불리언 이름·에러 코드 등)이 정리돼 있으니 API 경계를 건드릴 땐 같이 읽는다.

## 명령어

```bash
npm install        # package-lock.json 기준. yarn.lock도 있지만 package-lock 쪽이 최신이다
npm start          # 개발 서버 :3000
npm run build      # 프로덕션 빌드 (Vercel: https://maimu.vercel.app)
npm test           # CRA/Jest — 테스트 파일이 0개라 아무것도 실행되지 않는다
```

CRA 5(`react-scripts`), eject 안 함. 린터/포매터는 CRA 내장 `eslint-config-react-app`뿐이고
별도 CI 워크플로도 없다. **빌드 검증은 `npm run build`가 사실상 유일한 수단이다.**

## 먼저 알아야 할 두 가지 함정

### 1. 줄바꿈(CRLF/LF) 때문에 `git diff`가 전부 바뀐 것처럼 보인다

저장소에는 CRLF로 커밋된 파일이 많은데 작업 트리는 LF다. 그래서 `git status`가 100개 넘는
파일을 수정됨으로 표시하지만, 실제 내용이 바뀐 건 그중 15개 남짓이다.

```bash
git diff --ignore-all-space --stat    # 진짜 변경분만 본다. 항상 이 옵션을 쓴다
git diff --stat                       # 쓰지 말 것 — 3만 줄짜리 노이즈가 나온다
```

`git add .`를 하면 관계없는 파일 100개가 줄바꿈만 바뀐 채로 커밋에 딸려 들어간다.
**커밋할 때는 반드시 경로를 명시해서 stage 한다** (`git add src/pages/MainPage/MainPage.js`).

### 2. 대부분의 화면은 새로고침하면 깨진다

`location.state`로 페이지 간 데이터를 넘기기 때문에, F5나 URL 직접 입력 시 state가 사라져
빈 화면이 된다. 예외는 라우트 파라미터를 쓰는 `DetailPage`(`/:groupName/:groupColor/:group_id`)와
`WriteDetailPage`(`/:token`) 둘뿐이다. 새 화면을 만들 때 이 패턴을 그대로 따르면 같은 문제가 생긴다.

## 구조와 컨벤션

```
src/
  App.js                       모든 라우트 정의 + --vh 뷰포트 보정
  index.js                     App → polish.css 순서로 import (순서가 의미 있음)
  design-system.css            디자인 토큰. index.js 에서 '가장 먼저' import
  api/api.js                   baseUrl + 전역 axios 설정/인터셉터 (유일한 공용 API 코드)
  pages/<Name>/<Name>.{js,css} 라우팅되는 화면
  components/<Name>/<Name>.{js,css}  공용 조각
  images/<Screen>/*.svg        화면별 SVG
  polish.css                   디자인 고도화 레이어 (아래 참고)
```

- 컴포넌트 하나당 폴더 하나, CSS는 옆에 두고 같이 import.
- **일반 CSS + 전역 클래스명.** CSS Modules / styled-components / Tailwind 전부 안 쓴다.
  클래스명이 전역이므로 새 클래스를 만들 땐 이름 충돌을 먼저 grep 한다.
- 라우트 경로는 페이지 폴더명과 같은 PascalCase(`/MyPageEdit`)다.
- **라우트 가드가 없다.** 각 페이지가 본문에서 `localStorage.getItem("access_token")`을 읽고,
  없으면 리다이렉트가 아니라 fetch를 그냥 건너뛴다.
- 상태 관리 라이브러리도, 데이터 페칭 라이브러리도 없다. 모든 화면이 `useEffect`나 핸들러 안에서
  `axios`를 직접 호출하고 `useState`에 담는다.
- `--vh`: 모바일 주소창 때문에 `App.js`에서 `document.documentElement`에 `--vh`를 세팅한다.
  CSS에서는 `100vh` 대신 `calc(var(--vh) * 100)`을 쓴다. resize/orientationchange에 리스너가 걸려 있다.

### design-system.css (토큰)

색상 리터럴이 75종 흩어져 있었고 회색만 13종이 거의 같은 톤으로 중복돼 화면마다
톤이 어긋났다. 이제 토큰 하나로 묶는다. **정의처는 이 파일 하나뿐이다** —
polish.css 에 있던 `--maimu-pink` / `--shadow-*` / `--ease-*` 정의도 여기로 옮겼다.

- 브랜드 `--brand-50..700`, 중립 `--ink-50..900`(따뜻한 회색)
- 맛 `--flavor-{pink,yellow,green}{,-soft,-tint}` — tint=그라디언트 시작, soft=넓은 면
- 타이포 `--fs-*` `--fw-*` `--lh-*`, 간격 `--sp-*`(4 기반), 모서리 `--r-*`,
  그림자 `--shadow-*`, 모션 `--ease-*` `--dur-*`, 앱 폭 `--app-w`

새 색을 쓸 때 hex 를 직접 박지 말고 토큰을 쓴다. 현재 기능 CSS 에 남은 리터럴은
31종이고 대부분 흰색이다.

**배경**은 `.CitronBackground` / `.PlumBackground` / `.PomegranateBackground` 세 클래스가
담당한다. 원래 `linear-gradient` 가 35% 지점에서 뚝 끊겨 띠가 생겼는데, polish.css 가
오프화이트 바탕 + 앰비언트 글로우 2겹으로 덮어쓴다.

### polish.css

`index.js`에서 **가장 마지막에** import 되는 추가 전용 디자인 레이어다. 원본 CSS의 색상·크기·위치는
건드리지 않고, 의도됐지만 구현되지 않았던 것(웹폰트 로드, hover/active/focus, 그림자, 모달 모션)만 채운다.
파일 상단 주석에 규칙이 적혀 있고 그중 하나는 지키지 않으면 바로 화면이 깨진다:

> hover/active 효과에 `transform`을 쓰지 말고 `translate` / `scale` / `rotate` 독립 속성을 쓴다.

원본에 `transform: translateX(-50%)`로 가운데 정렬한 요소들(`.FavoriteSection`, `.WriteNote_Button`,
`.WriteDetail_Button`, `.SendNote_Button`, `.ToStartPage_Button`)이 있어서 `transform`을 덮어쓰면
정렬이 사라진다. 독립 속성은 덮어쓰지 않고 합성된다.

폰트(Pretendard / Inter)는 `public/index.html`에서 CDN으로 로드하고 폴백 스택은 polish.css가 보강한다.

## API 접근

`src/api/api.js`가 `{ baseUrl }`을 export 하고 전역 axios 설정을 건다. **요청 래퍼가 없어서**
모든 호출이 같은 모양을 손으로 반복한다 — 템플릿 리터럴 URL + `localStorage`에서 읽은
`Authorization: Bearer <access_token>` 헤더.

- `baseUrl`은 `https://apimaimu.co.kr`로 **하드코딩**돼 있다. `src/` 어디에도 `process.env` 읽기가 없으므로
  로컬 백엔드를 붙이려면 이 파일을 직접 고쳐야 한다(고친 채로 커밋하지 않도록 주의).
- `axios.defaults.withCredentials = true` — 리프레시 토큰이 HttpOnly 쿠키라서 전역으로 켜 둔다.
- 응답 인터셉터가 백엔드의 `code === 'T-003'`(만료된 액세스 토큰)을 감지해
  `POST /v1/api/auth/reissue`를 호출하고, `localStorage.access_token`을 갈아끼운 뒤 1회 재시도한다(`_retry` 가드).
  **HTTP 상태가 아니라 에러 코드 문자열로 동작하므로**, 백엔드에서 `ErrorCode` 이름/코드를 바꾸면
  조용히 재인증이 깨진다.

### 사용 중인 엔드포인트

| 화면 | 호출 |
| --- | --- |
| LoginModal | `GET {baseUrl}/oauth2/authorization/{kakao\|naver\|google}` (페이지 이동) |
| MyPage | `POST /v1/api/member/join` (temp_token 사용) |
| MyPageEdit | `GET /v1/api/member/profile`, `PATCH /v1/api/member/edit`, `POST /v1/api/auth/logout` |
| Withdrawal | `DELETE /v1/api/member` |
| MainPage | `GET /v1/api/group/all`, `DELETE /v1/api/group/{id}` |
| Modal | `POST /v1/api/group`, `PATCH /v1/api/group/{id}` |
| DetailPage | `GET /v1/api/maimu/{groupId}/all?page=N`, `POST /v1/api/group/{groupId}/invitation` |
| CheckNote | `GET /v1/api/maimu/{maimuId}`, `PATCH /v1/api/maimu/{maimuId}/favorite` |
| WriteDetailPage | `GET /v1/api/guest/invitation/{token}` (비로그인) |
| WriteNote | `POST /v1/api/guest/{groupId}/{token}/add` (비로그인) |

## 인증 흐름 (프론트 쪽)

비밀번호 없이 소셜 로그인만 쓴다.

1. `LoginModal`이 브라우저를 `{baseUrl}/oauth2/authorization/{provider}`로 보낸다.
2. 백엔드가 `https://maimu.vercel.app/LoginHandler`로 쿼리 파라미터를 붙여 리다이렉트한다.
3. `LoginHandler`가 분기한다:
   - `?tempToken=` → 신규 회원(`PREMEMBER`). `localStorage.temp_token`에 저장 후 `/ProfileEdit`로.
   - `?accessToken=` → 기존 회원. `localStorage.access_token`에 저장 후 `/MainPage`로.
   - 둘 다 없으면 `/`로.
   두 경우 모두 `history.replaceState`로 주소창의 토큰을 지운다.
4. 가입 완료는 **`MyPage.js`**에서 일어난다. `POST /v1/api/member/join`을 *temp* 토큰으로 보내고,
   진짜 액세스 토큰을 **`accesstoken` 응답 헤더**(브라우저가 소문자로 바꾼다)에서 꺼내
   `access_token`에 저장한 뒤 `temp_token`을 지운다. 리프레시 토큰은 HttpOnly 쿠키로 자동 저장된다.

> `LoginModal`도 렌더될 때마다 URL에서 `tempToken`을 읽어 `localStorage`에 쓴다. 값이 없으면
> 문자열 `"null"`이 저장되는 남은 코드이고, 실제로 의미 있는 경로는 `LoginHandler`다.

게스트 경로는 토큰을 전혀 건드리지 않는다. `/WriteDetailPage/:token`이
`GET /v1/api/guest/invitation/{token}`으로 초대를 풀고, `WriteNote`가
`POST /v1/api/guest/{groupId}/{token}/add`로 쪽지를 남긴다.

## 화면 흐름

```
/ (StartPage)
  └ LoginModal → OAuth → /LoginHandler
        ├ 신규 → /ProfileEdit → /MyPage(가입 확정) → /MainPage
        └ 기존 → /MainPage

/MainPage  사물함 9칸 그리드 + LockerActionBar(추가/편집/삭제) + 프로필 아이콘 → /MyPageEdit
  └ 사물함 클릭 → /DetailPage/:groupName/:groupColor/:group_id
        ├ 마이무 클릭 → /LoadingPage → /CheckTaste → /CheckNote   (state로 maimuId 전달)
        └ 카카오 공유 / 링크 복사 → 초대 링크 발급

받는 사람(비로그인): /WriteDetailPage/:token → /WriteNote → /SendNote
```

- **사물함은 최대 9개.** `MainPage`가 항상 길이 9의 배열을 만들고 빈 칸을 채운다.
  개수 제한은 `MainPage.addButtonClick`과 `LockerActionBar`(`count >= 9`) 두 곳에 있다.
- `DetailPage`는 IntersectionObserver 기반 무한 스크롤이다(페이지당 18개). `hasMore`는
  `currentPage < totalPage - 1`로 계산한다.
- `MainPage`는 `popstate`를 가로채 뒤로 가기를 막는다.

## 백엔드와의 계약에서 자주 틀리는 것들

### 불리언 필드는 `is` 접두사가 **빠진 채로** 온다

백엔드 DTO의 `isRead` / `isFavorite` / `isAnonymous`는 Lombok + Jackson을 거치면서
JSON에서 `read` / `favorite` / `anonymous`가 된다. 응답을 읽을 땐 접두사 없는 이름을 쓴다.

```js
const { maimuId, maimuColor, sugarContent, read, favorite } = maimu;  // 맞음
setIsFavorite(response.data.favorite);                                 // 맞음 (isFavorite 아님)
```

요청을 보낼 때도 마찬가지다. `WriteNote`는 지금 `isAnonymous`라는 키로 보내고 있는데
백엔드 `GuestRequest`는 `anonymous`로 바인딩하므로 **이 값은 서버에 전달되지 않는다.**
다만 `WriteNote`가 익명일 때 `writerName`을 이미 `"익명"`으로 채워 보내기 때문에 결과적으로
화면상 문제가 드러나지 않는다. 익명 로직을 손대게 되면 이 부분부터 확인한다.

### 색상 이름이 두 체계로 갈린다

- **그룹(사물함) 색**은 한국어 문자열 그대로 저장·반환된다: `"핑크"`, `"노랑"`, `"초록"`.
  `Locker.js`, `DetailPage.getBackgroundColor`, `WriteDetailPage`가 이 문자열을 직접 switch 한다.
- **마이무(쪽지) 색**만 예외다. `WriteNote.mapColorToBackend`가 보내기 직전에 변환한다:
  `핑크 → RED`, `노랑 → YELLOW`, `초록 → GREEN`. 응답으로는 `RED`/`YELLOW`/`GREEN`이 오고
  `DetailMaimu`가 그걸로 SVG를 고른다.
- **핑크가 RED로 매핑된다는 불일치를 기억할 것.** 색을 추가하려면 `ColorDropdown`,
  `TasteDropdown`, 모든 switch 문, SVG 세트, 그리고 이 매핑 함수를 전부 손대야 한다.

### 에러 표시

에러 응답은 `{ code, message, method, requestURI }`이고 `message`가 한국어다.
모든 화면이 `error.response.data.message`를 `react-toastify`로 띄우고, 없으면
`"서버 오류가 발생했습니다."`로 폴백한다. 새 화면도 이 패턴을 따른다.

주의: 백엔드 `ErrorCode`에 코드 중복이 있다(`G-001`이 그룹 없음과 일반 오류에,
`M-001`이 닉네임 중복과 마이무 없음에 동시에 쓰인다). **`code` 값으로 분기하지 말 것.**
유일하게 코드로 분기해도 되는 곳은 인터셉터의 `T-003`이다.

## 하드코딩된 값들

소스에 박혀 있어서 환경을 바꾸려면 코드를 고쳐야 하는 것들:

- `src/api/api.js` — `baseUrl = "https://apimaimu.co.kr"`
- `src/pages/DetailPage/DetailPage.js` — 카카오 JavaScript 키(`kakao.init(...)`)와 공유 썸네일 URL.
  카카오 JS 키는 도메인 화이트리스트로 보호되는 공개 키지만, 새로 넣을 땐 `.env`를 쓰는 쪽이 낫다.
- 백엔드는 반대로 `https://maimu.vercel.app`을 OAuth 리다이렉트 대상 / CORS 허용 오리진으로
  하드코딩하고 있다. 호스트를 바꾸려면 **두 저장소를 같이** 고쳐야 한다.

## 저장소 상태

- 기본 브랜치는 `master`, 현재 체크아웃은 `develop`. 원격에 `master`, `develop`.
- **`develop` 이 `master` 보다 훨씬 앞서 있다.** UI/UX 전면 개편이 `develop` 에만 있다.
  Vercel 프로덕션(`maimu.vercel.app`)이 어느 브랜치를 보는지 확인이 필요하다.
- `.omc/`, `.serena/` 는 에이전트 도구 산출물이다. 커밋하지 않는다
  (`.gitignore` 에 항목이 없으니 stage 할 때 직접 걸러낸다).

### 최근 개편에서 잡은 것들 (같은 실수 반복 방지)

- **흐름 의존 매직 오프셋**: `position: relative` + `top: -486px` 같은 값으로 요소를
  끌어올리던 곳이 7군데였다. 아래 콘텐츠 높이가 조금만 달라져도 통째로 어긋난다.
  전부 컨테이너 기준 절대 좌표로 바꿨다. **이 패턴을 새로 만들지 말 것.**
- **`overscroll-behavior: contain`**: 스크롤 컨테이너가 자기 내용이 짧아 스크롤할 게
  없을 때, 이 속성이 부모로의 스크롤 전달까지 막아 **터치 스크롤이 통째로 죽는다.**
  게스트 화면에서 실제로 발생했다. 쓰지 말 것.
- **모달 z-index**: 본문 요소(배지 5, 액션바 20)보다 낮으면 모달을 뚫고 나온다.
  모달·팝오버는 1000 이상.
- **`font-family: Inter`** 를 폴백 없이 쓰면 한글이 시스템 기본 글꼴로 떨어진다.
  반드시 Pretendard 를 포함한 스택으로 쓴다.
- **CSS 가 DOM 상태를 추측하게 하지 말 것**: `:has(.X:not(:empty))` 로 빈 칸을
  판별하려다 채워진 칸까지 흐려졌다. 컴포넌트가 클래스를 명시적으로 붙인다
  (`Locker` 의 `isEmpty`).

### 로그인 없이 화면 확인하기

`public/preview-mock.js`는 백엔드·계정 없이 로그인 이후 화면을 보기 위한 목 스크립트다.
개발 서버를 띄운 뒤 콘솔에 파일 내용을 붙여넣고 `maimuPreview('/MainPage')` 식으로 이동한다.
새로고침하면 원상복구된다. 소스는 건드리지 않는 도구이므로 이 파일을 import 하지 않는다.

## 커밋 컨벤션

`feat:`, `fix:`, `style:`, `docs:`, `refactor:`, `chore:`
(실제 히스토리는 대문자 `Fix : …` / `Refactor : …` 변형을 많이 쓴다.)
커밋 메시지와 사용자 노출 문구는 한국어로 쓴다.
