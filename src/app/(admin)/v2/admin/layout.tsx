import AdminSidebar from "@/components/admin/AdminSidebar";
import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex">
      <div>
        <AdminSidebar />
      </div>
      <div>{children}</div>
    </main>
  );
}
