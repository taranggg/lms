import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TrainerBatchResourcesProps {
  resources: { name: string; link: string }[];
}

export default function TrainerBatchResources({
  resources,
}: TrainerBatchResourcesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {resources.map((res, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center p-2 rounded bg-gray-100"
            >
              <span>{res.name}</span>
              <Button size="sm" variant="outline" asChild>
                <a href={res.link} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
