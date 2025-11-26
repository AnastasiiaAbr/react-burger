import reducer, {
  setUser,
  setIsAuthChecked,
  selectUser,
  selectIsAuthChecked,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateUser,
  checkUserAuth,
  initialState
} from './user-slice';
import { request } from '../../utils/request';
import * as tokenHelpers from '../../utils/token-helpers';

jest.mock('../../utils/request', () => ({
  request: jest.fn(),
}));

jest.mock('../../utils/token-helpers', () => ({
  saveTokens: jest.fn(),
}));

describe('userSlice', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });


  test('setUser sets user', () => {
    const state = reducer(initialState, setUser({ name: 'John', email: 'a@b.com' }));
    expect(state.user).toEqual({ name: 'John', email: 'a@b.com' });
  });

  test('setIsAuthChecked sets flag', () => {
    const state = reducer(initialState, setIsAuthChecked(true));
    expect(state.isAuthChecked).toBe(true);
  });


  const mockUserResponse = {
    user: { name: 'John', email: 'a@b.com' },
    accessToken: 'token123',
    refreshToken: 'refresh123',
  };

  async function testAsyncThunkSuccess(thunk) {
    (request).mockResolvedValueOnce(mockUserResponse);
    const dispatch = jest.fn();
    const result = await thunk({ email: 'a@b.com', password: '123', name: 'John' })(
      dispatch,
      jest.fn(),
      undefined
    );

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: setUser.type }));
    expect(tokenHelpers.saveTokens).toHaveBeenCalledWith(
      mockUserResponse.accessToken,
      mockUserResponse.refreshToken
    );
    expect(result.type).toBe(thunk.fulfilled.type);
    expect(result.payload).toEqual(mockUserResponse);
  }

  test('registerUser success', async () => {
    await testAsyncThunkSuccess(registerUser);
  });

  test('loginUser success', async () => {
    await testAsyncThunkSuccess(loginUser);
  });

  test('registerUser failure', async () => {
    (request).mockRejectedValueOnce(new Error('Fail'));
    const dispatch = jest.fn();
    const result = await registerUser({ email: 'a@b.com', password: '123' })(
      dispatch,
      jest.fn(),
      undefined
    );
    expect(result.type).toBe(registerUser.rejected.type);
    expect(result.payload).toBe('Fail');
  });


  test('logoutUser clears tokens', async () => {
    localStorage.setItem('refreshToken', 'refresh123');
    (request).mockResolvedValueOnce({ success: true });

    const dispatch = jest.fn();
    const result = await logoutUser()(dispatch, jest.fn(), undefined);

    expect(localStorage.getItem('refreshToken')).toBe(null);
    expect(localStorage.getItem('accessToken')).toBe(null);
    expect(result.type).toBe(logoutUser.fulfilled.type);
  });

  test('logoutUser without token fails', async () => {
    const dispatch = jest.fn();
    const result = await logoutUser()(dispatch, jest.fn(), undefined);

    expect(result.type).toBe(logoutUser.rejected.type);
    expect(result.payload).toBe('Refresh token отсутствует');
  });


  test('refreshAccessToken success', async () => {
    localStorage.setItem('refreshToken', 'refresh123');
    (request).mockResolvedValueOnce({ accessToken: 'newAccess', refreshToken: 'newRefresh' });

    const dispatch = jest.fn();
    const result = await refreshAccessToken()(dispatch, jest.fn(), undefined);

    expect(tokenHelpers.saveTokens).toHaveBeenCalledWith('newAccess', 'newRefresh');
    expect(result.type).toBe(refreshAccessToken.fulfilled.type);
    expect(result.payload).toEqual({ accessToken: 'newAccess', refreshToken: 'newRefresh' });
  });

  test('refreshAccessToken fails without token', async () => {
    const dispatch = jest.fn();
    const result = await refreshAccessToken()(dispatch, jest.fn(), undefined);

    expect(result.type).toBe(refreshAccessToken.rejected.type);
    expect(result.payload).toBe('Отсутствует refreshToken');
  });


  test('updateUser success', async () => {
    localStorage.setItem('accessToken', 'Bearer token');
    (request).mockResolvedValueOnce({ user: { name: 'Updated', email: 'a@b.com' } });

    const dispatch = jest.fn();
    const result = await updateUser({ name: 'Updated' })(dispatch, jest.fn(), undefined);

    expect(result.type).toBe(updateUser.fulfilled.type);
    expect(result.payload).toEqual({ name: 'Updated', email: 'a@b.com' });
  });

  test('selectUser selector', () => {
    const state = { user: { ...initialState, user: { name: 'John', email: 'a@b.com' } } };
    expect(selectUser(state)).toEqual({ name: 'John', email: 'a@b.com' });
  });

  test('selectIsAuthChecked selector', () => {
    const state = { user: { ...initialState, isAuthChecked: true } };
    expect(selectIsAuthChecked(state)).toBe(true);
  });
});
