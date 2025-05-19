// store.ts
import { allApis } from "@/lib/redux/apiAutoGen";
import { configureStore } from "@reduxjs/toolkit";

const reducers: Record<string, any> = {};
const middlewares: any[] = [];

for (const api of allApis) {
  reducers[api.reducerPath] = api.reducer;
  middlewares.push(api.middleware);
}

export const store = configureStore({
  reducer: {
    ...reducers,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...middlewares),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
