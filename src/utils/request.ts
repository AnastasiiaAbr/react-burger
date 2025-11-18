import { API } from "./api";

function checkResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    return Promise.reject(`Ошибка ${res.status}`)}

  return res.json() as Promise<T>;
}

export function request<T = unknown>(
  url: string,
  options?: RequestInit
):Promise<T> {
  return fetch(url, options).then((res) => checkResponse<T>(res));
};

export function getOrderByNumber(number: string | number) {
  return request<{orders: any[] }>(`${API.ORDERS}/${number}`);
}