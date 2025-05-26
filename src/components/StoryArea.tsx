import { useState } from "react";
import { cn } from "@/lib/utils";

interface StoryAreaProps {
  id: number;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  title: string;
  onClick: () => void;
}

const StoryArea = ({ id, coordinates, title, onClick }: StoryAreaProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Position the div using percentages for responsive layout
  const style = {
    left: `${coordinates.x}%`,
    top: `${coordinates.y}%`,
    width: `${coordinates.width}%`,
    height: `${coordinates.height}%`,
  };

  return (
    <div
      className={cn(
        "absolute cursor-pointer transition-opacity border-2",
        isHovered
          ? "bg-black/30 border-primary"
          : "bg-transparent hover:border-primary/30 border-transparent",
      )}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      //   title={title || "Story area"}
    />
  );
};

export default StoryArea;
