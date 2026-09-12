import { reportsApi } from '@/api/reports';
import { http } from '@/lib/http';

jest.mock('@/lib/http');
const mockedHttp = http as jest.Mocked<typeof http>;

describe('reportsApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockReportData = { report_id: 'report-123', week_start_date: '2023-10-01' };

  it('should call getMyReports API with correct parameters', async () => {
    mockedHttp.get.mockResolvedValueOnce({ data: [mockReportData] });
    
    const params = { limit: 10 };
    const result = await reportsApi.getMyReports(params);
    
    expect(mockedHttp.get).toHaveBeenCalledWith('/reports/my-reports', { params });
    expect(result).toEqual([mockReportData]);
  });

  it('should call createDraft API with correct payload', async () => {
    mockedHttp.post.mockResolvedValueOnce({ data: mockReportData });
    
    const draftData = { week_start_date: '2023-10-01', week_end_date: '2023-10-07', tasks_completed: [], tasks_planned: [], blockers: [], achievements: [] };
    const result = await reportsApi.createDraft(draftData);
    
    expect(mockedHttp.post).toHaveBeenCalledWith('/reports/', draftData);
    expect(result).toEqual(mockReportData);
  });

  it('should call submitReport API correctly', async () => {
    mockedHttp.post.mockResolvedValueOnce({ data: mockReportData });
    
    const result = await reportsApi.submitReport('report-123');
    
    expect(mockedHttp.post).toHaveBeenCalledWith('/reports/report-123/submit');
    expect(result).toEqual(mockReportData);
  });
});
