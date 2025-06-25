import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
  endpoints: (builder) => ({
    sendSms: builder.mutation<{ success: boolean }, { phoneNumber: string }>({
      query: ({ phoneNumber }) => ({
        url: 'https://oa.kg/api/auth/sms/send/',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ phoneNumber }).toString(),
      }),
    }),
    verifySms: builder.mutation<{ access?: string, refresh?: string }, { phoneNumber: string; code: string }>({
      query: ({ phoneNumber, code }) => ({
        url: 'https://oa.kg/api/auth/sms/verify/',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ phoneNumber, code }).toString(),
      }),
    }),
  }),
});

export const { useSendSmsMutation, useVerifySmsMutation } = api;
