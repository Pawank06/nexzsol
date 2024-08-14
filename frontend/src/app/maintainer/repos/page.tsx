"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTokenStore } from "@/store";
import { Loader } from "lucide-react";

const Repo = () => {
  const [repo, setRepo] = useState<any[]>([]);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const reposPerPage = 13; // Number of repos to display per page
  const token = useTokenStore((state) => state.token);
  const [selectedRepo, setSelectedRepo] = useState(false)

  const fetchRepos = async () => {
    try {
      if (!token) {
        throw new Error("No token found in store");
      }

      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/repo?username=${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setRepo(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Error fetching repos: " + (error as Error).message);
    }
  };

  const handleClick = async (hookUrl: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/repo`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hookUrl,
          repoName: username,
        }),
      }
    );
    if (res.status === 200) {
      console.log("Hook added successfully");
      setSelectedRepo(true)
    } else {
      console.log("Error adding");
    }
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * reposPerPage < repo.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const startIndex = currentPage * reposPerPage;
  const paginatedRepos = repo.slice(startIndex, startIndex + reposPerPage);

  return (
    <div>
      <div className="flex flex-col items-center gap-1 text-center">
        {loading ? (
          <Loader className="animate-spin" />
        ) : !repo.length ? (
          <>
            <h3 className="text-2xl font-bold tracking-tight">
              Add your repo to create bounties
            </h3>
            <p className="text-sm text-muted-foreground">
              You can start selling as soon as you add a product.
            </p>
            <Button onClick={fetchRepos} className="mt-4">
              Fetch all repos
            </Button>
          </>
        ) : <h3 className="text-2xl font-bold tracking-tight mb-4">Select a repo to send bounties. </h3>}
      </div>
      {error && <div className="mt-5 text-red-500">{error}</div>}
      {repo.length > 0 && (
        <div id="repo" className="lg:w-[700px] w-[500px] md:w-[600px] px-5 py-5">
          {paginatedRepos.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between hover:border rounded-md p-4 cursor-pointer"
              onClick={() => handleClick(item.hooks_url)}
            >
              {item.name}
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <Button className="ml-4" variant="outline" onClick={handlePreviousPage} disabled={currentPage === 0}>
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={(currentPage + 1) * reposPerPage >= repo.length}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Repo;
