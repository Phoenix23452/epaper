// app/api/page-categories/route.ts
import { createAPIHandlers } from "@/lib/apiHandler";
import MapDataRepository from "@/repos/MapDataRepsitory";

const repo = new MapDataRepository();
const handlers = createAPIHandlers(repo, "mapData");

export const GET = handlers.GET;
export const POST = handlers.POST;
