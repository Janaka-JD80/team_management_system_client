import { http } from '@/lib/http';
import type { DashboardSummaryResponse, DashboardChartsResponse, TeamMemberStatsResponse } from '@/types/analytics';

export const analyticsApi = {
  getDashboardSummary: async (weekStartDate: string) => {
    const response = await http.get<DashboardSummaryResponse>('/analytics/summary', {
      params: { week_start_date: weekStartDate },
    });
    return response.data;
  },

  getDashboardCharts: async (endDate: string) => {
    const response = await http.get<DashboardChartsResponse>('/analytics/charts', {
      params: { end_date: endDate },
    });
    return response.data;
  },

  getTeamMemberStats: async (userId: string) => {
    const response = await http.get<TeamMemberStatsResponse>(`/analytics/users/${userId}/stats`);
    return response.data;
  },
};
