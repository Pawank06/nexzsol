"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useBalanceStore, useTokenStore } from "@/store";
import { Loader } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CoolMode } from "@/components/magicui/cool-mode";
import axios from "axios";
import Link from "next/link";

const Repo = () => {
  const [repo, setRepo] = useState<any[]>([]);
  const [addedRepos, setAddedRepos] = useState<string[]>([]); // Track added repos
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const reposPerPage = 6; // Number of repos to display per page
  const token = useTokenStore((state) => state.token);
  const [selectedRepo, setSelectedRepo] = useState(false);
  const [hookAdded, setHooksAdded] = useState(false);
  const balance = useBalanceStore((state) => state.balance);
  const setBalance = useBalanceStore((state) => state.setBalance);

  // Fetch added repositories
  useEffect(() => {
    const getAddedRepositories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/user/repos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAddedRepos(response.data.map((repo: any) => repo.repoName)); // Store added repo names
      } catch (error) {
        setError('Failed to fetch added repositories');
        console.error(error);
      }
    };

    if (token) {
      getAddedRepositories();
    }
  }, [token]);

  const fetchBalance = async () => {
    try {
      if (!token) {
        throw new Error("No token found in store");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get-balance`,
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
      setBalance(data.balance);
    } catch (error) {
      setError("Error fetching balance: " + (error as Error).message);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [balance]);

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
      console.log("RepoData:", data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Error fetching repos: " + (error as Error).message);
    }
  };



  const handleClick = async (hookUrl: string, repoName: string, repoUrl: string) => {
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
          repoUrl
        }),
      });

      if (res.status === 200) {
        console.log("Hook added successfully");
        setSelectedRepo(true);
        setHooksAdded(true);
        setAddedRepos((prev) => [...prev, repoName]); // Update added repos
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
    <div className="container mx-auto py-8">
      <div className="text-center">
        {loading ? (
          <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <Loader className="animate-spin h-12 w-12 text-blue-500" />
          </div>
        ) : !repo.length && !hookAdded ? (
          <>
            <h3 className="text-2xl font-bold tracking-tight mb-4">
              Add your repo to create bounties
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              You can start selling as soon as you add a product.
            </p>
            <Button onClick={fetchRepos} className="">
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
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-semibold text-green-600">
            Repo added successfully for bounty!
          </h1>
          {balance ? (
            <div className="text-center">
              <p>You have {balance} SOL in your balance. Use it for bounties!</p>
              <Link href="/maintainer/create-bounty">
                <Button className="mt-4">Add More Sol</Button>
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-red-600">
                You don&apos;t have enough SOL in your balance. Please deposit SOL to proceed.
              </p>
              <Link href="/maintainer/create-bounty">
                <Button className="mt-4">Add Sol For Bounty</Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          {error && (
            <div className="mt-5 text-red-500 text-center">
              {error}
            </div>
          )}
          {repo.length > 0 && (
            <>
              <div
                id="repo"
                className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 px-4 py-6"
              >
                {paginatedRepos.map((item) => {
                  const isAdded = addedRepos.includes(item.name);
                  return (
                    <Card
                      key={item.name}
                      className="shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                          {item.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between mb-4">
                          <p className="text-sm text-gray-600">
                            Stars: {item.stargazers_count}
                          </p>
                          <p className="text-sm text-gray-600">
                            Forks: {item.forks}
                          </p>
                        </div>
                        <CoolMode>
                          <Button
                            onClick={() => handleClick(item.hooks_url, item.name, item.html_url)}
                            className={`w-full ${
                              isAdded ? "bg-gray-500" : "bg-blue-500"
                            }`}
                            disabled={isAdded} // Disable if repo is already added
                          >
                            {isAdded ? "Already Added" : "Add to bounty"}
                          </Button>
                        </CoolMode>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <div className="flex justify-center space-x-4 my-8">
                <Button
                  variant="outline"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                <span className="text-gray-700">
                  Page {currentPage + 1} of{" "}
                  {Math.ceil(repo.length / reposPerPage)}
                </span>
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
