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

export default function PDFUploader() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

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
      if (data.thumbnails) {
        setThumbnails(data.thumbnails);
        setSelected(new Set(data.thumbnails));
      } else {
        toast.error("Failed to generate thumbnails");
      }
    } catch {
      toast.error("Upload error");
    }
    setLoading(false);
  };

  const toggleSelect = (url: string) => {
    const newSet = new Set(selected);
    if (newSet.has(url)) newSet.delete(url);
    else newSet.add(url);
    setSelected(newSet);
  };

  const removeThumbnail = (url: string) => {
    setThumbnails(thumbnails.filter((t) => t !== url));
    setSelected((prev) => {
      const newSet = new Set(prev);
      newSet.delete(url);
      return newSet;
    });
  };

  const onSave = async () => {
    if (selected.size === 0) {
      toast.error("Select at least one thumbnail to save");
      return;
    }
    setLoading(true);
    try {
      const date = new Date().toISOString().split("T")[0];

      const res = await fetch("/api/v9/pdf-uploads/save-selections", {
        method: "POST",
        body: JSON.stringify({ selected: Array.from(selected), date }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Images saved successfully");
        setThumbnails([]);
        setSelected(new Set());
        setOpen(false);
      } else {
        toast.error("Save failed");
      }
    } catch {
      toast.error("Save error");
    }
    setLoading(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* Upload Button */}
        <DialogTrigger asChild>
          <button
            className="w-36 h-48 border-2 border-dashed border-gray-400 flex items-center justify-center text-4xl font-bold text-gray-500 hover:border-gray-600 transition rounded-md cursor-pointer"
            aria-label="Upload PDF"
          >
            +
          </button>
        </DialogTrigger>

        {/* Modal Content */}
        <DialogContent className="max-w-3xl">
          <DialogTitle>Upload PDF & Select Thumbnails</DialogTitle>
          <DialogDescription>
            Upload your PDF file to generate thumbnails of each page.
          </DialogDescription>

          {/* File Input */}
          <input
            type="file"
            accept="application/pdf"
            onChange={onFileChange}
            disabled={loading}
            className="my-4"
          />

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          )}

          {/* Thumbnails Grid */}
          {!loading && thumbnails.length > 0 && (
            <div className="grid grid-cols-3 gap-4 my-4 max-h-[400px] overflow-y-auto">
              {thumbnails.map((url) => (
                <Card
                  key={url}
                  className={`relative cursor-pointer border ${
                    selected.has(url) ? "border-blue-600" : "border-transparent"
                  }`}
                  onClick={() => toggleSelect(url)}
                >
                  <img
                    src={url}
                    alt="thumbnail"
                    className="object-cover h-32 w-full"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeThumbnail(url);
                    }}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 hover:bg-red-100"
                    aria-label="Remove thumbnail"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                  {selected.has(url) && (
                    <div className="absolute bottom-1 right-1 bg-blue-600 rounded-full w-4 h-4"></div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={onSave} disabled={loading || selected.size === 0}>
              Save Selected
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sonner Toaster */}
      <Toaster position="top-center" />
    </>
  );
}
