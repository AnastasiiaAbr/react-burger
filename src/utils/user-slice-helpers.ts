import { PayloadAction } from "@reduxjs/toolkit";

export type TUser = {
  email: string;
  name: string;
};

export type TAuthState = {
  loading: boolean;
  error: string | null;
  user: TUser | null;
  accessToken: string | null;
  refreshToken: string | null;
};


export const handlePending = (state: TAuthState) : void => {
  state.loading = true;
  state.error = null;
};

export const handleRejected = (state: TAuthState, action: PayloadAction<string | undefined>) : void => {
  state.loading = false;
  state.error = action.payload || 'Ошибка запроса';
};

export const handleFulfilledUser = (state: TAuthState, action: PayloadAction<{
    user: TUser;
    accessToken: string;
    refreshToken: string;
  }>) : void=> {
  state.loading = false;
  state.user = action.payload.user;
  state.accessToken = action.payload.accessToken;
  state.refreshToken = action.payload.refreshToken;
};

export const handleFulfilledLogout = ( state: TAuthState ) : void => {
  state.loading = false;
  state.user = null;
  state.accessToken = null;
  state.refreshToken = null;
};

export const handleFulfilledRefresh = (state: TAuthState, action: PayloadAction<{
    accessToken: string;
    refreshToken: string;
  }>) : void => {
  state.loading = false;
  state.accessToken = action.payload.accessToken;
  state.refreshToken = action.payload.refreshToken;
}