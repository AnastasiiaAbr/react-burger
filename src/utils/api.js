export const BASE_URL = 'https://norma.education-services.ru/api/';

export const API = {
  INGREDIENTS: `${BASE_URL}ingredients`,
  ORDERS: `${BASE_URL}orders`,

  PASSWORD_RESET: `${BASE_URL}password-reset`,
  PASSWORD_RESET_RESET: `${BASE_URL}password-reset/reset`,

  AUTH_LOGIN: `${BASE_URL}auth/login`,
  AUTH_REGISTER: `${BASE_URL}auth/register`,
  AUTH_LOGOUT: `${BASE_URL}auth/logout`,
  AUTH_TOKEN: `${BASE_URL}auth/token`,
  AUTH_USER: `${BASE_URL}auth/user`,
};

export const WS_URL_ALL = 'wss://norma.education-services.ru/orders/all';
export const WS_URL_PROFILE = 'wss://norma.education-services.ru/orders';
