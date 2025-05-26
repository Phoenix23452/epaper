"use client";
import { useEffect, useState } from "react";

import { format } from "date-fns";
import { hooks } from "@/lib/redux/genratedHooks";
import NewspaperHeader from "@/components/NewspaperHeader";
import { useRouter } from "next/navigation";
import StoryModal from "./StoryModal";
import PaperView from "./PaperView";

type Props = {
  id: string;
};

export default function NewspaperView({ id }: Props) {
  const navigate = useRouter();
  const { useGetAllNewspaperQuery } = hooks;
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [selectedNewspaperId, setSelectedNewspaperId] = useState<number | null>(
    id ? parseInt(id) : null,
  );
  const [selectedStory, setSelectedStory] = useState<MapData | null>(null);
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

  const { data: newspaper = [] } = useGetAllNewspaperQuery({
    where: { id: Number(selectedNewspaperId) },
    include: {
      newspaperPages: {
        title: true,
        mapData: true,
      },
      title: true,
    },
  });
  console.log(newspaper);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleNewspaperChange = (id: number) => {
    setSelectedNewspaperId(id);
    navigate.push(`/newspaper/${id}`);
  };

  // Handle story click
  const handleStoryClick = (story: MapData) => {
    console.log("Story clicked - :", story);

    if (story) {
      setSelectedStory(story);
    }
  };

  useEffect(() => {
    if (newspaper) {
      setSelectedDate(newspaper.date);
    }
  }, [newspaper]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl">Loading newspaper...</p>
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

      <main className="container mx-auto py-6 px-4">
        {!selectedNewspaperId || newspaper?.data[0]?.newsapaperPages === 0 ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-md">
            <h2 className="text-lg font-medium">No newspaper available</h2>
            <p>Please select a different date or edition.</p>
          </div>
        ) : (
          <PaperView
            pages={newspaper.data[0]?.newspaperPages}
            onStoryClick={handleStoryClick}
          />
        )}
      </main>

      {selectedStory && (
        <StoryModal
          story={selectedStory}
          isOpen={!!selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </>
  );
}
