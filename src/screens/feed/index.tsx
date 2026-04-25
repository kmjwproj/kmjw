'use client';

import Image from 'next/image';

import { HeaderNav } from '@/src/widgets/header-nav';
import { parseAsStringLiteral, useQueryState } from 'nuqs';

// 1. 데이터 배열 (나중에 이 부분에 API 데이터를 연결하면 됩니다)
const FEED_DATA = [
  {
    id: 1,
    name: '닝닝',
    age: 24,
    bio: '하이',
    location: '중국 하얼빈',
    image: '/ning.png',
  },
  {
    id: 2,
    name: '지수',
    age: 26,
    bio: '반가워요!',
    location: '서울 강남구',
    image: '/ning.png',
  },
  {
    id: 3,
    name: '제니',
    age: 25,
    bio: 'Hello World',
    location: '서울 용산구',
    image: '/ning.png',
  },
  {
    id: 4,
    name: '로제',
    age: 24,
    bio: '음악이 좋아요',
    location: '호주 멜버른',
    image: '/ning.png',
  },
  {
    id: 5,
    name: '리사',
    age: 24,
    bio: '춤추는 게 제일 즐거워요',
    location: '태국 방콕',
    image: '/ning.png',
  },
];

const FEED_TABS = ['추천', '인기'] as const;
// const FEED_TABS = ['추천', '인기', '실시간'] as const;

export const FeedScreen = () => {
  const [activeTab, setActiveTab] = useQueryState(
    'tab',
    parseAsStringLiteral(FEED_TABS).withDefault(FEED_TABS[0]),
  );

  return (
    <>
      <HeaderNav
        tabs={[...FEED_TABS]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="flex min-h-screen flex-col items-center gap-y-4">
        {FEED_DATA.map((item) => (
          <FeedBox key={item.id} feed={item} />
        ))}
      </div>
    </>
  );
};

interface FeedItem {
  id: number;
  name: string;
  age: number;
  bio: string;
  location: string;
  image: string;
}

const FeedBox = ({ feed }: { feed: FeedItem }) => {
  return (
    <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-xl shadow-md">
      {/* 1. 배경 이미지 */}
      <Image
        fill
        src={feed.image}
        alt={`${feed.name}의 프로필 이미지`}
        className="object-cover"
        priority={feed.id === 1}
      />

      {/* 2. 오버레이 컨텐츠 */}
      <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/90 via-black/20 to-transparent p-4 text-white">
        {/* 이름과 나이: 시각적 정렬 보정 */}
        <h2 className="-ml-0.5 text-3xl font-extrabold tracking-tighter">
          {feed.name}, {feed.age}
        </h2>

        {/* 정보 텍스트 */}
        <p className="mt-2 text-base leading-tight font-medium opacity-90">
          {feed.bio}
        </p>
        <div className="mt-1 flex items-center gap-1.5 text-sm font-bold opacity-70">
          <span>{feed.location}</span>
        </div>

        {/* 3. 하단 버튼 영역 (수정됨) */}
        <div className="mt-6 flex gap-3">
          {/* Skip 버튼: 더 밝고 투명한 유리 느낌 (Glassmorphism) */}
          <button className="flex-1 rounded-xl border border-white/10 bg-white/20 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/30 active:scale-95">
            Skip
          </button>

          {/* 좋아요 버튼: 채도를 살짝 낮춘 세련된 핑크 */}
          <button className="flex-1 rounded-xl bg-pink-600 py-4 text-sm font-bold text-white shadow-lg shadow-pink-900/20 transition hover:bg-pink-500 active:scale-95">
            좋아요
          </button>
        </div>
      </div>
    </div>
  );
};
