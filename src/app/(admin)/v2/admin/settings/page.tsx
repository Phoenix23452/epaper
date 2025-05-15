import AdminContainer from "@/components/admin/AdminContainer";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default function Page() {
  return (
    <AdminContainer heading="Settings">
      <CardHeader>
        <CardTitle className="text-2xl font-medium">
          Manage Categories
        </CardTitle>

        <CardContent></CardContent>
      </CardHeader>
    </AdminContainer>
  );
}
