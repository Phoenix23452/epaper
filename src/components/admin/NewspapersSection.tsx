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
import { FileX2, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { getDateString } from "@/lib/utils";
import { title } from "process";
import { CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

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
    useDeleteNewspaperMutation,
  } = hooks;

  const [filterTitleId, setFilterTitleId] = useState<number | "">("");
  const [open, setOpen] = useState(false);
  const [selectedNewspaperId, setSelectedNewspaperId] = useState<number | null>(
    null,
  );

  const [formData, setFormData] = useState<{
    titleId: number | "";
    date: Date | undefined;
  }>({
    titleId: "",
    date: date ? new Date(date) : undefined,
  });

  // Fetch newspapers with filter and include pages
  const { data, refetch } = useGetAllNewspaperQuery(
    filterTitleId
      ? {
          where: { date, titleId: filterTitleId },
          include: {
            newspaperPages: {
              title: true,
            },
            title: true,
          },
        }
      : {
          where: { date },
          include: {
            newspaperPages: {
              title: true,
            },
            title: true,
          },
        },
  ) ?? { data: [], refetch: () => {} };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 8000);
    if (data?.data) {
      clearTimeout(timeout);
      setLoading(false);
    }
    return () => clearTimeout(timeout);
  }, [data]);

  // Get newspaper categories (titles)
  const { data: categoriesData } = useGetAllNewspaperCategoryQuery();

  const [createNewspaper] = useCreateNewspaperMutation();
  const [updateNewspaper] = useUpdateNewspaperMutation();
  const [deleteNewspaper] = useDeleteNewspaperMutation();

  // Open add modal and reset form
  const openAddModal = () => {
    setFormData({ titleId: "", date: date ? new Date(date) : undefined });
    setSelectedNewspaperId(null); // reset
    setOpen(true);
  };

  const handleSave = async () => {
    if (!formData.titleId) return toast.info("Select title");

    const sameComboExists = data?.data?.some((n: Newspaper) => {
      return (
        n.titleId === formData.titleId &&
        n.date === getDateString(formData.date) &&
        n.id !== selectedNewspaperId // Exclude current newspaper in case of update
      );
    });

    if (sameComboExists) {
      toast.info("Newspaper with this title already exists for the date");
      return;
    }

    if (selectedNewspaperId) {
      // Update existing newspaper
      await updateNewspaper({
        id: selectedNewspaperId,
        titleId: Number(formData.titleId),
        date: getDateString(formData.date),
      });
      toast.success("Newspaper updated");
    } else {
      // Create new newspaper
      await createNewspaper({
        date: getDateString(formData.date),
        titleId: Number(formData.titleId),
      });
      toast.success("Newspaper created");
    }

    await refetch();
    setOpen(false);
  };
  const handleDelete = async (id: number) => {
    const { data: response } = await deleteNewspaper(id);
    if (response?.success) toast.success(response?.message);
    await refetch();
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
    if (newspaper.newspaperPages.some((p: NewsPage) => p.id === pageId)) {
      toast.info("Already Exists");
      return;
    }

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
    <section className="mt-6  ">
      <div className="flex items-center px-6 justify-between mb-4">
        <CardTitle className="text-2xl font-medium">
          Available Newspapers
        </CardTitle>
        <div className="flex items-center gap-4">
          <Select
            value={filterTitleId === "" ? "all" : String(filterTitleId)}
            onValueChange={(v) =>
              setFilterTitleId(v === "all" ? "" : Number(v))
            }
          >
            <SelectTrigger className="w-52">
              <span>
                {filterTitleId
                  ? categoriesData?.data?.find(
                      (c: BaseCategory) => c.id === filterTitleId,
                    )?.title
                  : "Filter by Title"}
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
      </div>
      <Separator className="my-8" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Newspaper</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block text-sm font-medium">Date</label>

            <DatePicker
              className="w-full  "
              value={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
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
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-6 px-6 mt-6 min-h-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center text-gray-500 animate-pulse">
              <LoaderCircle className="w-20 h-20 animate-spin mb-2" />
              <span>Loading newspapers...</span>
            </div>
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-gray-500">
            <FileX2 className="w-20 h-20 mb-2" />
            <p>No newspapers available for this date.</p>
          </div>
        ) : (
          data?.data?.map((newspaper: Newspaper) => (
            <div
              key={newspaper.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, newspaper.id)}
              className="border p-4 rounded-lg bg-gray-50 w-full cursor-pointer"
            >
              <h3 className="font-semibold mb-2 flex justify-between items-center">
                <span>
                  {newspaper.title.title} — {newspaper.date}
                </span>
                <span className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setFormData({
                        titleId: newspaper.titleId,
                        date: new Date(newspaper.date),
                      });
                      setSelectedNewspaperId(newspaper.id); // Set ID for editing
                      setOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      // Add delete mutation logic here
                      handleDelete(newspaper.id);
                    }}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </span>
              </h3>

              <div className="flex flex-wrap gap-2 min-h-48 items-center ">
                {newspaper.newspaperPages?.length === 0 ? (
                  <div className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-md py-10 text-center text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 mb-2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-sm">Drop newspaper pages here</p>
                  </div>
                ) : (
                  newspaper.newspaperPages?.map((page) => (
                    <div className="border rounded" key={page.id}>
                      <div className="relative w-32 h-48  overflow-hidden">
                        <img
                          src={page.thumbnail}
                          alt="page thumb"
                          className="w-full h-full object-cover  border-b border-b-red-700"
                          draggable={false}
                        />

                        <button
                          onClick={() =>
                            handleRemovePage(newspaper.id, page.id)
                          }
                          className="absolute top-0 right-0 bg-red-600 text-white rounded-bl px-1 text-xs"
                          aria-label="Remove page"
                        >
                          ×
                        </button>
                      </div>{" "}
                      <p className="text-sm py-2 text-accent-foreground text-center">
                        {page.title?.title || "Untitled"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
