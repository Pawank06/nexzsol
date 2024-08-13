import { Request, Response } from "express";
import { config } from "../config/config";

const GITHUB_API_URL = config.githubAPIURL;


const getRepo = async (req: Request, res: Response) => {
    try {
      const accessToken = req.headers.accessToken as string;
  
      if (!accessToken) {
        return res.status(400).json({ error: "Access token is required" });
      }
  
      const headers = {
        Authorization: `token ${accessToken}`,
      };

      console.log(headers)
  
      const response = await fetch(GITHUB_API_URL as string, {
        headers,
      });
  
      if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch repositories" });
      }
      
      const data = await response.json();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", details: err });
    }
  };

const sendRepo = async (req: Request, res: Response) => {
    const access_token = req.headers.accessToken;
    const { hookUrl, repoName } = req.body;
    const headers = {
      Authorization: `token ${access_token}`,
    };
    const data = await fetch(`${hookUrl}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: "web",
        active: true,
        events: ["issue_comment"],
        config: {
          url: "https://nexzsol.onrender.com/api/webhook",
          content_type: "json",
        },
      }),
    });
    const result = await data.json();
    res.status(200).json(result);
}

export {getRepo, sendRepo}