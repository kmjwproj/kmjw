# kmjw 구현 계획

## 탐색 화면 (feat/7)

설계 문서: `~/.gstack/projects/kmjwproj-kmjw/hanseungheon-feat-7-design-20260419-233913.md`

### 목표

취향 태그(aesthetic_tags) overlap 기반 탐색 화면. 겹치는 태그 ≥ 2개인 프로필을 overlap 수 내림차순으로 노출.

### 구현 단계

| #   | 작업                                      | 파일                                   | 상태 |
| --- | ----------------------------------------- | -------------------------------------- | ---- |
| 1   | Supabase 스키마 마이그레이션              | `supabase/migrations/`                 | ⬜   |
| 2   | 온보딩 TagsStep 추가 (4/5번째)            | `app/onboard/`                         | ⬜   |
| 3   | 온보딩 GenderStep (gender, target_gender) | `app/onboard/BasicInfoStep.tsx`        | ⬜   |
| 4   | API 업데이트 (onboard + profile PUT)      | `app/api/onboard/`, `app/api/profile/` | ⬜   |
| 5   | Supabase RPC — `get_explore_profiles`     | `supabase/migrations/`                 | ⬜   |
| 6   | `/api/explore` 라우트 생성                | `app/api/explore/route.ts`             | ⬜   |
| 7   | 탐색 화면 목업 → 실제 데이터 연결         | `src/screens/explore/index.tsx`        | ⬜   |
| 8   | 빈 상태 처리                              | `src/screens/explore/index.tsx`        | ⬜   |
| 9   | 시드 데이터 스크립트                      | `scripts/seed-explore.ts`              | ⬜   |

