const access_token = "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";
import { Router } from "express";

const userRoutes = Router();
userRoutes.get("/repo", async (req, res, next) => {
  const headers = {
    Authorization: `token ${access_token}`,
  };
    const data = await fetch("https://api.github.com/user/repos", {
        headers,
    });
    const response = await data.json();
    res.json(response);
});
userRoutes.post("/repo", async (req, res, next) => {
    const {hookUrl, repoName} = req.body;
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
});
export default userRoutes;