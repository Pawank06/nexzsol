"use client";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
import { useState } from "react";

const Hero = () => {
  const [repo, setRepo] = useState([]);
  return (
    <section className="flex items-center justify-center h-screen">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-5">
          <div className="text-sm inline-flex border border-[#222]/10 dark:border-[#fff]/10 px-3 py-1 rounded-lg tracking-tight shadow-inner dark:shadow-white/70">
            Version 1 is here
          </div>
        </div>
        <div className="max-w-[600px] lg:max-w-[900px] mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter bg-gradient-to-b from-black to-black/70 dark:bg-gradient-to-b dark:from-white dark:to-white/70  text-transparent bg-clip-text text-center">
            Turn your github contributions into solana rewards.
          </h1>

          <p className="md:text-lg tracking-tighter text-black/70 dark:text-white/70 text-center mt-5 font-medium">
            Contribute your expertise and earn Solana by solving real-world
            problems.
          </p>
        </div>
        <div className="flex items-center justify-center mt-5">
          <Button
            className="pl-2 py-6 text-sm md:text-base shadow-inner shadow-white/70"
            variant="outline"
          >
            <span className="flex items-center gap-2">
              <div className="px-3 py-2 rounded-md shadow-inner shadow-white/70 dark:shadow-black bg-black dark:bg-white dark:text-black text-white font-medium">
                <FaGithub />
              </div>
              <a
                href="https://github.com/login/oauth/select_account?client_id=Ov23li6NL0UGR6ckpI25&scope=repo"
                className="no-underline none"
              >
                Get started with github
              </a>
            </span>
          </Button>
          <Button
            className="pl-2 py-6 text-sm md:text-base shadow-inner shadow-white/70"
            variant="outline"
            onClick={() => {
              fetch("http://localhost:4000/user/repo")
                .then((response) => response.json())
                .then((data) => {
                  console.log(data);
                  setRepo(data);
                });
            }}
          >
            <span className="flex items-center gap-2">
              <div className="px-3 py-2 rounded-md shadow-inner shadow-white/70 dark:shadow-black bg-black dark:bg-white dark:text-black text-white font-medium">
                <FaGithub />
                Access Repos
              </div>
            </span>
          </Button>
        </div>
        {repo && (
          <div className="" id="repo">
            {repo.map((item: any) => (
              <div
                key={item.name}
                className="flex items-center justify-between hover:bg-slate-400"
                onClick={async () => {
                  console.log(item);
                  const data = fetch("http://localhost:4000/user/repo", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      hookUrl: item.hooks_url,
                      repoName: item.name,
                    }),
                  });
                  const result = (await data).json();
                console.log(result);
                }}
                
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
