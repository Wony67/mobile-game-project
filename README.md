# 풍운 · Flight study

《텐가이(Sengoku Blade)》의 횡스크롤 슈팅 조작을 단계적으로 연구하는 Phaser 3 + TypeScript + Vite 프로토타입입니다. 현재 단계는 이동과 발사만 구현합니다. 원작의 이미지·사운드를 사용하지 않으며 캐릭터, 배경, 탄환 모두 Phaser Graphics로 생성합니다.

## 실행

Node.js 22.12 이상과 npm이 필요합니다. 현재 검증 환경은 Node.js 24.22.1입니다.

```sh
npm ci
npm run dev
```

클라우드에서 기본 npm 캐시에 쓸 수 없는 경우 `npm ci --cache /tmp/mobile-game-npm-cache`를 사용합니다. 개발 서버 기본 포트는 5173입니다.

```sh
npm run build   # TypeScript 검사 후 dist/ 생성
npm run preview # 프로덕션 산출물 확인, 기본 포트 4173
```

`dist/`는 정적 호스팅할 수 있습니다. 상대 경로(`base: './'`)를 사용해 추후 Android WebView/Capacitor 패키징을 고려했습니다. APK 패키징과 Android SDK 설정은 아직 구현하지 않았습니다.

## 조작

- 방향키: 상하좌우 이동. 대각선 이동 속도를 정규화하고 캐릭터 전체가 화면 안에 있도록 제한합니다.
- Space 또는 Z / FIRE 버튼: 누르는 동안 140ms 간격으로 오른쪽 발사.
- 화면 아래 방향 버튼: 마우스·터치 이동. 이동과 사격의 멀티터치를 지원합니다.
- 포커스를 잃거나 탭이 숨겨지면 입력을 초기화합니다.

게임 좌표는 960×540으로 고정되며 화면 크기에 맞춰 비율을 유지합니다. 세로 모바일 화면에서도 가로 게임 영역을 표시합니다. 전체 화면이나 방향 강제 고정은 적용하지 않습니다. 적, 피격·충돌, 점수, 성장 시스템은 없습니다.

## 구조

```text
src/main.ts                   Phaser 시작 및 화면 크기 설정
src/game/settings.ts          이동·발사 상수
src/game/input/Controls.ts    키보드·포인터 입력과 정리
src/game/entities/Player.ts   임시 캐릭터, 이동·경계 제한
src/game/entities/Bullet.ts   탄환 이동·제거와 연사 관리
src/game/scenes/GameScene.ts  게임 루프
src/game/scenes/landscape.ts  임시 배경
src/style.css                 반응형 페이지와 터치 버튼
```

## 브라우저 테스트

```sh
npm test
```

Playwright가 개발 서버를 시작하고 실제 Chromium의 Canvas 렌더러에서 렌더링, 이동·정지·대각선 속도, 네 방향 경계, Space/Z 발사·연사·탄환 제거, 모바일 너비의 포인터 버튼을 검사합니다. 스크린샷은 무시되는 `test-results/`에 저장됩니다. 개발 모드에만 게임 인스턴스 검사 도우미가 노출되며 프로덕션 빌드에서는 제거됩니다.

기본 브라우저 경로는 `/usr/bin/chromium`입니다. 다른 환경에서는 `CHROMIUM_PATH=/path/to/chromium npm test`로 지정하세요. Playwright 브라우저를 설치한 경우 해당 실행 파일 경로를 지정할 수 있습니다. 실제 모바일 기기와 Android APK는 별도 검증 대상입니다.

## 알려진 제한

Phaser 엔진을 포함한 단일 JS 번들 때문에 Vite의 500kB 청크 경고가 발생합니다. 현재 기능에는 영향이 없으며 추후 초기 로딩 최적화 대상입니다. 외부 서비스나 비밀키는 필요하지 않습니다.

## 이번 단계 검증 결과

- `npm ci --cache /tmp/mobile-game-npm-cache`: 잠금 파일 기반 재설치 성공.
- `npm run build`: TypeScript 검사와 프로덕션 빌드 성공(청크 크기 경고 있음).
- `npm test`: Chromium Canvas 브라우저 검사 5개 통과.
- 클라우드 소프트웨어 WebGL에서는 낮은 프레임 속도로 시간 기반 검사 4개가 실패했습니다. Canvas 재검사는 모두 통과했으며 실제 GPU의 WebGL 성능은 미검증입니다.
- 실제 모바일 터치·멀티터치, Android APK와 기기별 성능은 미검증입니다. 모바일 너비의 브라우저 포인터 조작은 통과했습니다.
- `npm run preview -- --port 4173 --strictPort`: 프로덕션 HTTP 200, 960×540 Canvas 생성, 브라우저 오류·리소스 실패 없음, 개발용 검사 도우미 제거 확인.
