import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";
import { headers } from "next/headers";

export default async function Layout({ children }: { children: ReactNode }) {
  const pathname = (await headers()).get("x-next-pathname") as string;

  return (
    <SidebarProvider>
      <AdminSidebar pathname={pathname} />

      <main className="w-full">
        <SidebarTrigger />
        <div className="px-8 ">{children}</div>
      </main>
    </SidebarProvider>
  );
}
