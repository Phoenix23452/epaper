// app/api/news-pages/[id]/route.ts
import { createItemAPIHandlers } from "@/lib/apiHandler";
import NewsPageRepository from "@/repos/NewsPageRepsitory";

const repo = new NewsPageRepository();

const handlers = createItemAPIHandlers(repo, "newsPage");

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
