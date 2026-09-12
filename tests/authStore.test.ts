import { useAuthStore } from '@/store/authStore';

// A mock user for testing.
const mockUser = { sub: "test", exp: 9999999999, user_email: "test@example.com", full_name: "Test User", roles: ["admin"], permissions: [] };

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

  it('should set session correctly given a valid user', () => {
    useAuthStore.getState().setSession(mockUser);
    
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toMatchObject({
      user_email: 'test@example.com',
      roles: ['admin'],
    });
  });

  it('should clear session correctly', () => {
    useAuthStore.getState().setSession(mockUser);
    useAuthStore.getState().clearSession();
    
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});
