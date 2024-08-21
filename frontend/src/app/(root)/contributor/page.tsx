"use client";
import { Button } from '@/components/ui/button';
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoleStore } from "@/store";

const Dashboard = () => {
  const router = useRouter();
  const role = useRoleStore((state) => state.role);

  useEffect(() => {
    if (role !== 'contributor') {
      router.push(`/${role || ''}`);
    }
  }, [role, router]);

  return (
    <div>
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          You didn&apos;t win any bounties yet.
        </h3>
        <p className="text-sm text-muted-foreground">
          You can start winning your first bounty now.
        </p>
        <Button className="mt-4">Explore bounties</Button>
      </div>
    </div>
  );
}

export default Dashboard;
