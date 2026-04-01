import { baseApi } from "./base";

export const laboratoyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        createLabAccount: builder.mutation({
            query: (data) => ({
                url: "/admin/laboratory",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Laboratory"],
        }),

        getlaboratories: builder.query({
            query: ({ page = 1, limit = 10, search = "", status = "all" }) => {
                const params = new URLSearchParams();

                params.append("page", page);
                params.append("limit", limit);

                if (search) params.append("search", search);
                if (status !== "all") params.append("status", status);

                return `/admin/laboratory?${params.toString()}`;
            },
            providesTags: ["Laboratory"],
        }),

    })
})


export const { useCreateLabAccountMutation  , useGetlaboratoriesQuery} = laboratoyApi;