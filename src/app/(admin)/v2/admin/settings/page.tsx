import AdminContainer from "@/components/admin/AdminContainer";
import NewspaperCategory from "@/components/admin/settings/NewspaperCategory";
import PageCategory from "@/components/admin/settings/PageCategory";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

export default function Page() {
  // const [createCategory, { isLoading }] = hooks.useCreatePageCategoryMutation();

  return (
    <AdminContainer heading="Settings">
      <CardHeader>
        <CardTitle className="text-2xl font-medium">
          Manage Categories
        </CardTitle>
        <Tabs defaultValue="newspage" className="w-full">
          <TabsList className="w-full h-10  mt-8 mb-6">
            <TabsTrigger value="newspage">Newpage Categories</TabsTrigger>
            <TabsTrigger value="newspaper">Newpage Categories</TabsTrigger>
          </TabsList>
          <TabsContent value="newspage">
            <PageCategory />
          </TabsContent>
          <TabsContent value="newspaper">
            <NewspaperCategory />
          </TabsContent>
        </Tabs>

        <CardContent></CardContent>
      </CardHeader>
    </AdminContainer>
  );
}
