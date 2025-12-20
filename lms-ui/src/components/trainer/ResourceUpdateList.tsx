import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText } from "lucide-react";

const mockPendingResources = [
  {
    id: "101",
    title: "Javascript ES6 Features",
    batch: "Web Dev Batch A",
    date: "Yesterday",
  },
  {
    id: "102",
    title: "Data Visualization with Matplotlib",
    batch: "Data Science Batch A",
    date: "2 Days Ago",
  },
  {
    id: "103",
    title: "Advanced CSS Animations",
    batch: "Frontend Batch B",
    date: "3 Days Ago",
  },
];

export default function ResourceUpdateList() {
  return (
    <div className="w-full mt-6">
      <h2 className="text-lg font-semibold mb-3 text-slate-800 px-1 flex items-center gap-2">
        Pending Resource Updates
        <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full">
          {mockPendingResources.length} Pending
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
        {mockPendingResources.map((item) => (
          <Card
            key={item.id}
            className="p-4 flex flex-col gap-3 shrink-0 bg-amber-50/50 border-amber-100 hover:border-amber-200 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0">
                <FileText size={18} />
              </div>
              <div className="flex flex-col overflow-hidden min-w-0">
                <h3 className="font-semibold text-sm text-slate-900 truncate" title={item.title}>
                  {item.title}
                </h3>
                <p className="text-[10px] text-slate-500 truncate">
                  {item.batch} • {item.date}
                </p>
              </div>
            </div>
            
            <Button size="sm" variant="outline" className="w-full h-8 text-xs gap-2 border-amber-200 hover:bg-amber-100 text-amber-800">
                <UploadCloud size={12} />
                Upload Resources
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
