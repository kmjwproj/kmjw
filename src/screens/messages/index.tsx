'use client';

import { HeaderNav } from '@/src/widgets/header-nav';
import { parseAsStringLiteral, useQueryState } from 'nuqs';

const MESSAGE_TABS = ['전체 메시지', '보낸 메시지', '받은 메시지'] as const;

const MESSAGE_LIST: {
  id: number;
  type: '보낸 메시지' | '받은 메시지';
}[] = [];

export default function MessagesScreen() {
  const [activeTab, setActiveTab] = useQueryState(
    'tab',
    parseAsStringLiteral(MESSAGE_TABS).withDefault(MESSAGE_TABS[0]),
  );

  return (
    <>
      <HeaderNav
        tabs={[...MESSAGE_TABS]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex flex-col items-center justify-center pt-20">
        <p className="text-zinc-400">
          {MESSAGE_LIST.length === 0
            ? `${activeTab}가 없습니다.`
            : '메시지가 있습니다.'}
        </p>
      </div>
    </>
  );
}
