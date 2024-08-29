"use client";
import React, { useEffect, useState } from "react";
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
} from "@/components/ui/card";
import { CoolMode } from "@/components/magicui/cool-mode";
import axios from "axios";

const Repo = () => {
  const [repo, setRepo] = useState<any[]>([]);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const reposPerPage = 6; // Number of repos to display per page
  const token = useTokenStore((state) => state.token);
  const [selectedRepo, setSelectedRepo] = useState(false);
  const [hookAdded, setHooksAdded] = useState(false);
  const [balance, setBalance] = useState(0)

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

  const handleClick = async (hookUrl: string, repoName: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/repo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hookUrl,
          repoName,
        }),
      });

      if (res.status === 200) {
        console.log("Hook added successfully");
        setSelectedRepo(true);
        setHooksAdded(true);
      } else {
        const errorData = await res.json();
        console.error("Error adding hook:", errorData);
        setError("Error adding hook: " + errorData.message);
      }
    } catch (error) {
      setError("Error adding hook: " + error);
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
    <div >
      <div className="">
        {loading ? (
          <Loader className="animate-spin" />
        ) : !repo.length && !hookAdded ? (
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
        ) : !hookAdded ? (
          <h3 className="text-4xl my-6 text-center font-bold tracking-tight">
            Select a repo to send bounties.
          </h3>
        ) : null}
      </div>
      {hookAdded ? (
        <>Repo added successfully for bounty {balance}</>
      ) : (
        <>
          {error && <div className="mt-5 text-red-500">{error}</div>}
          {repo.length > 0 && (
            <>
              <div
                id="repo"
                className="px-5 py-5 grid lg:grid-cols-3 md:grid-cols-2 gap-4 md:border rounded-lg"
              >
                {paginatedRepos.map((item) => (
                  <Card key={item.name} className="w-full">
                    <CardHeader>
                      <CardTitle>{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <p className="mb-4 text-sm text-muted-foreground">
                          Stars: {item.stargazers_count}
                        </p>
                        <p className="mb-4 text-sm text-muted-foreground">
                          Forks: {item.forks}
                        </p>
                      </div>
                      <CoolMode>
                      <Button onClick={() => handleClick(item.hooks_url, item.name)}>
                        Add to bounty
                      </Button>
                      </CoolMode>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex w-[300px] mx-auto md:w-full justify-between my-4">
                <Button
                  variant="outline"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                >
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
        </>
      )}
    </div>
  );
};

export default Repo;
