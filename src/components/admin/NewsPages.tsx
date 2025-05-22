// components/NewsPages.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { hooks } from "@/lib/redux/genratedHooks";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ImageMapper from "./ImageMapper";

function SortablePageCard({ page, onClick, onDelete }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-44 cursor-pointer border rounded-lg overflow-hidden relative"
      onClick={() => onClick(page)}
    >
      <Image
        src={page.thumbnail}
        alt="thumb"
        width={176}
        height={240}
        className="w-full h-auto object-cover"
        draggable={false}
      />
      <div className="p-2 text-center text-sm">
        {page.title?.title || "Untitled"}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(page.id);
        }}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
      >
        &times;
      </button>
    </div>
  );
}

export default function NewsPages({ date }: { date: string | undefined }) {
  const {
    useGetAllNewsPageQuery,
    useDeleteNewsPageMutation,
    useUpdateNewsPageMutation,
    useGetAllPageCategoryQuery,
  } = hooks;
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    titleId: Number(null),
    date: "",
  });

  const { data, refetch } = useGetAllNewsPageQuery({
    where: { date },
    include: { mapData: true, title: true },
  }) ?? { data: [], refetch: () => {} };

  const [deletePage] = useDeleteNewsPageMutation();
  const [updatePage] = useUpdateNewsPageMutation();
  const { data: categories } = useGetAllPageCategoryQuery({});

  const handleDelete = async (id: number) => {
    await deletePage(id);
  };

  const handleCardClick = (page: any) => {
    setSelectedPage(page);
    setFormData({
      titleId: page.titleId ?? null,
      date: page.date,
    });
    setOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedPage) return;
    await updatePage({ id: selectedPage.id, ...formData });
    setOpen(false);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {data?.data?.map((page: NewsPage) => (
        <div
          key={page.id}
          draggable
          onDragStart={(e) =>
            e.dataTransfer.setData("text/plain", page.id.toString())
          }
          className="w-44 cursor-pointer border rounded-lg overflow-hidden relative"
        >
          <Image
            src={page.thumbnail}
            alt="thumb"
            width={176}
            height={240}
            className="w-full h-auto object-cover !select-none"
            onClick={() => handleCardClick(page)}
          />
          <div className="p-2 text-center text-sm">
            {page.title?.title || "Untitled"}
          </div>
          <button
            onClick={() => handleDelete(page.id)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
          >
            &times;
          </button>
        </div>
      ))}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Edit News Page</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="edit">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="edit">Edit Page</TabsTrigger>
              <TabsTrigger value="image">Image Map</TabsTrigger>
            </TabsList>

            <TabsContent value="edit">
              <div className="space-y-4">
                <label className="block text-sm font-medium">Date</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />

                <label className="block text-sm font-medium">Category</label>
                <select
                  value={formData.titleId ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      titleId: Number(e.target.value),
                    })
                  }
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Category</option>
                  {categories?.data?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </select>

                <Button onClick={handleUpdate} className="w-full">
                  Update
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="image">
              {selectedPage ? (
                <ImageMapper
                  imageUrl={selectedPage.image}
                  newsPageId={selectedPage.id}
                  date={selectedPage.date}
                  mapData={selectedPage.mapData || []}
                  refetchPages={async (cb) => {
                    const result = await refetch();
                    const updatedPage = result.data?.data?.find(
                      (p: any) => p.id === selectedPage.id,
                    );
                    if (updatedPage) {
                      setSelectedPage(updatedPage);
                      console.log("Updated Page:", updatedPage);
                    }
                    cb?.();
                  }}
                />
              ) : (
                <p>Please select a page to map.</p>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
