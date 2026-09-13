import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { useAuthStore } from '@/store/authStore';
import { MemoryRouter } from 'react-router-dom';

// Mock Navigate since AdminRoute uses it for redirects
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate-mock" data-to={to}>Redirecting to {to}</div>
}));

describe('AdminRoute', () => {
  const renderRoute = () => {
    return render(
      <MemoryRouter>
        <AdminRoute>
          <div>Admin Content</div>
        </AdminRoute>
      </MemoryRouter>
    );
  };

  afterEach(() => {
    act(() => {
      useAuthStore.getState().clearSession();
    });
  });

  it('redirects to /reports if user has team_member role', () => {
    useAuthStore.getState().setSession({
      sub: 'test', exp: 9999, user_email: 'test@test.com', full_name: 'Test',
      roles: ['team_member'],
      permissions: []
    });
    
    renderRoute();
    expect(screen.getByTestId('navigate-mock')).toHaveAttribute('data-to', '/reports');
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('redirects to /dashboard if user has manager role', () => {
    useAuthStore.getState().setSession({
      sub: 'test', exp: 9999, user_email: 'test@test.com', full_name: 'Test',
      roles: ['manager'],
      permissions: []
    });
    
    renderRoute();
    expect(screen.getByTestId('navigate-mock')).toHaveAttribute('data-to', '/dashboard');
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('renders content if user has admin role', () => {
    useAuthStore.getState().setSession({
      sub: 'test', exp: 9999, user_email: 'test@test.com', full_name: 'Test',
      roles: ['admin'],
      permissions: []
    });
    
    renderRoute();
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate-mock')).not.toBeInTheDocument();
  });
});
