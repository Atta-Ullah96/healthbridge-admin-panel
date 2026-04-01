import { baseApi } from "./base";



export const appointmentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAppointments: builder.query({
            query: ({ page = 1, limit = 10, search = "", status = "all" }) => {
                const params = new URLSearchParams();

                params.append("page", page);
                params.append("limit", limit);

                if (search) params.append("search", search);
                if (status !== "all") params.append("status", status);

                return `/admin/appointments?${params.toString()}`;
            },
            providesTags: ["Appointment"],
        }),
        cancelAppointment: builder.mutation({
            query: (id) => ({
                url: `/admin/appointments/${id}/cancel`,
                method: "PATCH",
            }),
            invalidatesTags: ["Appointment"],
        }),
        confirmAppointment: builder.mutation({
            query: (id) => ({
                url: `/admin/appointments/${id}/confrim`,
                method: "PATCH",
            }),
            invalidatesTags: ["Appointment"],
        }),
        completeAppointment: builder.mutation({
            query: (id) => ({
                url: `/admin/appointments/${id}/complete`,
                method: "PATCH",
            }),
            invalidatesTags: ["Appointment"],
        }),


    })
    ,
})

export const { useGetAppointmentsQuery, useCancelAppointmentMutation  , useCompleteAppointmentMutation , useConfirmAppointmentMutation} = appointmentApi