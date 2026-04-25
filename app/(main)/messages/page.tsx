import { Suspense } from 'react';

import MessagesScreen from '@/src/screens/messages';

export default function MessagesPage() {
  return (
    <Suspense>
      <MessagesScreen />
    </Suspense>
  );
}
