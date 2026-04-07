# Supabase Auth 구현 Roadmap (MCP 활용 버전)

## 개요
- **목표**: Kakao, Google, X(Twitter), Line OAuth 프로바이더를 사용한 Supabase Auth 구현.
- **현재 상태**: 
  - Next.js 16.2.1 프로젝트.
  - Supabase MCP 서버 설정됨 (access-token: sbp_fd5cfe43e2d662b023feb60ac24f8f45cc9e3cf1).
  - Supabase SDK 미설치.
  - PRD 문서 비어있음.

## Supabase MCP 서버 활용
- MCP 서버를 통해 Supabase 프로젝트 정보 자동 추출 (URL, Anon Key).
- 명령 예시 (MCP 클라이언트 또는 CLI 연동):
  1. Supabase CLI 설치: `pnpm add -D supabase@latest`
  2. `supabase link --project-ref sbp_fd5cfe43e2d662b023feb60ac24f8f45cc9e3cf1`
  3. `supabase projects:get` 로 URL/Key 확인.
- 또는 MCP 서버 직접 쿼리 (에이전트 도구 활용).

## 단계별 계획

### 1. 준비 단계 (PM/Architect, MCP 활용)
- MCP/CLI로 프로젝트 정보 확인 및 `.env.local` 자동 설정:
  ```
  NEXT_PUBLIC_SUPABASE_URL=$(supabase projects:get --project-ref sbp_... | jq .url)
  NEXT_PUBLIC_SUPABASE_ANON_KEY=$(supabase projects:get --project-ref sbp_... | jq .anon_key)
  ```
- 최신 Dependencies 설치:
  ```
  pnpm add @supabase/supabase-js@latest @supabase/auth-ui-react@latest @supabase/auth-ui-shared@latest lucide-react@latest
  pnpm add -D supabase@latest  # CLI for MCP/관리
  ```
- Supabase 클라이언트 생성 스크립트 자동화.

### 2. Provider 설정 (Manual - Dashboard, MCP 보조)
- MCP로 Auth providers 목록 확인: `supabase auth providers:list`
- Dashboard 또는 MCP로 provider 활성화 (Google, Kakao, Twitter).
- Line: Custom (Edge Function MCP 생성 가능).

### 3. 구현 단계 (Code)
- `lib/supabase.ts` 최신 클라이언트 인스턴스.
- Auth Provider 추가.
- Custom signInWithOAuth for each provider.
- Middleware, Session.

### 4. 테스트 및 배포
- MCP로 테스트 데이터 생성/관리.
- RLS 등 보안 설정 MCP 자동화.

## 타임라인 추정
- 준비 (MCP 자동화): 0.5일
- Provider: 2일
- 구현: 3일
- 테스트: 1.5일
- **총 1주**

## 다음 액션
- Supabase CLI 설치 및 MCP 연동 테스트.
- Architect 모드 전환.
