// app/api/newspapers/route.ts
import { createAPIHandlers } from "@/lib/apiHandler";
import NewspaperRepository from "@/repos/NewspaperRepsitory";

const repo = new NewspaperRepository();
const handlers = createAPIHandlers(repo, "newspaper");

export const GET = handlers.GET;
export const POST = handlers.POST;
