# 착수 게이트 기록

착수 게이트는 두 단계다(CLAUDE.md · [plan.md](plan.md) §2).

- **웹 선확인 (T-W0)** — C-3 래퍼 2건. Phase 1~3의 전제. **완료(2026-09-05)**
- **C-19 게이트 (T-G1 · T-G2)** — NativeWind v5 9항목. Phase 5 착수 전에만 필요하다. **미착수**

---

## 웹 선확인 (T-W0) — 완료

- 일자: 2026-09-05
- 환경: Windows 11 / node 22.12.0 / pnpm 10.28.1 / vite 8.2.2 / tailwindcss 4.3.3 / `@tailwindcss/vite` 4.3.3
- 확인 대상: `apps/verify-vite`. 소비자 전역 CSS는 `src/index.css` 한 파일
- 판정 수단: `pnpm build` 산출 CSS(`dist/assets/*.css`) 문자열 검사

### (1) `@import "@eeennsu/web/themes/base.css"` 한 줄로 tailwindcss 가 web 패키지 peer 로 해석되는가

**통과.** 소비자 CSS가 다음 한 줄뿐인 상태에서 빌드가 성공하고 산출 CSS에 preflight · 토큰 변수 · DS 유틸리티가 모두 들어간다.

```css
@import "@eeennsu/web/themes/base.css";
```

| 확인 항목 | 결과 |
|---|---|
| 빌드 | 성공 (8,141 bytes) |
| preflight 리셋 `*,:after,:before,::backdrop` | 1회 |
| 토큰 `:root` · `.dark` · `@media` 3블록 | `--bg-brand:` 3회 = 3블록 전부 존재 |
| DS 유틸리티 (`bg-canvas` · `text-fg` · `text-md` · `p-4`) | 각 1회 |

pnpm 의 격리된 `node_modules` 레이아웃에서도 래퍼 안의 `@import "tailwindcss"` 가 해석됐다. 소비자는 `tailwindcss` 를 자기 의존성으로 갖고 있고(peer), 래퍼는 그것을 찾아간다.

### (2) 소비자 CSS 에 이미 `@import "tailwindcss"` 가 있을 때 중복 출력이 되는가

**부분 중복. 문제 없음 — 래퍼를 그대로 둔다.**

소비자 CSS를 두 줄로 두고(`@import "tailwindcss";` 다음 줄에 래퍼) 다시 빌드하면:

| 확인 항목 | 한 줄(정본) | 두 줄(중복) |
|---|---|---|
| 산출 CSS 크기 | 8,141 B | 8,382 B (+241) |
| preflight 리셋 `*,:after,:before,::backdrop` | 1회 | 1회 |
| DS 유틸리티 `.bg-canvas{` | 1회 | 1회 |
| `::placeholder` 규칙 | 3회 | 5회 |

중복되는 것은 preflight 안의 `@supports … ::placeholder` 블록 한 쌍뿐이다(+241 B). 주 리셋 블록과 유틸리티는 중복되지 않는다. 값이 동일한 선언이 두 번 나오는 것이라 캐스케이드 결과가 바뀌지 않는다.

**결정**: 래퍼에서 `@import "tailwindcss"` 를 빼지 않는다. C-3 "import 한 줄" 을 그대로 유지하고 T-T2 래퍼 템플릿도 바꾸지 않는다. 스펙이 허용한 대체안(래퍼에서 빼고 소비자에게 순서를 요구)은 쓰지 않는다.

### 남는 것

- 게이트 (8)에서 native 래퍼에 대해 같은 질문을 다시 확인한다. NativeWind v5 문서의 `global.css` 구성이 웹과 다르기 때문이다(§9 S-5, 보류 항목)

---

## C-19 게이트 (T-G1 · T-G2) — 미착수

Phase 5(native) 착수 전에만 필요하다. 9항목은 [plan.md](plan.md) §2.2에 있다. 웹(Phase 1~3)은 이 게이트와 무관하게 진행한다.

- Phase 5 착수일: 미정
