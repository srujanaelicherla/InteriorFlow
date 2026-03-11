import React from "react";
import type { Task } from "../services/taskService";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, currentStatus: boolean) => void;
}

export const TaskItem = React.memo(({ task, onToggle }: TaskItemProps) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md">
      <div className="flex items-center gap-3 w-full">
        <input
          type="checkbox"
          id={task.id}
          checked={task.completed}
          onChange={() => onToggle(task.id, task.completed)}
          className="w-5 h-5 cursor-pointer accent-primary rounded"
        />
        <label 
          htmlFor={task.id}
          className={`cursor-pointer flex-1 ${task.completed ? "line-through text-gray-400" : "text-slate-700 font-medium"}`}
        >
          {task.title}
        </label>
      </div>
    </div>
  );
});

TaskItem.displayName = "TaskItem";