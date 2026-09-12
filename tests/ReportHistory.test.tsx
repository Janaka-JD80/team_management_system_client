
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ReportHistory from '@/pages/reports/ReportHistory';
import * as reportHooks from '@/hooks/useReportQueries';

// Mock the hook
jest.mock('@/hooks/useReportQueries', () => ({
  useMyReports: jest.fn(),
}));

describe('ReportHistory Component', () => {
  const mockUseMyReports = reportHooks.useMyReports as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseMyReports.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    render(
      <MemoryRouter>
        <ReportHistory />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading reports...')).toBeInTheDocument();
  });

  it('renders empty state when no reports', () => {
    mockUseMyReports.mockReturnValue({ data: [], isLoading: false, isError: false });
    render(
      <MemoryRouter>
        <ReportHistory />
      </MemoryRouter>
    );
    expect(screen.getByText('No reports yet')).toBeInTheDocument();
  });

  it('renders a list of reports correctly', () => {
    const mockReports = [
      {
        report_id: '1',
        week_start_date: '2023-10-01',
        week_end_date: '2023-10-07',
        current_version_num: 1,
        status: { status_name: 'Draft' },
      },
      {
        report_id: '2',
        week_start_date: '2023-10-08',
        week_end_date: '2023-10-14',
        current_version_num: 2,
        status: { status_name: 'Approved' },
      },
    ];

    mockUseMyReports.mockReturnValue({ data: mockReports, isLoading: false, isError: false });
    
    render(
      <MemoryRouter>
        <ReportHistory />
      </MemoryRouter>
    );
    
    // Check if both dates are rendered
    expect(screen.getByText('2023-10-01 to 2023-10-07')).toBeInTheDocument();
    expect(screen.getByText('2023-10-08 to 2023-10-14')).toBeInTheDocument();
    
    // Check badges
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();

    // Check actions (Edit for Draft, View for Approved)
    expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View/i })).toBeInTheDocument();
  });
});
