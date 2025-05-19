// lib/generatedHooks.ts

import { allApis } from "./apiAutoGen";

const hookMap = Object.fromEntries(
  allApis.flatMap((api) =>
    Object.entries(api).filter(([key]) => key.startsWith("use")),
  ),
);

export const hooks = hookMap as Record<string, (...args: any[]) => any>;
