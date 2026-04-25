'use client';

import { useState } from 'react';

import { BottomTabBar } from '@/src/widgets/bottom-tab-bar';
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  SlidersHorizontal,
  X,
} from 'lucide-react';

// 1. 태그 데이터를 조금 더 한국적인 정서와 트렌드에 맞게 수정
const FILTER_TAGS = [
  '#전체', // 전체보기 추가
  '#오사카여자',
  '#갸루',
  '#교토감성',
  '#도쿄시티팝',
  '#카페투어',
  '#빈티지룩',
  '#한큐라인',
  '#심야드라이브',
  '#직장인', // 추가 예시
  '#집순이', // 추가 예시
] as const;

// 2. 카드의 색상을 더 부드럽고 설레는 파스텔톤으로 변경 (실제로는 사진이 배경이 됩니다)
const EXPLORE_CARDS = [
  {
    id: 1,
    name: '미오',
    age: 24,
    location: '오사카 난바',
    bio: '갸루 무드 좋아하고 새벽 드라이브 자주 가요.',
    tags: ['#오사카여자', '#갸루', '#심야드라이브'],
    accent: 'bg-rose-50', // 부드러운 핑크
  },
  {
    id: 2,
    name: '유나',
    age: 23,
    location: '교토 가와라마치',
    bio: '조용한 카페랑 필름톤 사진 좋아해요.',
    tags: ['#교토감성', '#카페투어', '#빈티지룩'],
    accent: 'bg-amber-50', // 따뜻한 옐로우
  },
  {
    id: 3,
    name: '레이',
    age: 25,
    location: '도쿄 시부야',
    bio: '시티팝 들으면서 편집숍 도는 게 취미예요.',
    tags: ['#도쿄시티팝', '#빈티지룩', '#갸루'],
    accent: 'bg-sky-50', // 상쾌한 블루
  },
  {
    id: 4,
    name: '사쿠라',
    age: 22,
    location: '요코하마',
    bio: '직장인이에요. 주말엔 서핑 가요!',
    tags: ['#직장인', '#서핑', '#요코하마'],
    accent: 'bg-emerald-50', // 싱그러운 그린
  },
];

export const ExploreScreen = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // 필터 확장 상태

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  };

  const filteredCards =
    selectedTags.length === 0
      ? EXPLORE_CARDS
      : EXPLORE_CARDS.filter((card) =>
          selectedTags.some((tag) => card.tags.includes(tag)),
        );

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* --- 상단 고정 필터 바 --- */}
      <header className="sticky top-0 z-20 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="px-5 py-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex w-full items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                <SlidersHorizontal size={16} />
              </div>
              <div className="text-left">
                <h1 className="text-sm font-bold text-zinc-950">취향 필터</h1>
                <p className="text-[11px] text-zinc-500">
                  {selectedTags.length > 0
                    ? `${selectedTags.length}개의 태그 선택됨`
                    : '태그를 선택해 취향을 찾아보세요'}
                </p>
              </div>
            </div>
            {isFilterOpen ? (
              <ChevronUp size={20} className="text-zinc-400" />
            ) : (
              <ChevronDown size={20} className="text-zinc-400" />
            )}
          </button>

          {/* --- 펼쳐지는 필터 영역 --- */}
          <div
            className={`grid transition-all duration-300 ease-in-out ${isFilterOpen ? 'mt-5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
          >
            <div className="overflow-hidden">
              <div className="flex flex-wrap gap-2 pb-2">
                {FILTER_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        isSelected
                          ? 'border-rose-500 bg-rose-500 text-white'
                          : 'border-zinc-200 bg-white text-zinc-600 active:scale-95'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="mt-3 flex items-center gap-1 text-[11px] font-bold text-rose-500 underline underline-offset-4"
                >
                  필터 초기화
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 선택된 태그 요약 (필터가 닫혀있을 때만 노출) */}
        {!isFilterOpen && selectedTags.length > 0 && (
          <div className="scrollbar-hide flex gap-1.5 overflow-x-auto px-5 pb-3">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-zinc-900 px-2.5 py-1 text-[10px] font-bold whitespace-nowrap text-white"
              >
                {tag}
                <X
                  size={10}
                  onClick={() => toggleTag(tag)}
                  className="cursor-pointer"
                />
              </span>
            ))}
          </div>
        )}
      </header>

      {/* --- 컨텐츠 그리드 (LayoutGrid 컨셉) --- */}
      <main className="mt-4 px-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredCards.map((card) => (
            <article
              key={card.id}
              className="group relative aspect-[3/4] overflow-hidden rounded-[24px] border border-zinc-100 bg-zinc-100 transition-transform active:scale-[0.98]"
            >
              {/* 이미지 영역 (Dicebear로 대체) */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `url('https://api.dicebear.com/8.x/avataaars/svg?seed=${card.name}')`,
                }}
              />

              {/* 그라디언트 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* 하단 정보 */}
              <div className="absolute bottom-0 w-full p-3.5 text-white">
                <div className="flex items-center gap-1">
                  <h3 className="text-base font-bold">{card.name}</h3>
                  <span className="text-sm opacity-90">{card.age}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-[10px] opacity-80">
                  <MapPin size={10} />
                  <span className="truncate">{card.location}</span>
                </div>

                {/* 태그 (최대 1개만 노출해서 깔끔하게) */}
                <div className="mt-2 flex gap-1">
                  <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[9px] font-medium backdrop-blur-md">
                    {card.tags[0]}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredCards.length === 0 && (
          <div className="py-20 text-center text-zinc-400">
            <p className="text-sm">선택하신 조건에 맞는 사람이 없어요 🥲</p>
          </div>
        )}
      </main>
      <BottomTabBar />
    </div>
  );
};
