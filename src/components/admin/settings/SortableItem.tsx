import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2, Save } from "lucide-react";
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
    onUpdate({ ...item, title, slug: slug || slugify(title) });
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
        <div className="flex flex-1 gap-2">
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(slugify(e.target.value));
            }}
          />
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          <Button onClick={handleSave} variant="outline" size="icon">
            <Save size={16} />
          </Button>
        </div>
      ) : (
        <div
          className="flex flex-1 justify-between items-center px-2 cursor-pointer"
          onClick={() => setEditing(true)}
        >
          <span className="text-sm">{item.title}</span>
          <span className="text-xs text-muted-foreground">/{item.slug}</span>
        </div>
      )}

      <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
        <Trash2
          size={16}
          className="text-muted-foreground hover:text-red-500"
        />
      </Button>
    </div>
  );
}
