import { API } from "../../utils/api";
import { request } from "../../utils/request";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { saveTokens } from "../../utils/token-helpers";
import { handleRejected, handleFulfilledUser, handlePending, handleFulfilledLogout, handleFulfilledRefresh } from "../../utils/user-slice-helpers";
import { RootState } from "../root-reducer";

type TUser = {
  name: string;
  email: string;
}

type TInitialRegisterState = {
  user: null | TUser;
  accessToken: null | string;
  refreshToken: null | string;
  loading: boolean;
  error: null | string;
  isAuthChecked: boolean;
};

type TAPIPayload = {
  email: string;
  name?: string;
  password: string;
};

type TAPIResponse = {
  user: TUser;
  accessToken: string;
  refreshToken: string;
};

const initialState: TInitialRegisterState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  isAuthChecked: false,
};

type TServerResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: TUser;
};

export const registerUser = createAsyncThunk<TAPIResponse, TAPIPayload, { rejectValue: string }>(
  'user/register',
  async ({ email, password, name }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const response = await request<TServerResponse>(API.AUTH_REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name })
      });

      const { accessToken, refreshToken, user } = response;

      saveTokens(accessToken, refreshToken);
      dispatch(setUser(user));
      return {
        user,
        accessToken,
        refreshToken
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка регистрации')
    }
  });

export const loginUser = createAsyncThunk<TAPIResponse, TAPIPayload, { rejectValue: string }>(
  'user/login',
  async ({ email, password }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const response = await request<TServerResponse>(API.AUTH_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      const { accessToken, refreshToken, user } = response;

      saveTokens(accessToken, refreshToken);
      dispatch(setUser(user));
      return {
        user,
        accessToken,
        refreshToken
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка авторизации');
    }
  });

export const logoutUser = createAsyncThunk<any, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('Refresh token отсутствует');
      const response = await request(API.AUTH_LOGOUT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: refreshToken })
      });

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка при выходе из системы');
    }
  });

type TRefreshResponse = {
  refreshToken: string;
  accessToken: string;
}

export const refreshAccessToken = createAsyncThunk<TRefreshResponse, void, { rejectValue: string }>(
  'user/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('Отсутствует refreshToken');

      const response = await request<{ accessToken: string, refreshToken: string }>(API.AUTH_TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: refreshToken })
      });

      const { accessToken, refreshToken: newRefreshToken } = response;

      saveTokens(accessToken, newRefreshToken);
      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка при обновлении токена');
    }
  });

type TUserResponse = {
  user: TUser;
};

export const checkUserAuth = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      try {
        const data = await request<TUserResponse>(API.AUTH_USER, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken.startsWith('Bearer')
              ? accessToken
              : `Bearer ${accessToken}`,
          },
        });
        dispatch(setUser(data.user));
      } catch {
        const refreshResult = await dispatch(refreshAccessToken());
        if (refreshAccessToken.fulfilled.match(refreshResult)) {
          const newAccessToken = refreshResult.payload.accessToken;
          const userData = await request<TUserResponse>(API.AUTH_USER, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: newAccessToken.startsWith('Bearer')
                ? newAccessToken
                : `Bearer ${newAccessToken}`,
            },
          });
          dispatch(setUser(userData.user));
        }
      } finally {
        dispatch(setIsAuthChecked(true));
      }
    } else {
      dispatch(setIsAuthChecked(true));
    }
  });

export const updateUser = createAsyncThunk<TUser, Partial<TUser>, {rejectValue: string}>(
  'user/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('Отсутствует accessToken');

      const response = await request<TUserResponse>(API.AUTH_USER, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken.startsWith('Bearer')
            ? accessToken :
            `Bearer ${accessToken}`,
        },
        body: JSON.stringify(userData),
      });

      return response.user;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка при обновлении пользователя');
    }
  }
)

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => { state.isAuthChecked = action.payload; },
    setUser: (state, action: PayloadAction<TUser| null>) => { state.user = action.payload; },
  },
  extraReducers:
    (builder) => {
      builder
        .addCase(registerUser.pending, handlePending)
        .addCase(registerUser.fulfilled, handleFulfilledUser)
        .addCase(registerUser.rejected, handleRejected)

        .addCase(loginUser.pending, handlePending)
        .addCase(loginUser.fulfilled, handleFulfilledUser)
        .addCase(loginUser.rejected, handleRejected)

        .addCase(logoutUser.pending, handlePending)
        .addCase(logoutUser.fulfilled, handleFulfilledLogout)
        .addCase(logoutUser.rejected, handleRejected)

        .addCase(refreshAccessToken.pending, handlePending)
        .addCase(refreshAccessToken.fulfilled, handleFulfilledRefresh)
        .addCase(refreshAccessToken.rejected, handleRejected)

        .addCase(updateUser.pending, handlePending)
        .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
          state.user = action.payload;
          state.error = null;
          state.loading = false;
        })
        .addCase(updateUser.rejected, handleRejected)
    },
});

export const { setIsAuthChecked, setUser } = userSlice.actions;
export const selectUser = (state: RootState): TUser | null => state.user.user;
export const selectIsAuthChecked = (state: RootState): boolean => state.user.isAuthChecked;

export default userSlice.reducer;

