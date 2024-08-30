'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface UserRepo {
  userId: string;
  repoName: string;
  repoUrl: string;
}

const Bounties = () => {
  const [repos, setRepos] = useState<UserRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>("");

  useEffect(() => {
    const fetchUserRepos = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/all-repo`);

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setRepos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRepos();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-4xl text-center font-bold mb-8 text-gray-300">Bounty Projects</h2>
      <ul className="space-y-4">
        {repos.map((repo, index) => (
          <li key={index} className="border shadow-lg rounded-lg overflow-hidden">
            <div className="p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-green-600">{repo.repoName}</h3>
                {/* <p className="text-gray-500">Repository by User ID: {repo.userId}</p> */}
              </div>
              <Link href={repo.repoUrl} target='_blank' className="bg-slate-200 text-black py-2 px-4 rounded-md hover:bg-white transition duration-300">
                Go and Contribute
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Bounties;
