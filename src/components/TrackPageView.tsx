'use client';

import { useEffect } from 'react';
import { useTracking } from '@/hooks/useTracking';

interface Props {
  event: string;
  params?: Record<string, unknown>;
}

export function TrackPageView({ event, params }: Props) {
  const { track } = useTracking();
  useEffect(() => {
    track(event, { metadata: params });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
