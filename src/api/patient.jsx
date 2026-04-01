import { baseApi } from "./base";

export const adminPatientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatients: builder.query({
      query: ({ page = 1, limit = 10, search = "", status = "all" }) => {
        const params = new URLSearchParams();

        params.append("page", page);
        params.append("limit", limit);

        if (search) params.append("search", search);
        if (status !== "all") params.append("status", status);

        return `/admin/patients?${params.toString()}`;
      },
      providesTags: ["Patient"],
    }),


      deletePatient: builder.mutation({
      query: (id) => ({
        url: `/admin/patients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Patient"],
    }),
 }),

});

export const {useGetPatientsQuery , useDeletePatientMutation} = adminPatientApi;