import { authApi } from '@/api/auth';
import { http } from '@/lib/http';

jest.mock('@/lib/http');

const mockedHttp = http as jest.Mocked<typeof http>;

describe('authApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call login API with correct parameters', async () => {
    const mockResponse = { data: { access_token: 'token', token_type: 'bearer' } };
    mockedHttp.post.mockResolvedValueOnce(mockResponse);

    const credentials = { user_email: 'test@test.com', password: 'password' };
    const result = await authApi.login(credentials);

    expect(mockedHttp.post).toHaveBeenCalledWith('/auth/login', credentials);
    expect(result).toEqual(mockResponse.data);
  });

  it('should call signup API with correct parameters', async () => {
    const mockResponse = { data: { access_token: 'token', token_type: 'bearer' } };
    mockedHttp.post.mockResolvedValueOnce(mockResponse);

    const userData = { user_email: 'test@test.com', password: 'password', full_name: 'Test' };
    const result = await authApi.register(userData);

    expect(mockedHttp.post).toHaveBeenCalledWith('/auth/signup', userData);
    expect(result).toEqual(mockResponse.data);
  });
});
