
"use client";
import React, { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useRoleStore, useTokenStore } from "@/store"; // Ensure the path is correct
import Link from "next/link";
import { Loader, Rocket, User } from "lucide-react";

const Hero = () => {

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const setToken = useTokenStore((state) => state.setToken);
  const token = useTokenStore((state) => state.token);
  const { role, setRole } = useRoleStore((state) => ({
    role: state.role,
    setRole: state.setRole,
  }));

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      const retrievedToken = queryParams.get("token");
      if (retrievedToken) {
        setToken(retrievedToken);
        window.history.replaceState({}, document.title, "/");
        setToken(retrievedToken);
        router.push("/select-role");
      }
    }
  }, [setToken, router]);

  const handleGitHubLogin = () => {
    setLoading(true);
    window.location.href = `${process.env.NEXT_PUBLIC_GITHUB_URL}`;
  };

  const handleRoleLogin = () => {
    setLoading(true);
    router.push(`${role}`);
  };

  return (
    <section className="flex items-center justify-center h-screen">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-5">
          <div className="text-sm inline-flex border border-[#222]/10 dark:border-[#fff]/10 px-3 py-1 rounded-lg tracking-tight shadow-inner dark:shadow-white/70">
            Version 1 is here
          </div>
        </div>
        <div className="max-w-[600px] lg:max-w-[900px] mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter bg-gradient-to-b from-black to-black/70 dark:bg-gradient-to-b dark:from-white dark:to-white/70 text-transparent bg-clip-text text-center">
            Turn your GitHub contributions into Solana rewards.
          </h1>

          <p className="md:text-lg tracking-tighter text-black/70 dark:text-white/70 text-center mt-5 font-medium">
            Contribute your expertise and earn Solana by solving real-world
            problems.
          </p>
        </div>
        <div className="flex items-center justify-center mt-5">
        {token && !role ? (
        <Link href="/select-role">
          <Button
            className="py-6 text-sm md:text-base shadow-inner shadow-white/70 text-white dark:text-black dark:border-none dark:shadow-black/70 bg-black dark:bg-white gap-1 items-center"
          >
            {
                loading ? <Loader className="animate-spin"/> :  <User className="h-5 w-5" />
              }
            <span>Select your role</span>
          </Button>
        </Link>
      ) : token && role ? (
        <Button
          
          onClick={handleRoleLogin}
          className="py-6 text-sm md:text-base shadow-inner shadow-white/70 text-white dark:text-black dark:border-none dark:shadow-black/70 bg-black dark:bg-white gap-2"
        >
           {
                loading ? <Loader className="animate-spin"/> :  <Rocket className="h-5 w-5" />
              }
          {/* Content for users with both token and role */}
          <span>Get Started Now</span>
        </Button>
      ) : (
        <Button
          variant="outline"
          className="pl-2 py-6 text-sm md:text-base shadow-inner shadow-white/70 dark:bg-black"
          onClick={handleGitHubLogin}
        >
          <span className="flex items-center gap-2">
            <div className="px-3 py-2 rounded-md shadow-inner shadow-white/70 dark:shadow-black bg-black dark:bg-white dark:text-black text-white font-medium">
              {
                loading ? <Loader className="animate-spin"/> :  <FaGithub />
              }
            </div>
            Get started with GitHub
          </span>
        </Button>
      )}
        </div>
      </div>
    </section>
  );
};

export default Hero;