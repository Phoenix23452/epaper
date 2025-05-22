// lib/apiFactory.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export function createGenericAPI<T extends string>({
  reducerPath,
  tagTypes,
  baseUrl,
  endpoints,
}: {
  reducerPath: T;
  tagTypes: string[];
  baseUrl: string;
  endpoints: (builder: any) => any;
}) {
  return createApi({
    reducerPath,
    baseQuery: fetchBaseQuery({ baseUrl }),
    tagTypes,
    endpoints,
  });
}
