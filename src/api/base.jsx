import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1`, // your backend URL
    credentials: 'include',  // IMPORTANT for session-based auth
  }),
  tagTypes: [
    'Admin',
    'Doctor',
    'Patient',
    'Laboratory',
    'Appointment',
    'User',
    "Consultation",
    "role"
  ],
  endpoints: () => ({}), // empty for now
});
