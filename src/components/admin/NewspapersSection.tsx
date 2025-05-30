"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { hooks } from "@/lib/redux/genratedHooks";
import { toast } from "sonner";

type Newspaper = {
  id: number;
  date: string;
  titleId: number;
  title: { id: number; title: string };
  newspaperPages: { id: number; thumbnail: string }[];
};

type PageCategory = { id: number; title: string };

export default function NewspapersSection({
  date,
}: {
  date: string | undefined;
}) {
  const {
    useGetAllNewspaperQuery,
    useGetAllNewspaperCategoryQuery,
    useCreateNewspaperMutation,
    useUpdateNewspaperMutation,
  } = hooks;

  const [filterTitleId, setFilterTitleId] = useState<number | "">("");
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<{
    titleId: number | "";
    date: string | undefined;
  }>({
    titleId: "",
    date: date || "",
  });

  // Fetch newspapers with filter and include pages
  const { data, refetch } = useGetAllNewspaperQuery(
    filterTitleId
      ? {
          where: { date, titleId: filterTitleId },
          include: { newspaperPages: true, title: true },
        }
      : { where: { date }, include: { newspaperPages: true, title: true } },
  ) ?? { data: [], refetch: () => {} };

  // Get newspaper categories (titles)
  const { data: categoriesData } = useGetAllNewspaperCategoryQuery();

  const [createNewspaper] = useCreateNewspaperMutation();
  const [updateNewspaper] = useUpdateNewspaperMutation();

  // Open add modal and reset form
  const openAddModal = () => {
    setFormData({ titleId: "", date });
    setOpen(true);
  };

  // Create newspaper handler
  const handleCreate = async () => {
    if (!formData.titleId) return toast.info("Select title");
    // One title per date allowed: check if exists
    const exists = data?.data?.some(
      (n: Newspaper) =>
        n.titleId === formData.titleId && n.date === formData.date,
    );
    if (exists) {
      toast.info("Newspaper with this title already exists for the date");
      return;
    }
    await createNewspaper({
      date: formData.date,
      titleId: Number(formData.titleId),
    });
    await refetch();
    setOpen(false);
  };

  // Handle drop page onto newspaper card
  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    newspaperId: number,
  ) => {
    e.preventDefault();
    const pageId = Number(e.dataTransfer.getData("text/plain"));
    if (!pageId) return;
    // Find newspaper to update pages array
    const newspaper = data?.data?.find((n: Newspaper) => n.id === newspaperId);
    if (!newspaper) return;

    // If page already in newspaper, ignore
    if (newspaper.newspaperPages.some((p: NewsPage) => p.id === pageId)) return;

    await updateNewspaper({
      id: newspaperId,
      newspaperPages: {
        connect: [{ id: pageId }],
      },
    });
    await refetch();
  };

  // Remove page from newspaper
  const handleRemovePage = async (newspaperId: number, pageId: number) => {
    const newspaper = data?.data?.find((n: Newspaper) => n.id === newspaperId);
    if (!newspaper) return;
    await updateNewspaper({
      id: newspaperId,
      newspaperPages: {
        disconnect: [{ id: pageId }],
      },
    });
    await refetch();
  };

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <Select
          value={filterTitleId === "" ? "all" : String(filterTitleId)}
          onValueChange={(v) => setFilterTitleId(v === "all" ? "" : Number(v))}
        >
          <SelectTrigger className="w-52">
            <span>
              {filterTitleId
                ? categoriesData?.data?.find(
                    (c: BaseCategory) => c.id === filterTitleId,
                  )?.title
                : "Filter by title"}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Titles</SelectItem>
            {categoriesData?.data?.map((cat: NewspaperCategory) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={openAddModal}>Add Newspaper</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Newspaper</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block text-sm font-medium">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full"
            />

            <label className="block text-sm font-medium">Title</label>
            <Select
              value={formData.titleId === "" ? "" : String(formData.titleId)}
              onValueChange={(v) =>
                setFormData({ ...formData, titleId: Number(v) })
              }
            >
              <SelectTrigger className="w-full">
                <span>
                  {formData.titleId
                    ? categoriesData?.data?.find(
                        (c: NewspaperCategory) => c.id === formData.titleId,
                      )?.title
                    : "Select Title"}
                </span>
              </SelectTrigger>
              <SelectContent>
                {categoriesData?.data?.map((cat: NewspaperCategory) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-6 mt-6 min-h-8">
        {data?.data?.map((newspaper: Newspaper) => (
          <div
            key={newspaper.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, newspaper.id)}
            className="border p-4 rounded-lg bg-gray-50 w-full cursor-pointer"
          >
            <h3 className="font-semibold mb-2">
              {newspaper.title.title} — {newspaper.date}
            </h3>

            <div className="flex flex-wrap gap-2 min-h-24">
              {newspaper.newspaperPages.map((page) => (
                <div
                  key={page.id}
                  className="relative w-20 h-28 border rounded overflow-hidden"
                >
                  <img
                    src={page.thumbnail}
                    alt="page thumb"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  <button
                    onClick={() => handleRemovePage(newspaper.id, page.id)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-bl px-1 text-xs"
                    aria-label="Remove page"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
