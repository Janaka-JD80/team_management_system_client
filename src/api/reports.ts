import { http } from '@/lib/http';
import type { 
  ReportResponse, 
  ReportWithLatestVersionResponse, 
  ReportCreate, 
  ReportUpdate, 
  ReportVersionResponse,
  ReportSummaryResponse
} from '@/types/reports';

export interface GetReportsParams {
  skip?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  user_id?: string;
  project_id?: string;
  status_id?: string;
  search?: string;
}

export interface ManagerReview {
  action: 'Approved' | 'Needs Correction'; 
  comment?: string | null;
}

export const reportsApi = {
  getMyReports: async (params?: GetReportsParams) => {
    const response = await http.get<ReportResponse[]>('/reports/my-reports', { params });
    return response.data;
  },

  getAllReports: async (params?: GetReportsParams) => {
    const response = await http.get<ReportResponse[]>('/reports/', { params });
    return response.data;
  },

  getReport: async (reportId: string) => {
    const response = await http.get<ReportWithLatestVersionResponse>(`/reports/${reportId}`);
    return response.data;
  },

  createDraft: async (data: ReportCreate) => {
    const response = await http.post<ReportWithLatestVersionResponse>('/reports/', data);
    return response.data;
  },

  updateReport: async (reportId: string, data: ReportUpdate) => {
    const response = await http.put<ReportWithLatestVersionResponse>(`/reports/${reportId}`, data);
    return response.data;
  },

  submitReport: async (reportId: string) => {
    const response = await http.post<ReportWithLatestVersionResponse>(`/reports/${reportId}/submit`);
    return response.data;
  },

  managerReview: async (reportId: string, data: ManagerReview) => {
    const response = await http.post<ReportWithLatestVersionResponse>(`/reports/${reportId}/review`, data);
    return response.data;
  },

  getReportHistory: async (reportId: string) => {
    const response = await http.get<ReportVersionResponse[]>(`/reports/${reportId}/history`);
    return response.data;
  },

  getReportSummary: async (weekStartDate: string, section: string) => {
    const response = await http.get<ReportSummaryResponse[]>('/reports/summary', {
      params: { week_start_date: weekStartDate, section },
    });
    return response.data;
  },
};
