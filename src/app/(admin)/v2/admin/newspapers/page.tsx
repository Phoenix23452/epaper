import AdminContainer from "@/components/admin/AdminContainer";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default function Page() {
  return (
    <AdminContainer heading="NewsPapers">
      <CardHeader>
        <CardTitle className="text-2xl font-medium">All Newpapers</CardTitle>

        <CardContent></CardContent>
      </CardHeader>
    </AdminContainer>
  );
}
