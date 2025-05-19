import React, { ReactNode } from "react";
import { Card } from "../ui/card";

export default function AdminContainer({
  heading,
  children,
  secondaryChildren,
}: {
  heading: string;
  children: ReactNode;
  secondaryChildren?: ReactNode;
}) {
  return (
    <section>
      <header className="flex justify-between">
        <h2 className="text-3xl font-bold text-primary mb-4">{heading}</h2>
        <div>{secondaryChildren}</div>
      </header>
      <Card className="px-4 my-6">{children}</Card>
    </section>
  );
}
