import { Request, Response } from "express";
import { config } from "../config/config";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import nacl from "tweetnacl";
import User from "../models/userModel";
import jwt from 'jsonwebtoken'

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


const verifySignature = async (req: Request, res: Response) => {
  try {
    const { publicKey, signature, gitId } = req.body;
    const message = new TextEncoder().encode("Sign into nexzsol");

    // Verify the signature
    const isValid = nacl.sign.detached.verify(
      message,
      new Uint8Array(signature.data),
      new PublicKey(publicKey).toBytes()
    );

    if (!isValid) {
      return res.status(411).json({
        message: "Incorrect signature",
      });
    }

    // Find the user by their GitHub ID
    const user = await User.findOne({ gitId });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update the user's Solana address
    user.solanaAddress = publicKey;
    await user.save();

    const verifyToken = jwt.sign(
      {
        gitId: user.gitId,
        solanaAddress: user.solanaAddress,
      },
      config.jwtSecret,
      {expiresIn: '1h'}
    )

    return res.status(200).json({
      message: "Signature is valid and address saved",
      solanaAddress: user.solanaAddress,
      verifyToken,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error", details: err });
  }
};

const updateRole = async (req: Request, res: Response) => {
  try {
      const { gitId, role } = req.body;

      // Validate role
      if (!["maintainer", "contributor"].includes(role)) {
          return res.status(400).json({ error: "Invalid role" });
      }

      // Find the user by their GitHub ID
      const user = await User.findOne({ gitId });

      if (!user) {
          return res.status(404).json({
              message: "User not found",
          });
      }

      // Update the user's role
      user.role = role;
      await user.save();

      return res.status(200).json({
          message: "Role updated successfully",
          role: user.role,
      });
  } catch (err) {
      return res.status(500).json({ error: "Internal Server Error", details: err });
  }
};


export {getRepo, sendRepo, verifySignature, updateRole}