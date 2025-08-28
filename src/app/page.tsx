"use client";

import React, { useEffect, useState } from "react";
import {
  CreateTaskDialog,
  CreateUserDialog,
  LeetcodeSubmissionCard,
  TaskSidebar,
} from "./components";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Task } from "./types/task";
import { Lightbulb } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleCreateTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
    setIsCreateOpen(false);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch("/api/task");
      const data = await res.json();
      setTasks(data);
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0 && !selectedTaskId) {
      setSelectedTaskId(tasks[0].id);
    }
  }, [tasks, selectedTaskId]);

  const handleOpen = () => {
    setIsCreateOpen(true);
  };

  return (
    <main className="flex min-h-screen relative">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "22vw",
            "--sidebar-width-mobile": "70vw",
          } as React.CSSProperties
        }
      >
        <TaskSidebar
          tasks={tasks}
          onCreateClick={handleOpen}
          onSelectTask={setSelectedTaskId}
          selectedTaskId={selectedTaskId ?? ""}
        />

        <SidebarInset>
          <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center justify-between w-full">
              <p className="text-xl font-bold">LeetCode Progress Tracker</p>
              <CreateUserDialog />
            </div>
          </header>

          <CreateTaskDialog
            isCreateOpen={isCreateOpen}
            setIsCreateOpen={setIsCreateOpen}
            handleCreateTask={handleCreateTask}
          />

          <LeetcodeSubmissionCard
            tasks={tasks}
            selectedTaskId={selectedTaskId ?? ""}
          />

          <div className="fixed bottom-4 right-8 z-50 w-60">
            <Alert className="max-w-sm shadow-lg bg-gradient-to-r from-blue-400 to-green-400">
              <Lightbulb className="h-4 w-4" color="white" />
              <AlertDescription className="text-white font-semibold">
                Tips: Хэрвээ таны бодсон бодлого checked болоогүй бол бодлогын
                link дээр даран дахин submit хийнэ үү.
              </AlertDescription>
            </Alert>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
