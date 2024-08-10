import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

const client_id = process.env.CLIENT_ID!;
const client_secret = process.env.CLIENT_SECRET!;
const jwtSecret = process.env.JWT_SECRET || "defaultSecret";

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code = req.query.code as string;
    if (!code) {
      return res.status(400).json({ error: "Authorization code is required" });
    }

    console.log(`Authorization Code: ${code}`);

    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      return res.status(tokenResponse.status).json({ error: "Failed to fetch access token" });
    }

    const tokenData = await tokenResponse.text();
    console.log(`Token Data: ${tokenData}`);

    const accessToken = new URLSearchParams(tokenData).get("access_token");

    if (!accessToken) {
      return res.status(400).json({ error: "Failed to retrieve access token" });
    }

    console.log(`Access Token: ${accessToken}`);

    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      return res.redirect(`http://localhost:3000?error=${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    const { login, avatar_url, id, email } = userData;

    // Check if the user already exists
    let userModel = await User.findOne({ gitId: id });

    if (!userModel) {
      // If user does not exist, insert the new user
      userModel = await User.create({
        gitId: id,
        name: login,
        accessToken,
        avatarUrl: avatar_url,
      });
    } else {
      
      userModel.accessToken = accessToken;
      await userModel.save();
    }

    const token = jwt.sign({ id: userModel._id }, jwtSecret, {
      expiresIn: "1000d",
    });

    console.log(`User Data: ${JSON.stringify(userData)}`);
    res.redirect(`http://localhost:3000?token=${token}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: (error as Error).message });
  }
};

export { getUser };
