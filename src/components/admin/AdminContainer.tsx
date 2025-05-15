import React, { ReactNode } from "react";
import { Card } from "../ui/card";

export default function AdminContainer({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-3xl font-bold text-primary mb-4">{heading}</h2>
      <Card className="px-8">{children}</Card>
    </section>
  );
}
