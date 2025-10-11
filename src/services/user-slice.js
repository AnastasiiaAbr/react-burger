 import { API } from "../utils/api";
import { request } from "../utils/request";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { saveTokens } from "../utils/token-helpers";
import { handleRejected, handleFulfilledUser, handlePending, handleFulfilledLogout, handleFulfilledRefresh } from "../utils/user-slice-helpers";

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  isAuthChecked: false,
};
export const registerUser = createAsyncThunk(
  'user/register',
  async ({ email, password, name }, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI;
    try {
      const data = await request(API.AUTH_REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name })
      });

      saveTokens(data.accessToken, data.refreshToken);
      dispatch(setUser(data.user));
      return {
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Ошибка регистрации')
    }
  });

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI;
    try {
      const data = await request(API.AUTH_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      saveTokens(data.accessToken, data.refreshToken);
      dispatch(setUser(data.user))
      return {
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Ошибка авторизации');
    }
  });

export const logoutUser = createAsyncThunk(
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
    } catch (err) {
      return rejectWithValue(err.message || 'Ошибка при выходе из системы');
    }
  });

export const refreshAccessToken = createAsyncThunk(
  'user/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('Отсутствует refreshToken');

      const data = await request(API.AUTH_TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: refreshToken })
      });

      saveTokens(data.accessToken, data.refreshToken);
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Ошибка при обновлении токена');
    }
  });

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (accessToken && refreshToken) {
      try {
        const data = await request(API.AUTH_USER, {
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
          const userData = await request(API.AUTH_USER, {
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

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async(userData, {rejectWithValue}) => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      const data = await request(API.AUTH_USER, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken.startsWith('Bearer')
          ? accessToken :
          `Bearer ${accessToken}`,
        },
        body: JSON.stringify(userData),
      });

      return data.user;
    } catch (err) {
      return rejectWithValue(err.message || 'Ошибка при обновлении пользователя');
    }
  }
)

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsAuthChecked: (state, action) => { state.isAuthChecked = action.payload; },
    setUser: (state, action) => { state.user = action.payload; },
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
        .addCase(updateUser.fulfilled, (state, action) => {
          state.user = action.payload;
          state.error = null;
          state.loading = false;
        })
        .addCase(updateUser.rejected, handleRejected)
    },
});

export const { setIsAuthChecked, setUser } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export const selectIsAuthChecked = (state) => state.user.isAuthChecked;

export default userSlice.reducer; 

