import { hooks } from "@/lib/redux/genratedHooks";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";

type MapArea = {
  id: number;
  coordinates: { x: number; y: number; width: number; height: number };
  croppedImage: string;
  title?: string;
};

type MapData = {
  id: number;
  coordinates: string;
  croppedImage: string;
  title?: string;
};

type Props = {
  imageUrl: string;
  newsPageId: number;
  date: string;
  mapData: MapData[];
  refetchPages?: (afterRefetch?: () => void) => void;
};

function parseCoordinates(raw: string): MapArea["coordinates"] | null {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function ImageMapper({
  imageUrl,
  newsPageId,
  date,
  mapData,
  refetchPages,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [rect, setRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);

  const { useCreateMapDataMutation, useDeleteMapDataMutation } = hooks;
  const [uploadMapData] = useCreateMapDataMutation();
  const [deleteMapData] = useDeleteMapDataMutation();

  function handleMouseDown(e: React.MouseEvent) {
    if (isDrawing || !containerRef.current) return;

    const bounds = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;

    setStartPos({ x, y });
    setRect({ x, y, width: 0, height: 0 });
    setIsDrawing(true);
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDrawing || !startPos || !containerRef.current) return;

    const bounds = containerRef.current.getBoundingClientRect();
    let currentX = ((e.clientX - bounds.left) / bounds.width) * 100;
    let currentY = ((e.clientY - bounds.top) / bounds.height) * 100;

    currentX = Math.min(Math.max(currentX, 0), 100);
    currentY = Math.min(Math.max(currentY, 0), 100);

    const x = Math.min(startPos.x, currentX);
    const y = Math.min(startPos.y, currentY);
    const width = Math.abs(currentX - startPos.x);
    const height = Math.abs(currentY - startPos.y);

    setRect({ x, y, width, height });
  }

  async function handleUp() {
    if (!isDrawing || !rect || !imgRef.current || !canvasRef.current) return;
    setIsDrawing(false);

    if (rect.width < 1 || rect.height < 1) {
      toast("Please select a larger area.");
      return;
    }

    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cropX = (rect.x / 100) * img.naturalWidth;
    const cropY = (rect.y / 100) * img.naturalHeight;
    const cropWidth = (rect.width / 100) * img.naturalWidth;
    const cropHeight = (rect.height / 100) * img.naturalHeight;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight,
    );

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.9),
    );

    if (!blob) {
      toast("Failed to crop image");
      return;
    }

    setCroppedBlob(blob);
  }

  async function handleSave() {
    if (!croppedBlob || !rect) return;

    const formData = new FormData();
    formData.append("date", date);
    formData.append(
      "image",
      new File([croppedBlob], "cropped.jpg", { type: "image/jpeg" }),
    );

    const res = await fetch("/api/v9/map-data/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      toast("Upload failed");
      return;
    }

    const { imageUrl } = await res.json();

    try {
      await uploadMapData({
        croppedImage: imageUrl,
        coordinates: JSON.stringify(rect),
        newsPageId,
      }).unwrap();
      refetchPages?.(() => {
        toast("Map data saved");
      });
      setRect(null);
      setCroppedBlob(null);
    } catch {
      toast("Failed to save map data");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this mapped area?")) return;
    try {
      await deleteMapData(id).unwrap();
      refetchPages?.();
    } catch {
      toast("Failed to delete");
    }
  }

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl mx-auto select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleUp}
      >
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Main"
          className="w-full h-auto block"
          draggable={false}
        />

        {rect && (
          <div
            className="absolute border-2 border-red-500 bg-red-500/20 pointer-events-none"
            style={{
              left: `${rect.x}%`,
              top: `${rect.y}%`,
              width: `${rect.width}%`,
              height: `${rect.height}%`,
            }}
          />
        )}

        {mapData.map((area) => {
          const coords = parseCoordinates(area.coordinates);
          if (!coords) return null;

          return (
            <div
              key={area.id}
              className="absolute border-2 border-blue-500 bg-blue-500/20 cursor-pointer"
              style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`,
                width: `${coords.width}%`,
                height: `${coords.height}%`,
              }}
              title={area.title || ""}
              onClick={() => setPreviewUrl(area.croppedImage)}
            >
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 text-xs h-5 w-5 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(area.id);
                }}
              >
                ×
              </Button>
            </div>
          );
        })}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {croppedBlob && rect && (
        <Button onClick={handleSave} className="mt-4">
          Save Area
        </Button>
      )}

      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="p-0 bg-transparent border-none shadow-none">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-[90vw] max-h-[90vh] rounded-xl"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
