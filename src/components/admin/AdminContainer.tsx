import React, { ReactNode } from "react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils"; // Make sure this import is correct

export default function AdminContainer({
  heading,
  children,
  secondaryChildren,
  className, // <-- accept className
}: {
  heading?: string;
  children: ReactNode;
  secondaryChildren?: ReactNode;
  className?: string; // <-- declare it
}) {
  return (
    <section className={cn("space-y-4", className)}>
      <header className="flex justify-between items-center">
        {heading && (
          <h2 className="text-3xl font-bold text-primary mb-4">{heading}</h2>
        )}
        <div>{secondaryChildren}</div>
      </header>
      <Card className="my-6">{children}</Card>
    </section>
  );
}
