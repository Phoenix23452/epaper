// app/api/newspapers[id]/route.ts
import { createItemAPIHandlers } from "@/lib/apiHandler";
import NewspaperRepository from "@/repos/NewspaperRepsitory";

const repo = new NewspaperRepository();
const handlers = createItemAPIHandlers(repo, "newspaper");

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
