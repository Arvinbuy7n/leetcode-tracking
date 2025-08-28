/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { ListRestart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Label } from "@/components/ui/label";

export const CreateUserDialog = () => {
  const [open, setOpen] = useState(false);
  const [leetcodeName, setLeetcodeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = leetcodeName.trim();
    if (!trimmedName) {
      setError("Username cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmedName }),
      });

      if (!response.ok) {
        const resData = await response.json();
        setError(resData.error || "Failed to add user");
      } else {
        setLeetcodeName("");
        setOpen(false);
      }
    } catch (err: any) {
      setError(err.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="space-x-3">
        {/* <Link href="/ranking">
          <Button
            variant="outline"
            size="sm"
            className="shadow-sm hover:shadow-md transition-shadow bg-transparent"
          >
            <Trophy className="h-4 w-4 mr-2" />
            View Ranking
          </Button>
        </Link> */}

        <Button
          variant={"ghost"}
          className="border-2"
          onClick={() => window.location.reload()}
        >
          <ListRestart />
          Reload
        </Button>

        <DialogTrigger asChild>
          <Button size="sm" aria-label="Add new LeetCode user">
            <Plus className="size-4" />
            New user
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Leetcode User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="flex flex-col gap-2 w-full">
            <Label className="text-md">Name</Label>
            <Input
              placeholder="Leetcode username"
              value={leetcodeName}
              onChange={(e) => setLeetcodeName(e.target.value)}
              disabled={loading}
              required
              className="w-Full"
            />
          </div>

          {error && (
            <p className="text-red-600 col-span-full text-center">{error}</p>
          )}

          <div className="space-y-3 col-span-full">
            <p className="text-md font-bold">
              It should be similar to this example
            </p>
            <Image
              src="https://pub-ea3ed87f63ee47a19433239ed1054306.r2.dev/Screenshot%202025-08-08%20at%2017.57.53.png"
              width={400}
              height={100}
              alt="leetcode"
              className="object-contain rounded-md"
            />
          </div>

          <DialogFooter className="col-span-full">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Adding..." : "Add User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
