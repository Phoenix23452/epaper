// lib/apiFactory.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export function createGenericAPI<T extends string>({
  reducerPath,
  tagType,
  baseUrl,
  endpoints,
}: {
  reducerPath: T;
  tagType: string;
  baseUrl: string;
  endpoints: (builder: any) => any;
}) {
  return createApi({
    reducerPath,
    baseQuery: fetchBaseQuery({ baseUrl }),
    tagTypes: [tagType],
    endpoints,
  });
}
