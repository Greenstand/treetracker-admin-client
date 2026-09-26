import { useQuery } from '@tanstack/react-query';
import { differenceInCalendarDays } from 'date-fns';

import { countToLocaleString } from '../../common/numbers';
import captureApi from '../../api/treeTrackerApi';
import FilterModel from '../../models/Filter';

export const RECENT_CAPTURE_COUNT = 5;

const QUERY_OPTIONS = {
  staleTime: 1000 * 60 * 5,
  refetchOnWindowFocus: false,
};

function pendingFilter() {
  return new FilterModel({ approved: false, active: true });
}

export function usePendingCaptureCount() {
  return useQuery({
    ...QUERY_OPTIONS,
    queryKey: ['captureCount', 'pending'],
    queryFn: () => captureApi.getCaptureCount(pendingFilter()),
    select: (result) => {
      const count = Number(result?.count);
      return Number.isFinite(count) ? countToLocaleString(count) || '0' : '—';
    },
  });
}

export function useOldestWaiting() {
  return useQuery({
    ...QUERY_OPTIONS,
    queryKey: ['oldestUnverifiedCapture'],
    queryFn: () =>
      captureApi.getCaptureImages({
        skip: 0,
        rowsPerPage: 1,
        orderBy: 'timeCreated',
        order: 'asc',
        filter: pendingFilter(),
      }),
    select: (captures) => {
      const oldest = captures?.[0];
      if (!oldest?.timeCreated) return '—';
      const days = differenceInCalendarDays(
        new Date(),
        new Date(oldest.timeCreated)
      );
      if (days < 1) return 'Today';
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    },
  });
}

export function useRecentUnverifiedCaptures() {
  return useQuery({
    ...QUERY_OPTIONS,
    queryKey: ['recentPendingCaptures'],
    queryFn: () =>
      captureApi.getCaptureImages({
        skip: 0,
        rowsPerPage: RECENT_CAPTURE_COUNT,
        orderBy: 'timeCreated',
        order: 'desc',
        filter: pendingFilter(),
      }),
  });
}
