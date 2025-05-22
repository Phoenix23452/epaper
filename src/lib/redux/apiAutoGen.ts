// lib/apiAutoGen.ts
import { createGenericAPI } from "./apiFactory";
import { apiConfigs } from "./apiConfig";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { buildQueryParams } from "@/lib/queryParser";
import { tagDependencies } from "./tagDependencies.";

export const allApis = apiConfigs.map((config) => {
  const { tag, url, name } = config;
  const invalidates = [tag, ...(tagDependencies[tag] || [])];
  // Use a Set to avoid duplicates
  const tagTypes = Array.from(new Set(invalidates));
  const api = createGenericAPI({
    reducerPath: `${config.name}Api`,
    tagTypes,
    baseUrl: config.url,
    endpoints: (builder) => ({
      [`getAll${config.tag}`]: builder.query({
        query: (params: any = {}) => {
          const queryString = buildQueryParams(params);
          return queryString ? `?${queryString}` : "";
        },
        providesTags: () => [tag],
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
        invalidatesTags: invalidates,
      }),
      [`update${config.tag}`]: builder.mutation({
        query: ({ id, ...body }: { id: number; [key: string]: any }) => ({
          url: `/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: invalidates,
      }),
      [`delete${config.tag}`]: builder.mutation({
        query: (id: number) => ({
          url: `/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: invalidates,
      }),
    }),
  });

  return api;
});
