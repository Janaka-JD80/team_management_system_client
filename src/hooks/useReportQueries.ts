import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi } from '@/api/reports';
import type { GetReportsParams, ManagerReview } from '@/api/reports';
import type { ReportCreate, ReportUpdate } from '@/types/reports';

export function useMyReports(params?: GetReportsParams) {
  return useQuery({
    queryKey: ['my-reports', params],
    queryFn: () => reportsApi.getMyReports(params),
  });
}

export function useAllReports(params?: GetReportsParams) {
  return useQuery({
    queryKey: ['all-reports', params],
    queryFn: () => reportsApi.getAllReports(params),
  });
}

export function useReport(reportId: string | undefined) {
  return useQuery({
    queryKey: ['report', reportId],
    queryFn: () => reportsApi.getReport(reportId!),
    enabled: !!reportId, // Only fetch if we have an ID
  });
}

export function useReportHistory(reportId: string | undefined) {
  return useQuery({
    queryKey: ['report-history', reportId],
    queryFn: () => reportsApi.getReportHistory(reportId!),
    enabled: !!reportId,
  });
}

export function useReportSummary(weekStartDate: string | undefined, section: string) {
  return useQuery({
    queryKey: ['report-summary', weekStartDate, section],
    queryFn: () => reportsApi.getReportSummary(weekStartDate!, section),
    enabled: !!weekStartDate && !!section,
  });
}

export function useCreateDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReportCreate) => reportsApi.createDraft(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reports'] });
    },
  });
}

export function useUpdateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, data }: { reportId: string; data: ReportUpdate }) =>
      reportsApi.updateReport(reportId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['report', variables.reportId] });
      queryClient.invalidateQueries({ queryKey: ['my-reports'] });
    },
  });
}

export function useSubmitReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportId: string) => reportsApi.submitReport(reportId),
    onSuccess: (_, reportId) => {
      queryClient.invalidateQueries({ queryKey: ['report', reportId] });
      queryClient.invalidateQueries({ queryKey: ['my-reports'] });
    },
  });
}

export function useManagerReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, data }: { reportId: string; data: ManagerReview }) =>
      reportsApi.managerReview(reportId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['report', variables.reportId] });
      queryClient.invalidateQueries({ queryKey: ['all-reports'] });
    },
  });
}
