'use client';

// TODO : 언어별 자간 설정
import { useCallback, useEffect, useRef, useState } from 'react';

interface HeaderNavProps<T extends string> {
  tabs: readonly T[];
  activeTab: T;
  onTabChange: (tab: T) => void | Promise<URLSearchParams>;
}

export const HeaderNav = <Tab extends string>({
  tabs,
  activeTab,
  onTabChange,
}: HeaderNavProps<Tab>) => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const controlNavbar = useCallback(() => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY.current && currentScrollY > 10) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }

    lastScrollY.current = currentScrollY;
    ticking.current = false;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(controlNavbar);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [controlNavbar]);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 mx-auto h-16 max-w-120 bg-white px-4 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav className="flex h-full items-center justify-between">
        <div className="flex items-end gap-5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex flex-col items-center pb-2"
              >
                <span
                  className={`text-xl font-bold transition-colors duration-200 ${
                    isActive
                      ? 'font-black text-black'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                </span>
                <div
                  className={`absolute bottom-0 h-0.5 w-full bg-black transition-opacity duration-200 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
