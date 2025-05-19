"use client";
import AdminContainer from "@/components/admin/AdminContainer";
import { DatePicker } from "@/components/DatePicker";
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

  return (
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
      <CardHeader>
        <CardTitle className="text-2xl font-medium">Available Pages</CardTitle>
        <CardDescription>
          Upload PDF or drag pages to create a newspaper
        </CardDescription>
        <Separator className="my-6" />

        <CardContent>
          <>
            <PDFUploader />
          </>
        </CardContent>
      </CardHeader>
    </AdminContainer>
  );
}
