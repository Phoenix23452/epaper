// app/api/newspaper-categories/[id]/route.ts
import NewspaperCategoryRepository from "@/repos/NewpaperCategoryRepsitory";
import { createItemAPIHandlers } from "@/lib/apiHandler";

const repo = new NewspaperCategoryRepository();
const handlers = createItemAPIHandlers(repo, "category");

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
