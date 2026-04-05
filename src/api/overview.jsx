import { baseApi } from "./base";


export const dashboardOverview = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    overview: builder.query({
      query: () => ({
        url: "/admin/dashboard/overview",
        method: "Get",
      }),
    }),

  })
})


export const {useOverviewQuery} = dashboardOverview

