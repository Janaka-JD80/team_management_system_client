import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics';

export function useDashboardSummary(weekStartDate: string | undefined) {
  return useQuery({
    queryKey: ['analytics', 'summary', weekStartDate],
    queryFn: () => analyticsApi.getDashboardSummary(weekStartDate!),
    enabled: !!weekStartDate,
  });
}

export function useDashboardCharts(endDate: string | undefined) {
  return useQuery({
    queryKey: ['analytics', 'charts', endDate],
    queryFn: () => analyticsApi.getDashboardCharts(endDate!),
    enabled: !!endDate,
  });
}

export function useTeamMemberStats(userId: string | undefined) {
  return useQuery({
    queryKey: ['analytics', 'teamMember', userId],
    queryFn: () => analyticsApi.getTeamMemberStats(userId!),
    enabled: !!userId,
  });
}
