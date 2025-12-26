import React, { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type TodoSubtask = {
  label: string;
  checked: boolean;
};

export type TodoMainTask = {
  label: string;
  category: string;
  dateTime: string;
  checked: boolean;
  subtasks?: TodoSubtask[];
};

function AddTaskModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (task: TodoMainTask) => void;
}) {
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState("");
  const [subtasks, setSubtasks] = useState<TodoSubtask[]>([]);
  const [subtaskLabel, setSubtaskLabel] = useState("");

  const handleAddSubtask = () => {
    if (subtaskLabel.trim()) {
      setSubtasks([...subtasks, { label: subtaskLabel, checked: false }]);
      setSubtaskLabel("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (label && category) {
      const now = new Date();
      const dateTime = now.toLocaleString("default", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      onAdd({
        label,
        category,
        dateTime,
        checked: false,
        subtasks: subtasks.length ? subtasks : undefined,
      });
      setLabel("");
      setCategory("");
      setSubtasks([]);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="task-title">
              Title
            </label>
            <Input
              id="task-title"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="task-category">
              Category
            </label>
            <Input
              id="task-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Subtasks (optional)</label>
            <div className="flex gap-2">
              <Input
                value={subtaskLabel}
                onChange={(e) => setSubtaskLabel(e.target.value)}
                placeholder="Subtask label"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddSubtask}
              >
                Add
              </Button>
            </div>
            {subtasks.length > 0 && (
              <ul className="space-y-1 ml-2 mt-2">
                {subtasks.map((st, i) => (
                  <li key={i} className="text-xs text-gray-700">
                    - {st.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function TodoList({
  items: initialItems = [],
}: {
  items?: TodoMainTask[];
}) {
  const [items, setItems] = useState<TodoMainTask[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddTask = (task: TodoMainTask) => {
    setItems([...items, task]);
  };

  // Toggle completion for main tasks
  const handleToggleMain = (idx: number) => {
    setItems((items) =>
      items.map((item, i) =>
        i === idx ? { ...item, checked: !item.checked } : item
      )
    );
  };
  // Toggle completion for subtasks
  const handleToggleSub = (mainIdx: number, subIdx: number) => {
    setItems((items) =>
      items.map((item, i) =>
        i === mainIdx
          ? {
              ...item,
              subtasks: item.subtasks?.map((sub, j) =>
                j === subIdx ? { ...sub, checked: !sub.checked } : sub
              ),
            }
          : item
      )
    );
  };

  return (
    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="font-bold text-lg text-foreground">To Do List</div>
        <Button
          className="w-8 h-8 rounded-full p-0 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary shadow-none"
          onClick={() => setModalOpen(true)}
          aria-label="Add Task"
        >
          <Plus size={18} />
        </Button>
      </div>
      <ul className="relative space-y-0">
        <div className="absolute left-[9px] top-2 bottom-2 w-[1px] bg-gray-200 dark:bg-gray-800 -z-10" />
        
        {items.map((item, idx) => (
          <li key={idx} className="pb-6 last:pb-0 group">
            <div className="flex items-start gap-4">
              <div 
                 className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-colors bg-white dark:bg-black ${
                     item.checked ? "border-primary bg-primary text-primary-foreground" : "border-gray-300 dark:border-gray-600 hover:border-primary"
                 }`}
                 onClick={() => handleToggleMain(idx)}
              >
                  {item.checked && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col">
                  <span
                    className={`font-semibold text-sm transition-all ${
                      item.checked
                        ? "text-muted-foreground line-through decoration-primary/50"
                        : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                        {item.category}
                    </span>
                    <span className="text-[10px] items-center px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 font-medium">
                        {item.dateTime}
                    </span>
                   </div>
                   
                   {/* Subtasks */}
                   {item.subtasks && item.subtasks.length > 0 && (
                       <div className="mt-3 pl-2 border-l-2 border-primary/10 space-y-2">
                           {item.subtasks.map((sub, sIdx) => (
                               <div key={sIdx} className="flex items-center gap-2 text-xs">
                                   <div className={`w-1.5 h-1.5 rounded-full ${sub.checked ? "bg-primary" : "bg-gray-300"}`} />
                                   <span className={sub.checked ? "line-through text-muted-foreground" : "text-muted-foreground"}>
                                       {sub.label}
                                   </span>
                               </div>
                           ))}
                       </div>
                   )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <AddTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
}
