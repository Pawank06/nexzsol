"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTokenStore } from "@/store";
import { Loader } from "lucide-react";


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Repo = () => {
  const [repo, setRepo] = useState<any[]>([]);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const reposPerPage = 6; // Number of repos to display per page
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
      <div className="">
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
        ) : <h3 className="text-4xl my-6 text-center font-bold tracking-tight">Select a repo to send bounties. </h3>}
      </div>
      {error && <div className="mt-5 text-red-500">{error}</div>}
      {repo.length > 0 && (
        <>
          <div id="repo" className="px-5 py-5 grid lg:grid-cols-3 md:grid-cols-2 gap-4 md:border rounded-lg">
            {paginatedRepos.map((item) => (
              <Card
                key={item.name}
                className="w-full lg:w-[200px]">
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <p className="mb-4 text-sm text-muted-foreground">Stars:  {item.stargazers_count}</p>
                    <p className="mb-4 text-sm text-muted-foreground">
                     Forks: {item.forks}
                    </p>
                  </div>

                  <Button onClick={() => handleClick(item.hooks_url)}>add to bounty</Button>

                </CardContent>
              </Card>
            ))}

          </div>
          <div className="flex w-[300px] mx-auto md:w-full justify-between my-4">
            <Button variant="outline" onClick={handlePreviousPage} disabled={currentPage === 0}>
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={(currentPage + 1) * reposPerPage >= repo.length}
            >
              Next Page
            </Button>
          </div>
        </>

      )}
    </div>
  );
};

export default Repo;
