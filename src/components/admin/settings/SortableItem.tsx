import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2, Save, Pencil } from "lucide-react";
import { useState } from "react";
import { slugify } from "@/lib/utils";

interface SortableItemProps {
  id: string;
  item: {
    id: number;
    title: string;
    slug: string;
    order: number;
  };
  onUpdate: (item: any) => void;
  onDelete: (id: number) => void;
}

export function SortableItem({
  id,
  item,
  onUpdate,
  onDelete,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [slug, setSlug] = useState(item.slug);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    const newSlug = slug.trim() || slugify(title);
    onUpdate({ ...item, title, slug: newSlug });
    setEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center gap-2 bg-white border rounded-md p-2"
    >
      <div {...listeners} className="cursor-grab p-2 text-slate-400">
        <GripVertical size={16} />
      </div>

      {editing ? (
        <div className="flex flex-1 items-center gap-2">
          {/* Title Input - Left */}
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(slugify(e.target.value)); // Optional: auto update slug
            }}
            className="w-1/3"
            placeholder="Title"
          />

          {/* Slug Input - Center */}
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-1/3"
            placeholder="Slug"
          />

          {/* Save Button - Right */}
          <div className="w-1/3 flex justify-end gap-1">
            <Button onClick={handleSave} variant="outline" size="icon">
              <Save size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(item.id)}
            >
              <Trash2
                size={16}
                className="text-muted-foreground hover:text-red-500"
              />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-between gap-2">
          {/* Title - Left */}
          <span className=" w-1/3 truncate">{item.title}</span>

          {/* Slug - Center */}
          <span className="text-sm text-muted-foreground w-1/3 truncate">
            {item.slug}
          </span>

          {/* Buttons - Right */}
          <div className="w-1/3 flex justify-end gap-1">
            <Button
              onClick={() => {
                setEditing(true);
                setTitle(item.title);
                setSlug(item.slug);
              }}
              variant="ghost"
              size="icon"
            >
              <Pencil size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(item.id)}
            >
              <Trash2
                size={16}
                className="text-muted-foreground hover:text-red-500"
              />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
