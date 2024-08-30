'use client';

import { Button } from '@/components/ui/button';
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

  const fetchUserRepos = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/all-repo`);

      const data = await response.json();
      setRepos(data);
      console.log(data)
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;


  return (
    <div className="container mx-auto p-4">
      <h2 className="text-4xl text-center font-bold mb-8 text-gray-300">Bounty Projects</h2>
      {
        repos.length === 0 ? (
          <Button className="text-center text-gray-600" onClick={fetchUserRepos}>
            See All Bounties
          </Button>
        ) : (
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
        )
      }
      
    </div>
  );
};

export default Bounties;
