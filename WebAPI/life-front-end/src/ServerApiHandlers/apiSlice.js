import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import * as url from "url";

export const apiSlice = createApi({
    reducerPath: 'serverApi',
    
    baseQuery: fetchBaseQuery({baseUrl: 'https://localhost:7129'}),
    
    endpoints: builder => ({
        getFields: builder.query({
            query: () => '/Map'
        }),
        getMinimap: builder.query({
            query: () => ({url: '/Map'}),
            
        }),
    })
})

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useGetFieldsQuery } = apiSlice