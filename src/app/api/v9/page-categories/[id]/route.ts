// app/api/page-categories/[id]/route.ts
import PageCategoryRepository from "@/repos/PageCategoryRepsitory";
import { createItemAPIHandlers } from "@/lib/apiHandler";

const repo = new PageCategoryRepository();
const handlers = createItemAPIHandlers(repo, "category");

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
