import { baseApi } from "./base";


export const roleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({


        createRole: builder.mutation({
            query: (data) => ({
                url: "/admin/create/role",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["role"],
        }),

        getAllRoles: builder.query({
            query: () => `/admin/get/role`,
            providesTags: ["role"],
        }),

        updateRole: builder.mutation({
            query: ({ id, data }) => ({
                url: `/admin/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["role"],
        }),

        deleteRole: builder.mutation({
            query: (id) => ({
                url: `/admin/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["role"],
        }),

    })
})

export const { useCreateRoleMutation, useGetAllRolesQuery , useDeleteRoleMutation , useUpdateRoleMutation } = roleApi;