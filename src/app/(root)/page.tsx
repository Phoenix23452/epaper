"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import NewspaperHeader from "@/components/NewspaperHeader";
import { hooks } from "@/lib/redux/genratedHooks";

const ClientHome = () => {
  const router = useRouter();
  const { useGetAllNewspaperQuery } = hooks;

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [selectedNewspaperId, setSelectedNewspaperId] = useState<number | null>(
    null,
  );

  // Fetch newspapers for selected date, include only 'home' pages
  const { data: newspapers = [], isLoading } = useGetAllNewspaperQuery({
    where: { date: selectedDate },
    include: {
      newspaperPages: {
        title: true,
      },
      title: true,
    },
  });
  console.log(newspapers);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedNewspaperId(null);
  };

  const handleNewspaperChange = (id: number) => {
    setSelectedNewspaperId(id);
    router.push(`/newspaper/${id}`);
  };

  const getHomeThumbnail = (newspaper: Newspaper) =>
    newspaper.newspaperPages?.find((p: any) => p?.title?.slug === "home")
      ?.image;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl">Loading newspapers...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NewspaperHeader
        newspapers={newspapers.data}
        selectedDate={selectedDate}
        selectedNewspaperId={selectedNewspaperId}
        onDateChange={handleDateChange}
        onNewspaperChange={handleNewspaperChange}
      />

      <main className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">
          Available Newspapers for{" "}
          {format(new Date(selectedDate), "MMMM d, yyyy")}
        </h2>

        {newspapers.length === 0 ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-md">
            <h3 className="text-lg font-medium">No newspapers available</h3>
            <p>Please select a different date to view available newspapers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newspapers.data.map((newspaper: Newspaper) => {
              const thumbnail = getHomeThumbnail(newspaper);
              return (
                <Card
                  key={newspaper.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <CardTitle>{newspaper.title?.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <AspectRatio
                      ratio={3 / 4}
                      className="bg-slate-100 rounded overflow-hidden"
                    >
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={`${newspaper.title?.title} front page`}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Skeleton className="h-full w-full absolute" />
                          <span className="text-slate-400 relative z-10">
                            Loading Preview...
                          </span>
                        </div>
                      )}
                    </AspectRatio>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => router.push(`/newspaper/${newspaper.id}`)}
                    >
                      View Newspaper
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
};

export default ClientHome;
