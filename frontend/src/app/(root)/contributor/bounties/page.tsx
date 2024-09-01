import React, { use } from "react";
import { useState , useEffect} from "react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CoolMode } from "@/components/magicui/cool-mode";




const Bounties = () => {
  const [bounties, setBounties] = useState([]);
  useEffect(() => {
    fetch("https://api.github.com/repos/facebook/react")
      .then((response) => response.json())
      .then((data) => setBounties(data));
  }, []);
  return (
    <div className="flex justify-center items-center">
      {bounties.map((item:any) => {
        return (
          <Card
            key={item.repoName}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {item.repoName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              
              <CoolMode>
                <Button
                  onClick={() => {
                    window.open(item.repoUrl, "_blank");
                  }}
                  className={`w-full bg-blue-500`}
                   // Disable if repo is already added
                >
                  Check out this repo
                </Button>
              </CoolMode>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Bounties;
