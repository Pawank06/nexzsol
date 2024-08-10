'use client'

import { Button } from '@/components/ui/button'
import { getTokenFromLocalStorage } from '@/utils/tokenUtils';
import React, { useState } from 'react'

const Dashboard = () => {
    const [repo, setRepo] = useState<any[]>([]);
    const [username, setUsername] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const fetchRepos = async () => {
        try {
            const token = getTokenFromLocalStorage();
            if (!token) {
                throw new Error("No token found in localStorage");
            }

            const response = await fetch(`http://localhost:4000/user/repo?username=${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setRepo(data);
            console.log("Fetched repositories:", data);
        } catch (error) {
            setError("Error fetching repos: " + (error as Error).message);
        }
    };
    return (
        <div>
            <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                    Add you repo for create bounty
                </h3>
                <p className="text-sm text-muted-foreground">
                    You can start selling as soon as you add a product.
                </p>
                <Button onClick={fetchRepos} className="mt-4">Fetch all repos</Button>
            </div>
            {error && (
                <div className="mt-5 text-red-500">
                    {error}
                </div>
            )}
            {repo.length > 0 && (
                <div id="repo" className="mt-5">
                    {repo.map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center justify-between hover:bg-slate-400 p-2 cursor-pointer"
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Dashboard