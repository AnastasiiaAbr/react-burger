import { API } from "./api";

type TTokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  message?: string;
};


const checkResponse = <T>(res: Response) : Promise<T> => {
  return res.ok ? res.json() : res.json().then((err) => Promise.reject(err));
};

export const refreshToken = (): Promise<TTokenResponse> => {
  return fetch(API.AUTH_TOKEN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    }),
  })
  .then(checkResponse<TTokenResponse>)
  .then((refreshData) => {
    if (!refreshData.success) {
      return Promise.reject(refreshData);
    }
    localStorage.setItem('refreshToken', refreshData.refreshToken);
    localStorage.setItem('accessToken', refreshData.accessToken);
    return refreshData;
  });
};

export const fetchWithRefresh = async <T>(url: string, options: RequestInit) : Promise<T> => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err: any) {
    if (err.message === "jwt expired") {
      const refreshData = await refreshToken();
      (options.headers as Record<string, string>).authorization = refreshData.accessToken;
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    } else {
      return Promise.reject(err);
    }
  }
};

export const saveTokens = (accessToken: string, refreshToken: string) => {
  const clearAccessToken = accessToken.replace('Bearer ', '');
  localStorage.setItem('accessToken', clearAccessToken);
  localStorage.setItem('refreshToken', refreshToken);
};
