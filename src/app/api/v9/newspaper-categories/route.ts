// app/api/page-categories/route.ts
import { createAPIHandlers } from "@/lib/apiHandler";
import NewspaperCategoryRepository from "@/repos/NewpaperCategoryRepsitory";
const repo = new NewspaperCategoryRepository();
const handlers = createAPIHandlers(repo, "category");

export const GET = handlers.GET;
export const POST = handlers.POST;
