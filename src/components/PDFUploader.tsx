"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import { Loader2, X } from "lucide-react";

type ThumbnailData = {
  page: number;
  thumbnailUrl: string;
};
type Props = {
  date: string | undefined;
};

export default function PDFUploader({ date }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uuid, setUuid] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<ThumbnailData[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/v9/pdf-uploads/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.data?.thumbnails) {
        setUuid(data.data.uuid);
        setThumbnails(data.data.thumbnails);
        setSelectedPages(
          new Set(data.data.thumbnails.map((t: ThumbnailData) => t.page)),
        );
      } else {
        toast.error("Failed to generate thumbnails");
      }
    } catch {
      toast.error("Upload error");
    }
    setLoading(false);
  };

  const toggleSelect = (page: number) => {
    const newSet = new Set(selectedPages);
    newSet.has(page) ? newSet.delete(page) : newSet.add(page);
    setSelectedPages(newSet);
  };

  const removeThumbnail = (page: number) => {
    setThumbnails(thumbnails.filter((t) => t.page !== page));
    setSelectedPages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(page);
      return newSet;
    });
  };

  const onSave = async () => {
    if (!uuid) {
      toast.error("Upload a PDF first");
      return;
    }

    if (selectedPages.size === 0) {
      toast.error("Select at least one thumbnail to save");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v9/pdf-uploads/save-selections", {
        method: "POST",
        body: JSON.stringify({
          uuid,
          date,
          pages: Array.from(selectedPages),
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Images saved successfully");
        setThumbnails([]);
        setSelectedPages(new Set());
        setOpen(false);
      } else {
        toast.error(data.error?.summary || "Save failed");
      }
    } catch {
      toast.error("Save error");
    }
    setLoading(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className="w-36 h-48 border-2 border-dashed border-gray-400 flex items-center justify-center text-4xl font-bold text-gray-500 hover:border-gray-600 transition rounded-md cursor-pointer"
            aria-label="Upload PDF"
          >
            +
          </button>
        </DialogTrigger>

        <DialogContent className=" sm:max-w-6xl w-full max-h-[90vh]">
          <DialogTitle>Upload PDF & Select Thumbnails</DialogTitle>
          <DialogDescription>
            Upload your PDF file to generate thumbnails of each page.
          </DialogDescription>

          <input
            type="file"
            accept="application/pdf"
            onChange={onFileChange}
            disabled={loading}
            className="my-4"
          />

          {loading && (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          )}

          {!loading && thumbnails.length > 0 && (
            <div className="grid grid-cols-5 gap-4 my-4 max-h-[300px] overflow-y-scroll">
              {thumbnails.map(({ page, thumbnailUrl }) => (
                <Card
                  key={page}
                  className={`relative py-0 overflow-hidden w-fit h-64  cursor-pointer border ${
                    selectedPages.has(page)
                      ? "border-blue-600"
                      : "border-transparent"
                  }`}
                  onClick={() => toggleSelect(page)}
                >
                  <div className="w-44 ">
                    <img
                      src={thumbnailUrl}
                      alt={`Page ${page}`}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeThumbnail(page);
                    }}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 hover:bg-red-100"
                    aria-label="Remove thumbnail"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                  {selectedPages.has(page) && (
                    <div className="absolute bottom-1 right-1 bg-blue-600 rounded-full w-4 h-4"></div>
                  )}
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={loading || selectedPages.size === 0}
            >
              Save Selected
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* <Toaster position="top-center" /> */}
    </>
  );
}
