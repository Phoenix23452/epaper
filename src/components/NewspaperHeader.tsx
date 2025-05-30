"use client";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface NewspaperHeaderProps {
  newspapers: Newspaper[];
  selectedDate: string;
  selectedNewspaperId: number | null;
  onDateChange: (date: string) => void;
  onNewspaperChange: (id: number) => void;
}

const NewspaperHeader = ({
  newspapers,
  selectedDate,
  selectedNewspaperId,
  onDateChange,
  onNewspaperChange,
}: NewspaperHeaderProps) => {
  const isMobile = useIsMobile();
  const [maxDate, setMaxDate] = useState("");

  useEffect(() => {
    // Set max date to today
    setMaxDate(format(new Date(), "yyyy-MM-dd"));
  }, []);

  // Get newspaper titles
  const getNewspaperTitle = (newspaper: Newspaper) => {
    const category = newspaper.title.title;
    return category ? category : `Newspaper #${newspaper.id}`;
  };

  const dateChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(e.target.value);
  };

  // Filter newspapers by selected date
  const filteredNewspapers = newspapers.filter(
    (newspaper) => newspaper.date === selectedDate,
  );

  // Mobile view components
  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="py-4">
          <h2 className="text-lg font-medium mb-4">Select Date</h2>
          <Input
            type="date"
            value={selectedDate}
            onChange={dateChangeHandler}
            max={maxDate}
            className="mb-6"
          />

          <h2 className="text-lg font-medium mb-4">Select Edition</h2>
          <div className="space-y-2">
            {filteredNewspapers.map((newspaper) => (
              <div
                key={newspaper.id}
                className={`p-3 rounded-md cursor-pointer ${
                  selectedNewspaperId === newspaper.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
                onClick={() => onNewspaperChange(newspaper.id)}
              >
                {getNewspaperTitle(newspaper)}
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  // Desktop view
  const DesktopControls = () => (
    <div className="flex items-center space-x-4">
      <Input
        type="date"
        value={selectedDate}
        onChange={dateChangeHandler}
        // max={maxDate}
        className="w-auto"
      />

      <Select
        value={selectedNewspaperId?.toString() || ""}
        onValueChange={(value) => onNewspaperChange(parseInt(value))}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select Edition" />
        </SelectTrigger>
        <SelectContent>
          {filteredNewspapers.map((newspaper) => (
            <SelectItem key={newspaper.id} value={newspaper.id.toString()}>
              {getNewspaperTitle(newspaper)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <header className="border-b py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* <h1 className="text-2xl font-bold">Shah Times</h1> */}
            <Image
              src={"/epaper-logo.webp"}
              width={200}
              height={0}
              sizes="fill"
              alt="logo"
            />
          </div>

          {isMobile ? <MobileMenu /> : <DesktopControls />}
        </div>
      </div>
    </header>
  );
};

export default NewspaperHeader;
