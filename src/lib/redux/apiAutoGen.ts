// lib/apiAutoGen.ts
import { createGenericAPI } from "./apiFactory";
import { apiConfigs } from "./apiConfig";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const allApis = apiConfigs.map((config) => {
  const api = createGenericAPI({
    reducerPath: `${config.name}Api`,
    tagType: config.tag,
    baseUrl: config.url,
    endpoints: (builder) => ({
      [`getAll${config.tag}`]: builder.query({
        query: () => ``,
        providesTags: [config.tag],
      }),
      [`get${config.tag}ById`]: builder.query({
        query: (id: number) => `/${id}`,
        providesTags: (
          result: any,
          error: FetchBaseQueryError | undefined,
          id: number,
        ) => [{ type: config.tag, id }],
      }),
      [`create${config.tag}`]: builder.mutation({
        query: (body: any) => ({
          url: ``,
          method: "POST",
          body,
        }),
        invalidatesTags: [config.tag],
      }),
      [`update${config.tag}`]: builder.mutation({
        query: ({ id, ...body }: { id: number; [key: string]: any }) => ({
          url: `/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: [config.tag],
      }),
      [`delete${config.tag}`]: builder.mutation({
        query: (id: number) => ({
          url: `/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [config.tag],
      }),
    }),
  });

  return api;
});
