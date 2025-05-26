import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useIsMobile } from "@/hooks/use-mobile";
import StoryArea from "./StoryArea";

interface PaperViewProps {
  pages: NewsPage[];

  onStoryClick: (mapData: MapData) => void;
}

const PaperView = ({ pages, onStoryClick }: PaperViewProps) => {
  const [currentPage, setCurrentPage] = useState(
    pages.length > 0 ? pages[0].id : 0,
  );
  const isMobile = useIsMobile();

  const handlePrevPage = () => {
    const currentIndex = pages.findIndex((page) => page.id === currentPage);
    if (currentIndex > 0) {
      setCurrentPage(pages[currentIndex - 1].id);
    }
  };

  const handleNextPage = () => {
    const currentIndex = pages.findIndex((page) => page.id === currentPage);
    if (currentIndex < pages.length - 1) {
      setCurrentPage(pages[currentIndex + 1].id);
    }
  };

  const selectedPage = pages.find((page) => page.id === currentPage);

  if (pages.length === 0) {
    return (
      <div className="text-center py-8">
        No pages available for this edition.
      </div>
    );
  }

  // Get page title
  const getPageTitle = (page: NewsPage, index: number) => {
    return page.title?.title || `Page ${index + 1}`;
  };

  // Debug logging to check if mapData contains entries for the current page
  console.log("Current page ID:", currentPage);

  return (
    <div className="w-full  mx-auto">
      <div className="flex items-center justify-between mb-4 relative">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevPage}
          disabled={pages.findIndex((page) => page.id === currentPage) === 0}
          className="z-10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="absolute left-0 right-0 mx-auto flex justify-center pointer-events-none">
          <Tabs
            value={currentPage.toString()}
            onValueChange={(value) => setCurrentPage(parseInt(value))}
          >
            <TabsList className="pointer-events-auto">
              <ScrollArea className={isMobile ? "w-[260px]" : "w-[500px]"}>
                <div className="flex space-x-1">
                  {pages.map((page, index) => (
                    <TabsTrigger
                      key={page.id}
                      value={page.id.toString()}
                      className="min-w-[100px]"
                    >
                      {getPageTitle(page, index)}
                    </TabsTrigger>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </TabsList>
          </Tabs>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextPage}
          disabled={
            pages.findIndex((page) => page.id === currentPage) ===
            pages.length - 1
          }
          className="z-10"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative w-full">
        {selectedPage && (
          <>
            <img
              src={selectedPage.image}
              alt={`Newspaper page ${currentPage}`}
              className="w-full object-contain"
            />

            {selectedPage?.mapData?.map((area) => {
              // Parse coordinates if they are stored as a string
              let coords = area.coordinates;
              let coordsObj;
              if (typeof coords === "string") {
                try {
                  coordsObj = JSON.parse(coords);
                } catch (e) {
                  console.error("Error parsing coordinates:", e);
                  const coordsObj = { x: 0, y: 0, width: 0, height: 0 };
                }
              }

              //   // Ensure coordinates has the correct format
              //   if (!coords || typeof coords !== "object") {
              //     coords = { x: 0, y: 0, width: 0, height: 0 };
              //   }

              return (
                <StoryArea
                  key={area.id}
                  id={area.id}
                  coordinates={coordsObj}
                  title={area.title || `Story ${area.id}`}
                  onClick={() => {
                    console.log("Clicking story:", area);
                    onStoryClick(area);
                  }}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default PaperView;
