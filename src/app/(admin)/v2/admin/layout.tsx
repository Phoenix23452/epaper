import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";
import SessionWrapper from "./SessionWrapper";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <SessionWrapper>
      <SidebarProvider>
        <AdminSidebar />

        <main className="w-full">
          <SidebarTrigger />
          <div className="px-8 ">{children}</div>
        </main>
      </SidebarProvider>
    </SessionWrapper>
  );
}
