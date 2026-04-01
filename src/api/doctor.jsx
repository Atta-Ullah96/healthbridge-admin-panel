import { baseApi } from "./base";

export const adminDoctorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query({
      query: ({ page = 1, limit = 10, search = "", status = "all" }) => {
        const params = new URLSearchParams();

        params.append("page", page);
        params.append("limit", limit);

        if (search) params.append("search", search);
        if (status !== "all") params.append("status", status);

        return `/admin/doctors?${params.toString()}`;
      },
      providesTags: ["Doctor"],
    }),

       getDoctorById: builder.query({
      query: (id) => `/admin/doctor/${id}`,
      providesTags: (result, error, id) => [{ type: "Doctor", id }],
    }),

    verifyDoctor: builder.mutation({
      query: (id) => ({
        url: `/admin/doctors/${id}/verify`,
        method: "PATCH",
      }),
      invalidatesTags: ["Doctor"],
    }),

    banDoctor: builder.mutation({
      query: (id) => ({
        url: `/admin/doctors/${id}/ban`,
        method: "PATCH",
      }),
      invalidatesTags: ["Doctor"],
    }),

    unbanDoctor: builder.mutation({
      query: (id) => ({
        url: `/admin/doctors/${id}/unban`,
        method: "PATCH",
      }),
      invalidatesTags: ["Doctor"],
    }),

    deleteDoctor: builder.mutation({
      query: (id) => ({
        url: `/admin/doctors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Doctor"],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useVerifyDoctorMutation,
  useBanDoctorMutation,
  useUnbanDoctorMutation,
  useDeleteDoctorMutation,
} = adminDoctorApi;
