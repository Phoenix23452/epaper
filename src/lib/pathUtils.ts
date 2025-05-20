// src/utils/pathUtils.ts
import path from "path";
import os from "os";

export const getTmpDir = (uuid: string) => path.join(os.tmpdir(), uuid);

export const getMediaDir = (date: string) => path.join("public/media", date);
export const getThumbDir = (date: string) =>
  path.join(getMediaDir(date), "thumbnail");

export const getPageFileName = (uuid: string, page: number) => ({
  full: `${uuid}-page-${page}-full.webp`,
  thumb: `${uuid}-page-${page}-thumb.webp`,
});