### 스키마 마이그레이션 (Step 1)

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS aesthetic_tags text[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS target_gender text;

CREATE INDEX IF NOT EXISTS profiles_aesthetic_tags_gin
  ON profiles USING GIN (aesthetic_tags);
```

### RPC — `get_explore_profiles` (Step 5)

```sql
CREATE OR REPLACE FUNCTION get_explore_profiles(
  p_user_id       uuid,
  p_tags          text[],
  p_my_gender     text,
  p_target_gender text
)
RETURNS TABLE (
  id            uuid,
  nickname      text,
  age_range     text,
  profile_image text,
  aesthetic_tags text[],
  overlap_count int
)
LANGUAGE sql STABLE AS $$
  SELECT
    p.id, p.nickname, p.age_range, p.profile_image, p.aesthetic_tags,
    cardinality(
      ARRAY(SELECT unnest(p.aesthetic_tags) INTERSECT SELECT unnest(p_tags))
    ) AS overlap_count
  FROM profiles p
  WHERE p.id <> p_user_id
    AND p.gender = p_target_gender
    AND (p.target_gender = 'any' OR p.target_gender = p_my_gender)
    AND p.aesthetic_tags && p_tags
    AND cardinality(
          ARRAY(SELECT unnest(p.aesthetic_tags) INTERSECT SELECT unnest(p_tags))
        ) >= 2
  ORDER BY overlap_count DESC
  LIMIT 50;
$$;
```

### 미결 사항

1. 일본 사용자 가입 경로 — 현재 UI 한국어 전용. Line OAuth는 커버 가능하나 번역 미정.
2. `FILTER_TAGS` 관리 — 현재 하드코딩. MVP 이후 CMS 전환 여부.
3. 매칭 액션 — 탐색에서 "좋아요" 시 matches 테이블 필요 여부.

---

## 피드 추천 알고리즘

### 목표

홈 피드 "추천" 탭: 나와 interests가 겹치는 사용자를 overlap 수 + 부스터 점수 기준으로 정렬해 노출.

### 점수 공식

```
score = overlap_count + 신규 유저 부스터 + 최근 활동 부스터
```

| 요소                        | 값   | 이유                            |
| --------------------------- | ---- | ------------------------------- |
| interests overlap 1개       | +1.0 | 기본 점수                       |
| 신규 가입 (7일 이내)        | +1.5 | 새 가입자 노출 보장 — 이탈 방지 |
| 최근 프로필 수정 (3일 이내) | +0.5 | 활성 유저 신호                  |

### RPC — `get_feed_recommendations`

```sql
CREATE OR REPLACE FUNCTION get_feed_recommendations(
  p_user_id       uuid,
  p_interests     text[],
  p_my_gender     text,
  p_target_gender text,
  p_limit         int DEFAULT 20
)
RETURNS TABLE (
  id            uuid,
  nickname      text,
  age_range     text,
  profile_image text,
  interests     text[],
  overlap_count int,
  score         float
)
LANGUAGE sql STABLE AS $$
  SELECT
    p.id, p.nickname, p.age_range, p.profile_image, p.interests,
    cardinality(
      ARRAY(SELECT unnest(p.interests) INTERSECT SELECT unnest(p_interests))
    ) AS overlap_count,
    cardinality(
      ARRAY(SELECT unnest(p.interests) INTERSECT SELECT unnest(p_interests))
    )::float
    + CASE WHEN p.created_at > now() - interval '7 days' THEN 1.5 ELSE 0 END
    + CASE WHEN p.updated_at > now() - interval '3 days' THEN 0.5 ELSE 0 END
    AS score
  FROM profiles p
  WHERE p.id <> p_user_id
    AND p.gender = p_target_gender
    AND (p.target_gender = 'any' OR p.target_gender = p_my_gender)
    AND p.interests && p_interests
  ORDER BY score DESC
  LIMIT p_limit;
$$;
```

> likes/skips 테이블 구현 후 아래 조건 추가:
>
> ```sql
> AND p.id NOT IN (
>   SELECT target_id FROM likes WHERE user_id = p_user_id
>   UNION
>   SELECT target_id FROM skips WHERE user_id = p_user_id
> )
> ```

### API 라우트 — `/api/feed/recommendations`

```typescript
// app/api/feed/recommendations/route.ts
export async function GET() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('interests, gender, target_gender')
    .eq('user_id', user.id)
    .single();

  const { data } = await supabase.rpc('get_feed_recommendations', {
    p_user_id: user.id,
    p_interests: profile.interests ?? [],
    p_my_gender: profile.gender,
    p_target_gender: profile.target_gender,
  });

  return NextResponse.json(data);
}
```

### 구현 단계

| #   | 작업                                | 파일                                    | 상태 |
| --- | ----------------------------------- | --------------------------------------- | ---- |
| 1   | `interests` GIN 인덱스 추가         | `supabase/migrations/`                  | ⬜   |
| 2   | RPC `get_feed_recommendations` 생성 | `supabase/migrations/`                  | ⬜   |
| 3   | `/api/feed/recommendations` 라우트  | `app/api/feed/recommendations/route.ts` | ⬜   |
| 4   | 피드 화면 목업 → 실제 데이터 연결   | `src/screens/feed/index.tsx`            | ⬜   |

### 탐색 vs 피드 비교

|              | 탐색 화면        | 피드 추천            |
| ------------ | ---------------- | -------------------- |
| 기준 컬럼    | `aesthetic_tags` | `interests`          |
| 최소 overlap | ≥ 2              | ≥ 1                  |
| 부스터       | 없음             | 신규 +1.5, 활동 +0.5 |
| 정렬         | overlap DESC     | score DESC           |
| 성격         | 취향/미적 매칭   | 라이프스타일 매칭    |

두 RPC는 같은 패턴. 탐색 화면 migration 작업 시 `interests` GIN 인덱스도 함께 추가하면 좋음.

---

## 미결 사항 (전체)

- [ ] likes / skips 테이블 설계
- [ ] 매칭(양방향 좋아요) 로직
- [ ] 일본어 번역 레이어
- [ ] `FILTER_TAGS` CMS 전환
- [ ] interests IDF 가중치 (사용자 100명 이후)
