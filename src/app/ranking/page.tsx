"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Task } from "../types/task";

const RankingPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch("/api/task");
      const data = await res.json();
      setTasks(data);
    };

    fetchTasks();
  }, []);

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="account" className="w-[80%] mt-10">
        <TabsList className="w-full border-2">
          <TabsTrigger value="account">
            Pinecone DSA Club Top Performer
          </TabsTrigger>
          <TabsTrigger value="password">Leetcode Top Performer</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          {tasks.map((task) => {
            return <div>{task.taskSlugs.length}</div>;
          })}
        </TabsContent>
        <TabsContent value="password"></TabsContent>
      </Tabs>
    </div>
  );
};

export default RankingPage;
