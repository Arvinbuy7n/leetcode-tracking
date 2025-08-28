/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Task } from "../types/task";

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

        const data = await getResponse.json();
        setCompletedProblems(data || []);
      } catch (err: any) {
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

  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="p-4 w-full">
      <div className="grid md:grid-cols-3 gap-6">
        {users.map(({ username }) => {
          const completedSlugs = completedMap[username] || new Set();
          const userTasks = tasks
            .filter((task) => !selectedTaskId || task.id === selectedTaskId)
            .flatMap((task) => task.taskSlugs);

          const total = userTasks.length;

          const solved = userTasks.filter((slug) =>
            completedSlugs.has(slug)
          ).length;

          return (
            <div
              key={username}
              className="group bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/60 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 backdrop-blur-sm max-h-[300px] overflow-scroll"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-3 flex justify-between items-center">
                <h2 className="font-bold text-white text-base tracking-tight">
                  {username}
                </h2>
                <p className="text-sm mt-1 font-semibold font-sans">
                  {solved}/{total}
                </p>
              </div>

              <div className="py-2 px-2 space-y-3">
                {tasks
                  .filter(
                    (task) => !selectedTaskId || task.id === selectedTaskId
                  )
                  .flatMap((task) => task.taskSlugs)
                  .map((slug, idx) => {
                    const completed = completedSlugs.has(slug);
                    return (
                      <a
                        key={idx}
                        href={`https://leetcode.com/problems/${slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group/link flex items-center justify-between text-sm font-medium transition-all duration-200 hover:scale-[1.02] px-3 py-2 rounded-md ${
                          completed
                            ? "text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/50"
                            : "text-gray-500 bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200/50"
                        }`}
                        title={completed ? "Completed" : "Uncompleted"}
                      >
                        <span className="group-hover/link:underline">
                          {slug}
                        </span>
                        <span className="flex-shrink-0 ml-2">
                          {completed ? (
                            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </span>
                      </a>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
