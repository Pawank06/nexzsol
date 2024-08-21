'use client'
import { Button } from '@/components/ui/button'
import React, { useEffect } from 'react'
import { useRouter } from "next/navigation";
import { useRoleStore } from "@/store";

const Dashboard = () => {
    const router = useRouter();
  const role = useRoleStore((state) => state.role);

  useEffect(() => {
    if (role !== 'maintainer') {
      router.push(`/${role || ''}`);
    }
  }, [role, router]);
  
    return (
        <div>
            <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                    You have no bounties
                </h3>
                <p className="text-sm text-muted-foreground">
                    You can start selling as soon as you add a product.
                </p>
                <Button className="mt-4">Create Bounty</Button>
            </div>
        </div>
    )
}

export default Dashboard