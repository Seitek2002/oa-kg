import { createApi } from '@reduxjs/toolkit/query/react';
import { getBaseQuery } from './baseQuery';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: getBaseQuery(),
  endpoints: (builder) => ({
    sendSms: builder.mutation<{ success: boolean }, { phoneNumber: string }>({
      query: ({ phoneNumber }) => ({
        url: 'https://oa.kg/api/auth/sms/send/',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ phoneNumber }).toString(),
      }),
    }),
    updateCurrentUser: builder.mutation<UserMeResponse, UserMeUpdateRequest>({
      query: (body) => ({
        url: 'https://oa.kg/api/users/me/',
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(body as Record<string, string>).toString(),
      }),
    }),
    patchCurrentUser: builder.mutation<UserMeResponse, UserMeUpdateRequest>({
      query: (body) => ({
        url: 'https://oa.kg/api/users/me/',
        method: 'PATCH',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(body as Record<string, string>).toString(),
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
    getCurrentUser: builder.query<UserMeResponse, void>({
      query: () => ({
        url: 'https://oa.kg/api/users/me/',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
  }),
});

export const {
  useSendSmsMutation,
  useVerifySmsMutation,
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  usePatchCurrentUserMutation,
} = api;

// Типизация ответа для /api/users/me/
export interface UserMeResponse {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  balance: string;
  totalIncome: string;
  osagoIncome: string;
  agentsIncome: string;
  osagoCount: number;
  agentsCount: number;
  referralLink: string;
}

export interface UserMeUpdateRequest {
  firstName?: string;
  lastName?: string;
  middleName?: string;
}
