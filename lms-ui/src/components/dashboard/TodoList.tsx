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
  items: initialItems,
}: {
  items: TodoMainTask[];
}) {
  const [items, setItems] = useState<TodoMainTask[]>(initialItems);
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
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-lg">To Do List</div>
        <Button
          className="w-8 h-8 flex items-center justify-center rounded-full text-xl shadow"
          onClick={() => setModalOpen(true)}
          aria-label="Add Task"
          variant="default"
        >
          <Plus size={20} />
        </Button>
      </div>
      <ul className="space-y-6">
        {items.map((item, idx) => (
          <li key={idx} className="pb-2 border-b last:border-b-0">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleToggleMain(idx)}
                className={`w-5 h-5 rounded border-2 border-gray-300 focus:ring-2 focus:ring-teal-400 transition accent-teal-500 ${
                  item.checked ? "bg-teal-500 border-teal-500" : ""
                }`}
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <span
                    className={`font-medium text-base ${
                      item.checked
                        ? "line-through text-gray-400"
                        : "text-gray-900"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400 font-medium">
                    {item.category}
                  </span>
                  <span className="text-xs text-orange-500 font-semibold">
                    {item.dateTime}
                  </span>
                </div>
                {item.subtasks && item.subtasks.length > 0 && (
                  <ul className="mt-3 ml-6 space-y-2">
                    {item.subtasks.map((sub, subIdx) => (
                      <li key={subIdx} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={sub.checked}
                          onChange={() => handleToggleSub(idx, subIdx)}
                          className="w-4 h-4 rounded border-2 border-gray-300 accent-teal-500"
                        />
                        <span
                          className={`text-sm ${
                            sub.checked
                              ? "line-through text-gray-400"
                              : "text-gray-700"
                          }`}
                        >
                          {sub.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
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
