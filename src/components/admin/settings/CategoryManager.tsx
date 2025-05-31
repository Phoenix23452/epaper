"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { slugify } from "@/lib/utils";
import { SortableItem } from "./SortableItem";
import { toast } from "sonner"; // <-- Make sure you have Sonner installed

interface CategoryItem {
  id: number;
  title: string;
  slug: string;
  order: number;
}

interface CategoryManagerProps {
  data: CategoryItem[];
  onCreate: (item: Omit<CategoryItem, "id">) => void;
  onUpdate: (item: CategoryItem) => void;
  onDelete: (id: number) => void;
  onReorder: (items: CategoryItem[]) => void; // <-- make sure this is async
  label?: string;
}

export function CategoryManager({
  data,
  onCreate,
  onUpdate,
  onDelete,
  onReorder,
  label = "Category",
}: CategoryManagerProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [localItems, setLocalItems] = useState<CategoryItem[]>(data);

  // Sync local items when fresh data is received
  useEffect(() => {
    setLocalItems(data);
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleCreate = () => {
    if (!title.trim()) return;
    onCreate({ title, slug: slug || slugify(title), order: data.length });
    setTitle("");
    setSlug("");
    setIsSlugEdited(false);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localItems.findIndex(
      (item) => item.id === Number(active.id),
    );
    const newIndex = localItems.findIndex(
      (item) => item.id === Number(over.id),
    );

    const newItems = arrayMove(localItems, oldIndex, newIndex).map(
      (item, index) => ({
        ...item,
        order: index,
      }),
    );

    // Optimistically update UI
    setLocalItems(newItems);

    try {
      await onReorder(newItems);
      toast.success("Reordering updated");
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">{label} Title</label>
          <Input
            placeholder="Enter title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!isSlugEdited) setSlug(slugify(e.target.value));
            }}
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Slug</label>
          <Input
            placeholder="Slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setIsSlugEdited(true);
            }}
          />
        </div>
        <Button onClick={handleCreate}>
          <Plus size={16} className="mr-1" />
          Add
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={localItems.map((d) => String(d.id))}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {localItems.length === 0 && (
              <div className="text-center text-muted border border-dashed rounded-md py-6">
                No {label.toLowerCase()}s added yet
              </div>
            )}
            {localItems.map((item) => (
              <SortableItem
                key={item.id}
                id={String(item.id)}
                item={item}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
