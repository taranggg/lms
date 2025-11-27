import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, PlayCircle } from "lucide-react";

export default function BatchMaterials({ resources }: { resources: any[] }) {
  return (
    <div className="mt-6">
      <div className="text-[var(--muted-foreground)] mb-2">
        {resources.length} materials available
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((res, idx) => (
          <Card
            key={idx}
            className="bg-[var(--card)] text-[var(--card-foreground)]"
          >
            <CardHeader className="flex flex-row items-center gap-2">
              {res.type === "pdf" ? (
                <FileText className="text-red-500" size={20} />
              ) : (
                <PlayCircle className="text-purple-500" size={20} />
              )}
              <CardTitle className="text-base">{res.name}</CardTitle>
              <span className="ml-auto px-2 py-1 rounded-full bg-[var(--color-badge-active,#18181b)] text-[var(--color-badge-active-text,#fff)] text-xs font-medium">
                {res.type}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-[var(--muted-foreground)] text-sm mb-2">
                {res.description || ""}
              </div>
              <div className="text-xs text-[var(--muted-foreground)] mb-2">
                Uploaded {res.uploaded} by {res.by}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  View
                </Button>
                <Button size="sm" variant="ghost">
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
