/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Task } from "../types/task";
import { Button } from "@/components/ui/button";
import { ListRestart } from "lucide-react";

type LeetCodeSubmissionCardType = {
  selectedTaskId?: string;
  tasks: Task[];
};

interface User {
  username: string;
}

const DEFAULT_LIMIT = 20;

export const LeetcodeSubmissionCard: React.FC<LeetCodeSubmissionCardType> = ({
  selectedTaskId,
  tasks,
}) => {
  const [completedProblems, setCompletedProblems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/user", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      setUsers(data || []);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const updateAndFetch = async () => {
      setError(null);

      try {
        const usernames = users.map((u) => u.username);

        const postResponse = await fetch("/api/leetcode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usernames,
            limit: DEFAULT_LIMIT,
          }),
        });

        if (!postResponse.ok) {
          throw new Error(`POST error: ${postResponse.status}`);
        }

        const getResponse = await fetch("/api/leetcode", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!getResponse.ok) {
          throw new Error(`GET error: ${getResponse.status}`);
        }

        const data = await getResponse.json();
        setCompletedProblems(data || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unknown error");
      }
    };

    updateAndFetch();
  }, [users]);

  const completedMap: Record<string, Set<string>> = {};
  completedProblems.forEach((record) => {
    if (!completedMap[record.username]) {
      completedMap[record.username] = new Set();
    }
    completedMap[record.username].add(record.titleSlug);
  });

  return (
    <div className="p-4 w-full">
      <div className="w-full flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">LeetCode Completed Problems</h1>

        <Button
          variant={"ghost"}
          className="border bg-violet-400 text-white"
          onClick={() => window.location.reload()}
        >
          <ListRestart />
          Reload
        </Button>
      </div>

      {error && <p className="text-red-600">Error: {error}</p>}

      <div className="grid md:grid-cols-3 gap-4">
        {users.map(({ username }) => {
          const completedSlugs = completedMap[username] || new Set();

          return (
            <div
              key={username}
              className="mb-4 border p-4 rounded-sm shadow-sm"
            >
              <h2 className="font-bold mb-2">{username}</h2>

              {tasks
                .filter((task) => !selectedTaskId || task.id === selectedTaskId)
                .map((task) => (
                  <div
                    key={task.id}
                    className="mb-3 p-3 border rounded bg-white"
                  >
                    <div className="flex flex-col gap-1">
                      {task.taskSlugs.map((slug, idx) => {
                        const completed = completedSlugs.has(slug);
                        return (
                          <a
                            key={idx}
                            href={`https://leetcode.com/problems/${slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm underline ${
                              completed
                                ? "text-green-600 font-semibold"
                                : "text-gray-500 line-through"
                            }`}
                            title={completed ? "Completed" : "Uncompleted"}
                          >
                            {slug}
                            {completed ? (
                              <span className="pl-2">✅</span>
                            ) : (
                              <span className="pl-2">❌</span>
                            )}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
