"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface Task {
  id: string;
  name: string;
  taskSlugs: string[];
}

interface CreateTasksProps {
  onTaskCreated: (task: Task) => void;
  onCancel: () => void;
}

export function CreateTasks({ onTaskCreated, onCancel }: CreateTasksProps) {
  const [taskName, setTaskName] = useState("");
  const [currentSlug, setCurrentSlug] = useState("");
  const [taskSlugs, setTaskSlugs] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const addSlug = () => {
    const trimmed = currentSlug.trim();
    if (trimmed && !taskSlugs.includes(trimmed)) {
      setTaskSlugs([...taskSlugs, trimmed]);
      setCurrentSlug("");
      inputRef.current?.focus();
    }
  };

  const removeSlug = (slugToRemove: string) => {
    setTaskSlugs(taskSlugs.filter((slug) => slug !== slugToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: taskName.trim(), taskSlugs }),
      });

      if (response.ok) {
        const newTask = await response.json();
        onTaskCreated(newTask);
        setTaskName("");
        setTaskSlugs([]);
        setCurrentSlug("");
      } else {
        console.error("Failed to create task:", await response.text());
      }
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSlug();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="taskName">Task Name</Label>
        <Input
          id="taskName"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Enter task name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="taskSlug">Task Items</Label>
        <div className="flex gap-2">
          <Input
            id="taskSlug"
            ref={inputRef}
            value={currentSlug}
            onChange={(e) => setCurrentSlug(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add task item"
          />
          <Button
            type="button"
            onClick={addSlug}
            variant="outline"
            size="icon"
            disabled={
              !currentSlug.trim() || taskSlugs.includes(currentSlug.trim())
            }
          >
            <Plus className="size-4" />
          </Button>
        </div>

        {taskSlugs.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {taskSlugs.map((slug) => (
              <Badge
                key={slug}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {slug}
                <button
                  type="button"
                  onClick={() => removeSlug(slug)}
                  className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting || !taskName.trim()}>
          {isSubmitting ? "Creating..." : "Create Task"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
