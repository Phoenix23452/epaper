"use client";
import { hooks } from "@/lib/redux/genratedHooks";
import { CategoryManager } from "./CategoryManager";

export default function NewspaperCategory() {
  const {
    useGetAllNewspaperCategoryQuery,
    useCreateNewspaperCategoryMutation,
    useUpdateNewspaperCategoryMutation,
    useDeleteNewspaperCategoryMutation,
  } = hooks;
  const { data } = useGetAllNewspaperCategoryQuery({
    orderBy: {
      order: "asc", // or "desc"
    },
  });
  const [create] = useCreateNewspaperCategoryMutation();
  const [update] = useUpdateNewspaperCategoryMutation();
  const [remove] = useDeleteNewspaperCategoryMutation();
  if (data) {
    console.log("Fetched data:", data);
  }
  const categories = data?.data ?? []; // <-- Ensure this is the array
  return (
    <CategoryManager
      label="Newspaper Category"
      data={categories}
      onCreate={(item) => create(item)}
      onUpdate={(item) => update(item)}
      onDelete={(id) => remove(id)}
      onReorder={(items) => {
        items.forEach((item) => update(item));
      }}
    />
  );
}
