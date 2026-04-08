import { Suspense } from 'react';

import { FeedScreen } from '@/src/screens/feed';

export default function FeedPage() {
  return (
    <Suspense>
      <FeedScreen />
    </Suspense>
  );
}
