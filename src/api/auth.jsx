import { baseApi } from "./base";


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (data) => ({
        url: "/admin/login",
        method: "POST",
        body: data,
      }),
    }),

    adminLogout: builder.mutation({
      query: () => ({
        url: "/admin/logout",
        method: "POST",
      }),
    }),

  }),
});

export const { useAdminLoginMutation , useAdminLogoutMutation } = authApi;