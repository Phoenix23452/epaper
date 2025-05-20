// src/services/PdfService.ts
import { Worker } from "worker_threads";
import path from "path";

export class PdfService {
  static runPdfToImagesWorker(uuid: string, pdfBuffer: Buffer): Promise<any> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(path.resolve("src/workers/pdfProcessor.ts"), {
        workerData: { uuid, pdfBuffer },
      });

      worker.on("message", resolve);
      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
      });
    });
  }
}
