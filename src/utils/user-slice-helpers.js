export const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

export const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload || 'Ошибка запроса';
};

export const handleFulfilledUser = (state, action) => {
  state.loading = false;
  state.user = action.payload.user;
  state.accessToken = action.payload.accessToken;
  state.refreshToken = action.payload.refreshToken;
};

export const handleFulfilledLogout = ( state ) => {
  state.loading = false;
  state.user = null;
  state.accessToken = null;
  state.refreshToken = null;
};

export const handleFulfilledRefresh = (state, action) => {
  state.loading = false;
  state.accessToken = action.payload.accessToken;
  state.refreshToken = action.payload.refreshToken;
}