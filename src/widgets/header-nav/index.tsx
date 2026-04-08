'use client';

// // TODO 탭 쿼리파라미터랑 연동
// // nuqs 기반으로다가
import { useEffect, useState } from 'react';

export const HeaderNav = () => {
  const [activeTab, setActiveTab] = useState('オススメ');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const tabs = ['オススメ', '足あと', '相手から'];

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      // 1. 스크롤을 아래로 내리면 사라짐 (최소 10px 이상 스크롤 시 동작)
      if (currentScrollY > lastScrollY && currentScrollY > 10) {
        setIsVisible(false);
      }
      // 2. 스크롤을 위로 올리면 다시 나타남
      else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 mx-auto flex h-16 max-w-120 items-center justify-between bg-white px-4 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'} `}
    >
      <div className="flex items-end gap-5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative flex flex-col items-center"
            >
              <span
                className={`text-xl font-bold ${isActive ? 'font-black text-black' : 'text-gray-400'}`}
              >
                {tab}
              </span>
              {isActive && (
                <div className="animate-in fade-in absolute -bottom-2 h-0.5 w-full bg-black duration-200" />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
