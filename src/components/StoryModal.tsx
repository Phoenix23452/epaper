import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface StoryModalProps {
  story: MapData;
  isOpen: boolean;
  onClose: () => void;
}

const StoryModal = ({ story, isOpen, onClose }: StoryModalProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Parse coordinates if they are stored as a string
  const getCoordinates = () => {
    if (!story.coordinates) return null;

    if (typeof story.coordinates === "string") {
      try {
        return JSON.parse(story.coordinates);
      } catch (e) {
        console.error("Failed to parse coordinates:", e);
        return null;
      }
    }

    return story.coordinates;
  };

  // Reset state when story changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [story]);

  const coordinates = getCoordinates();
  const storyTitle = story.title || `Story #${story.id}`;

  // Use croppedImage or croppedimage property
  // Note: We check for both camelCase and lowercase versions of the property
  const imageUrl = story.croppedImage;

  console.log("Story data:", story);
  console.log("Image URL decided:", imageUrl);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>{/* Tab title should here */}</DialogHeader>

        <div className="space-y-4">
          {imageUrl ? (
            <div className="relative">
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="w-full h-[300px]" />
                </div>
              )}

              <img
                src={imageUrl}
                alt={storyTitle}
                className="w-full rounded-md shadow-md"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  console.error(`Failed to load image: ${imageUrl}`);
                  setImageError(true);
                }}
                style={{ display: imageLoaded ? "block" : "none" }}
              />

              {imageError && (
                <div className="bg-muted p-4 rounded-md flex flex-col items-center justify-center min-h-[200px]">
                  <p className="text-muted-foreground">Failed to load image</p>
                  <p className="text-xs text-muted-foreground mt-2 break-all">
                    {imageUrl}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-muted p-4 rounded-md flex items-center justify-center min-h-[200px]">
              <p className="text-muted-foreground">No image available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoryModal;
