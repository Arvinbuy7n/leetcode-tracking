"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CheckSquare, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Task } from "../types/task";

interface TaskListProps {
  tasks: Task[];
  onCreateClick: () => void;
  onSelectTask: (taskId: string) => void;
  selectedTaskId?: string;
}

export const TaskSidebar: React.FC<TaskListProps> = ({
  tasks,
  onCreateClick,
  onSelectTask,
  selectedTaskId,
}) => {
  return (
    <Sidebar>
      <SidebarHeader className="h-16 border-b border-sidebar-border flex flex-row items-center justify-between px-4 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a
                href="#"
                className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-100"
              >
                <CheckSquare className="size-5 text-gray-700 dark:text-gray-300" />
                <span>Tasks</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Button size="sm" onClick={onCreateClick}>
          <Plus className="size-4 mr-2" />
          New
        </Button>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-0">
        <ScrollArea className="h-full px-2 pb-4 pt-4">
          <div className="space-y-4 px-2">
            {tasks.length === 0 ? (
              <div className="text-center text-muted-foreground py-10 text-sm">
                No tasks found. Click <strong>New</strong> to add one!
              </div>
            ) : (
              tasks
                .sort((a, b) => Number(b.id) - Number(a.id))
                .map((task) => {
                  const isSelected = selectedTaskId === task.id;
                  return (
                    <SidebarMenuItem key={task.id} className="list-none w-fit">
                      <SidebarMenuButton
                        isActive={isSelected}
                        onClick={() => onSelectTask(task.id)}
                        className={cn(
                          "flex flex-col items-start h-auto py-3 px-3 border-[1.8px] rounded-md transition-colors",
                          isSelected
                            ? "bg-blue-50 border-blue-500 shadow-md"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <p className="font-medium text-gray-900 dark:text-white text-md">
                          {task.name}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {task.taskSlugs.map((slug) => (
                            <Badge
                              key={slug}
                              variant="outline"
                              className={cn(
                                "text-xs px-2 py-0.5 border truncate max-w-full grid grid-cols-1",
                                isSelected
                                  ? "bg-blue-100 text-blue-700 border-blue-500 shadow-md"
                                  : "bg-gray-50 text-gray-600 border-gray-200 dark:bg-zinc-700 dark:text-gray-300 dark:border-zinc-600"
                              )}
                            >
                              {slug}
                            </Badge>
                          ))}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
            )}
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
