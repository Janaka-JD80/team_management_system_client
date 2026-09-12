import { http } from '@/lib/http';
import type { DashboardSummaryResponse, DashboardChartsResponse } from '@/types/analytics';

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
};
