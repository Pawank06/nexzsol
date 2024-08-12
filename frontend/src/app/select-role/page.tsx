"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import useTokenStore from "@/store";

type Role = 'contributor' | 'maintainer';

const SelectRole = () => {
  const router = useRouter();
  const token = useTokenStore((state) => state.token)

  if(!token){
    return router.push('/')
  }


  const handleRoleSelection = (role: Role) => {
    router.push(`/${role}`); // Redirect to role-specific dashboard
  };

  return (
    <section className="flex items-center justify-center h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-5">Select Your Role</h1>
        <div className="flex justify-center gap-4">
          <Button
            className="shadow-inner dark:shadow-black/70 shadow-white/70"
            onClick={() => handleRoleSelection('contributor')}
          >
            Contributor
          </Button>
          <Button
            className="bg-white text-black shadow-inner shadow-black/70 dark:bg-black dark:text-white dark:shadow-white/70 hover:bg-white dark:hover:bg-black"
            onClick={() => handleRoleSelection('maintainer')}
          >
            Maintainer
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SelectRole;
