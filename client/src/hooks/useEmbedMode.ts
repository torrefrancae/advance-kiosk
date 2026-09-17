import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useEmbedMode() {
  const [params] = useSearchParams();
  return useMemo(() => params.get('embed') === '1', [params]);
}
