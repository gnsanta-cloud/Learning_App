# 중1 학습 PWA

중학교 1학년 **기술·가정 ①**(천재교육) · **도덕 ①**(비상교육) 학습용 Progressive Web App입니다.

## 기능

- 과목별 단원·소단원 탐색
- 핵심 개념 요약 및 키워드
- 단원별 퀴즈 (정답 해설 포함)
- 학습 진도 저장 (브라우저 localStorage)
- **연속 학습(streak)** — 퀴즈·완료 시 일별 기록
- **시험 범위 체크리스트** — 과목별 복습 항목
- **다크 모드** — 라이트 / 다크 / 시스템
- PWA 설치 · 오프라인 캐시 (Service Worker)

## 실행 방법

```bash
npm install
node scripts/generate-pwa-icons.mjs
npm run dev
```

브라우저에서 `http://localhost:5173` 을 엽니다.

### 프로덕션 빌드

```bash
npm run build
npm run preview
```

`dist` 폴더를 정적 호스팅(GitHub Pages, Netlify, Vercel 등)에 배포하면 됩니다. **HTTPS** 환경에서 PWA 설치가 가능합니다.

### GitHub Pages 자동 배포

1. GitHub에 저장소 생성 후 push (`Learning_App` 권장)
2. 저장소 **Settings → Pages → Build and deployment** 에서 Source를 **GitHub Actions** 로 설정
3. `main` 브랜치에 push하면 `.github/workflows/deploy.yml` 이 빌드·배포
4. 접속 URL: `https://gnsanta-cloud.github.io/Learning_App/`

**저장소:** [github.com/gnsanta-cloud/Learning_App](https://github.com/gnsanta-cloud/Learning_App)

최초 push (GitHub CLI):

```bash
gh auth login
gh repo create Learning_App --public --source=. --remote=origin --push
```

로컬에서 GitHub Pages 경로를 맞춰 보려면:

```bash
npm run preview:pages
```

또는:

```bash
npm run build
npm run preview
```

배포 URL: **https://gnsanta-cloud.github.io/Learning_App/**

## 앱 설치 (모바일·PC)

- **Chrome/Edge**: 주소창 오른쪽 「설치」 또는 메뉴 → 「앱 설치」
- **Safari (iOS)**: 공유 → 「홈 화면에 추가」

## 프로젝트 구조

```
src/
  data/subjects.ts   # 과목·단원·퀴즈 데이터
  pages/             # 화면
  hooks/useProgress.ts
docs/
  학습자료_취합.md   # 출판사 자료 링크 정리
```

## 참고

- 교과서 본문·출판사 PDF는 포함하지 않습니다.
- 공식 자료는 T셀파(천재), 비바샘(비상) 링크로 연결합니다.
