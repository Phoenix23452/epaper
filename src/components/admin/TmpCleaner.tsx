import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export default function TmpCleaner() {
  const [size, setSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTmpSize = async () => {
    setLoading(true);
    const res = await fetch("/api/v9/tmp/cleanup");
    const data = await res.json();
    setSize(`${data.sizeMB} MB`);
    setLoading(false);
  };

  const clearTmp = async () => {
    setLoading(true);
    await fetch("/api/v9/tmp/cleanup", { method: "DELETE" });
    setSize("0 MB");
    setLoading(false);
  };

  return (
    <Card className="px-4 max-w-md">
      <div className="flex gap-2">
        <Button
          onClick={fetchTmpSize}
          className="px-4 py-2  text-white rounded"
        >
          Check Usage
        </Button>
        <p className="py-2">Current {loading ? "Loading..." : size}</p>

        <Button
          onClick={clearTmp}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Clear All
        </Button>
      </div>
    </Card>
  );
}
