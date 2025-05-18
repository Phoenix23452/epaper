// app/api/map-data/[id]/route.ts
import MapDataRepository from "@/repos/MapDataRepsitory";
import { createItemAPIHandlers } from "@/lib/apiHandler";

const repo = new MapDataRepository();

const handlers = createItemAPIHandlers(repo, "mapData");

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
