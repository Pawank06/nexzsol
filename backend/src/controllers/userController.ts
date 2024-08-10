import { Request, Response } from "express";

const GITHUB_API_URL = "https://api.github.com/user/repos";


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
  
      const response = await fetch(GITHUB_API_URL, {
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
        events: ["push"],
        config: {
          url: "https://nexzsol.com/api/github/webhook",
          content_type: "json",
        },
      }),
    });
    const result = data.json();
    res.json(result);
}

export {getRepo, sendRepo}