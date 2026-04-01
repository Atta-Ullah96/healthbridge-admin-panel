import { baseApi } from "./base";


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: ({email , password}) => ({
        url: "/admin/login",
        method: "POST",
        body: {email, password},
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