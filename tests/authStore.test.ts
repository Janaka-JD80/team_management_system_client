import { useAuthStore } from '@/store/authStore';

// A mock JWT token for testing. Payload: { sub: "test", exp: 9999999999, user_email: "test@example.com", full_name: "Test User", roles: ["admin"], permissions: [] }
const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjo5OTk5OTk5OTk5LCJ1c2VyX2VtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImZ1bGxfbmFtZSI6IlRlc3QgVXNlciIsInJvbGVzIjpbImFkbWluIl0sInBlcm1pc3Npb25zIjpbXX0.MOCK_SIGNATURE';

describe('useAuthStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    useAuthStore.getState().clearSession();
  });

  it('should initialize with default values', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('should set session correctly given a valid token', () => {
    useAuthStore.getState().setSession(mockToken);
    
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toMatchObject({
      user_email: 'test@example.com',
      roles: ['admin'],
    });
  });

  it('should handle invalid token gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    useAuthStore.getState().setSession('invalid-token');
    
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    
    consoleSpy.mockRestore();
  });

  it('should clear session correctly', () => {
    useAuthStore.getState().setSession(mockToken);
    useAuthStore.getState().clearSession();
    
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});
