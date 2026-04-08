'use client';

import { useState } from 'react';

import { HeaderNav } from '@/src/widgets/header-nav';

export default function MessagesScreen() {
  // 메시지 화면 전용 탭
  const messageTabs = ['전체', '보낸 메시지', '받은 메시지'];
  const [activeTab, setActiveTab] = useState('전체');

  return (
    <>
      {/* 이 페이지 전용 헤더 설정 */}
      <HeaderNav
        tabs={messageTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex flex-col items-center justify-center pt-20">
        <p className="text-zinc-400">{activeTab} 리스트가 없습니다.</p>
      </div>
    </>
  );
}
