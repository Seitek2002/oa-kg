import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

export const getBaseQuery =
  (): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =>
  async (args, api, extraOptions) => {
    const fetchQuery = fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      credentials: 'same-origin',
      prepareHeaders: (headers, { endpoint }) => {
        const token = localStorage.getItem('token');
        const url = typeof args === 'string' ? args : args.url;

        // Не добавляем токен для /sms/send и /sms/verify
        const isAuthFree =
          url?.includes('/sms/send') || url?.includes('/sms/verify');

        if (token && !isAuthFree) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        headers.set('Accept', 'application/json');
        return headers;
      },
    });

    let result = await fetchQuery(args, api, extraOptions);

    // Если 401 и не /sms/send|/sms/verify — пробуем refresh
    const url = typeof args === 'string' ? args : args.url;
    const isAuthFree =
      url?.includes('/sms/send') || url?.includes('/sms/verify');

    if (
      result.meta?.response?.status === 401 &&
      !isAuthFree
    ) {
      const refresh = localStorage.getItem('refresh');
      if (refresh) {
        // Пробуем обновить токен
        const refreshResult = await fetchQuery(
          {
            url: '/auth/token/refresh/',
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ refresh }).toString(),
          },
          api,
          extraOptions
        );
        if (
          refreshResult.data &&
          typeof refreshResult.data === 'object' &&
          'access' in refreshResult.data
        ) {
          localStorage.setItem('token', refreshResult.data.access as string);
          // Повторяем исходный запрос с новым токеном
          result = await fetchQuery(args, api, extraOptions);
        } else {
          // refresh неудачен — удаляем токены и редиректим
          localStorage.removeItem('token');
          localStorage.removeItem('refresh');
          window.location.href = '/a/auth';
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        window.location.href = '/a/auth';
      }
    }

    return result;
  };
