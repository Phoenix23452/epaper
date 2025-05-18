// app/api/page-categories/route.ts
import { createAPIHandlers } from "@/lib/apiHandler";
import NewsPageRepository from "@/repos/NewsPageRepsitory";

const repo = new NewsPageRepository();
const handlers = createAPIHandlers(repo, "newsPage");

export const GET = handlers.GET;
export const POST = handlers.POST;
