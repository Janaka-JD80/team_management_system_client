import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { useAuthStore } from '@/store/authStore';

describe('PermissionGuard', () => {
  const renderGuard = (props: any) => {
    return render(
      <PermissionGuard {...props}>
        <div>Guarded Content</div>
      </PermissionGuard>
    );
  };

  afterEach(() => {
    act(() => {
      useAuthStore.getState().clearSession();
    });
  });

  it('renders nothing if user is null', () => {
    renderGuard({ allowedRoles: ['manager'] });
    expect(screen.queryByText('Guarded Content')).not.toBeInTheDocument();
  });

  it('renders content if user has allowed role', () => {
    useAuthStore.getState().setSession({
      sub: 'test', exp: 9999, user_email: 'test@test.com', full_name: 'Test',
      roles: ['manager'],
      permissions: []
    });
    
    renderGuard({ allowedRoles: ['manager', 'admin'] });
    expect(screen.getByText('Guarded Content')).toBeInTheDocument();
  });

  it('hides content if user lacks allowed role', () => {
    useAuthStore.getState().setSession({
      sub: 'test', exp: 9999, user_email: 'test@test.com', full_name: 'Test',
      roles: ['team_member'],
      permissions: []
    });
    
    renderGuard({ allowedRoles: ['manager', 'admin'] });
    expect(screen.queryByText('Guarded Content')).not.toBeInTheDocument();
  });

  it('renders content if user has allowed permission', () => {
    useAuthStore.getState().setSession({
      sub: 'test', exp: 9999, user_email: 'test@test.com', full_name: 'Test',
      roles: ['team_member'],
      permissions: ['create:report']
    });
    
    renderGuard({ allowedPermissions: ['create:report'] });
    expect(screen.getByText('Guarded Content')).toBeInTheDocument();
  });

  it('renders content if user has either role or permission (default behavior)', () => {
    useAuthStore.getState().setSession({
      sub: 'test', exp: 9999, user_email: 'test@test.com', full_name: 'Test',
      roles: ['team_member'], // Lacks role
      permissions: ['review:report'] // Has permission
    });
    
    renderGuard({ allowedRoles: ['manager'], allowedPermissions: ['review:report'] });
    expect(screen.getByText('Guarded Content')).toBeInTheDocument();
  });

  it('hides content if user lacks both role and permission (requireBoth=true)', () => {
    useAuthStore.getState().setSession({
      sub: 'test', exp: 9999, user_email: 'test@test.com', full_name: 'Test',
      roles: ['team_member'], // Lacks role
      permissions: ['review:report'] // Has permission
    });
    
    renderGuard({ allowedRoles: ['manager'], allowedPermissions: ['review:report'], requireBoth: true });
    expect(screen.queryByText('Guarded Content')).not.toBeInTheDocument();
  });

  it('renders fallback when access is denied', () => {
    useAuthStore.getState().setSession({
      sub: 'test', exp: 9999, user_email: 'test@test.com', full_name: 'Test',
      roles: ['team_member'],
      permissions: []
    });
    
    render(
      <PermissionGuard allowedRoles={['manager']} fallback={<div>Access Denied</div>}>
        <div>Guarded Content</div>
      </PermissionGuard>
    );
    
    expect(screen.queryByText('Guarded Content')).not.toBeInTheDocument();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });
});
