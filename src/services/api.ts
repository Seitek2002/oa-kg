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
    verifySms: builder.mutation<
      { access?: string; refresh?: string },
      { phoneNumber: string; code: string; referralCode?: string }
    >({
      query: ({ phoneNumber, code, referralCode }) => {
        const pattern = referralCode
          ? new URLSearchParams({
              phoneNumber,
              code,
              referralCode,
            })
          : new URLSearchParams({
              phoneNumber,
              code,
            });

        return {
          url: 'https://oa.kg/api/auth/sms/verify/',
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: pattern.toString(),
        };
      },
    }),
    getCurrentUser: builder.query<UserMeResponse, void>({
      query: () => ({
        url: 'https://oa.kg/api/users/me/',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
    getPolicies: builder.query<Policy[], void>({
      query: () => ({
        url: 'https://oa.kg/api/policies/me/',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
    ocrCreate: builder.mutation<OcrResponse, OcrRequest>({
      query: ({ documentType, frontImage, backImage }) => {
        const formData = new FormData();
        formData.append('frontImage', frontImage);
        formData.append('backImage', backImage);
        return {
          url: '/api/ocr/',
          method: 'POST',
          body: formData,
          params: { documentType },
        };
      },
    }),
    createIdentification: builder.mutation<unknown, FormData>({
      query: (body) => ({
        url: '/api/users/identification/',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useSendSmsMutation,
  useVerifySmsMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  usePatchCurrentUserMutation,
  useGetPoliciesQuery,
  useLazyGetPoliciesQuery,
  useOcrCreateMutation,
  useCreateIdentificationMutation,
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
  authReferralLink: string;
  identificationStatus: string;
}

export interface UserMeUpdateRequest {
  firstName?: string;
  lastName?: string;
  middleName?: string;
}

export interface Policy {
  id: number;
  fullName: string;
  startDate: string;
  endDate: string;
  vehicle: string | null;
  policyPdfUrl: string;
}

export interface OcrRequest {
  documentType: 'passport' | 'driver_license' | 'vehicle_cert';
  frontImage: File;
  backImage: File;
}
export interface OcrPassportData {
  surname: string;
  name: string;
  patronymic: string;
  gender: string;
  birthDate: string;
  documentNumber: string;
  expiryDate: string;
  authority: string;
  issueDate: string;
  birthPlace: string;
  personalNumber: string;
  ethnicity: string;
}

export interface OcrResponse {
  id: number;
  data: OcrPassportData;
}
