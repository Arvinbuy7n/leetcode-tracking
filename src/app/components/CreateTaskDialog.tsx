import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateTasks } from "./CreateTasks";
import { Task } from "../types/task";

type CreateTaskDialogType = {
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
  handleCreateTask: (task: Task) => void;
};

export const CreateTaskDialog: React.FC<CreateTaskDialogType> = ({
  isCreateOpen,
  setIsCreateOpen,
  handleCreateTask,
}) => {
  return (
    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
      <DialogTrigger asChild></DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new task.
          </DialogDescription>
        </DialogHeader>

        <CreateTasks
          onTaskCreated={handleCreateTask}
          onCancel={() => setIsCreateOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
