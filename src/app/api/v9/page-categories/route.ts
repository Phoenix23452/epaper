// app/api/page-categories/route.ts
import { createAPIHandlers } from "@/lib/apiHandler";
import PageCategoryRepository from "@/repos/PageCategoryRepsitory";
const repo = new PageCategoryRepository();
const handlers = createAPIHandlers(repo, "category");

export const GET = handlers.GET;
export const POST = handlers.POST;
