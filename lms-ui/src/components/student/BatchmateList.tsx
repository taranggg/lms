import React from "react";
import { Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BatchmateListProps {
  classmates: string[];
  showModal: boolean;
  onClose: () => void;
}

export const BatchmateList: React.FC<BatchmateListProps> = ({
  classmates,
  showModal,
  onClose,
}) => {
  if (!showModal) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-[var(--card)] rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Batchmates ({classmates.length})
          </h2>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <ul className="space-y-2">
          {classmates.map((mate, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 p-2 rounded bg-[var(--muted)]"
            >
              <Users size={18} className="text-[var(--muted-foreground)]" />
              <span className="font-medium text-[var(--card-foreground)]">
                {mate}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
