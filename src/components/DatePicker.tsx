"use client";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  buttonVariant?: "outline" | "default" | "ghost" | "link" | "destructive";
  calendarProps?: Omit<
    React.ComponentProps<typeof Calendar>,
    "mode" | "selected" | "onSelect"
  >;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  buttonVariant = "outline",
  calendarProps,
}: DatePickerProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    value,
  );

  const handleSelect = (selectedDate: Date | undefined) => {
    setInternalDate(selectedDate);
    onChange?.(selectedDate);
  };

  React.useEffect(() => {
    setInternalDate(value);
  }, [value]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={buttonVariant}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !internalDate && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {internalDate ? (
            format(internalDate, "PPP")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={internalDate}
          onSelect={handleSelect}
          initialFocus
          {...calendarProps}
        />
      </PopoverContent>
    </Popover>
  );
}
