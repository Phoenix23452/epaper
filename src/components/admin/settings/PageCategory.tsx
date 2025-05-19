"use client";
import { hooks } from "@/lib/redux/genratedHooks";
import { CategoryManager } from "./CategoryManager";

export default function PageCategory() {
  const {
    useGetAllPageCategoryQuery,
    useCreatePageCategoryMutation,
    useUpdatePageCategoryMutation,
    useDeletePageCategoryMutation,
  } = hooks;
  const { data } = useGetAllPageCategoryQuery();
  const [create] = useCreatePageCategoryMutation();
  const [update] = useUpdatePageCategoryMutation();
  const [remove] = useDeletePageCategoryMutation();
  if (data) {
    console.log("Fetched data:", data);
  }
  const categories = data?.data ?? []; // <-- Ensure this is the array
  return (
    <CategoryManager
      label="Page Category"
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
