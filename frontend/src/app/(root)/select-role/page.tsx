"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTokenStore, useRoleStore, useGitIdStore } from "@/store";
import { stat } from "fs";

type Role = 'contributor' | 'maintainer';

const SelectRole = () => {
  const router = useRouter();
  const token = useTokenStore((state) => state.token);
  const gitId = useGitIdStore((state) => state.gitId )
  const { role, setRole } = useRoleStore((state) => ({
    role: state.role,
    setRole: state.setRole,
  }));

  useEffect(() => {
    if (!token) {
      router.push('/');
    } else if (role) {
      router.push(`/${role}`);
    }
  }, [token, role, router]);

  const handleRoleSelection = async (selectedRole: Role) => {
    setRole(selectedRole); // Store the role in Zustand state

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Assuming you are sending the token for authentication
        },
        body: JSON.stringify({
          gitId,
          role: selectedRole,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Role updated successfully:", data);
        router.push(`/${selectedRole}`); // Redirect to role-specific dashboard
      } else {
        const errorData = await response.json();
        console.error("Error updating role:", errorData.message);
      }
    } catch (error) {
      console.error("Error making the request:", error);
    }
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
