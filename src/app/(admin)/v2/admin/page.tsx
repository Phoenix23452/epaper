"use client";
import AdminContainer from "@/components/admin/AdminContainer";
import NewsPages from "@/components/admin/NewsPages";
import NewspapersSection from "@/components/admin/NewspapersSection";
import TmpCleaner from "@/components/admin/TmpCleaner";
import { DatePicker } from "@/components/ui/date-picker";
import PDFUploader from "@/components/PDFUploader";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";

export default function Page() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });

  const formattedDate = selectedDate?.toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  return (
    <>
      <AdminContainer
        heading="NewsPapers"
        secondaryChildren={
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            placeholder="Enter Date "
          />
        }
      >
        <CardHeader className="my-auto">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-medium">
                Available Pages
              </CardTitle>
              <CardDescription>
                Upload PDF or drag pages to create a newspaper
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <PDFUploader date={formattedDate} />

              <TmpCleaner />
            </div>
          </div>
        </CardHeader>
        <Separator />

        <CardContent>
          {/* NewsPages */}
          <NewsPages date={formattedDate} />
        </CardContent>
        <CardContent></CardContent>
      </AdminContainer>
      <AdminContainer>
        <NewspapersSection date={formattedDate} />
      </AdminContainer>
    </>
  );
}
