import { Request, Response } from "express";
import { config } from "../config/config";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import nacl from "tweetnacl";
import User from "../models/userModel";
import jwt from 'jsonwebtoken'
import UserRepo from "../models/userRepoModel";

const GITHUB_API_URL = config.githubAPIURL;

const connection = new Connection(process.env.RPC_URL ?? "https://api.devnet.solana.com", 'confirmed');

const PARENT_WALLET_ADDRESS = "5ckKLcEPRi2F5UZRPGuVAUj6mrDKpJ63QVmnpHoaBfFJ";


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


    const authHeader = req.headers.authorization;

    const token = authHeader?.split(" ")[1];

    
    console.log(token)

    let userId

    jwt.verify(token as string, config.jwtSecret, async (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(401).json({ error: "Invalid or expired token" });
      }
  
      if (!decoded) {
        return res.status(401).json({ error: "Token verification failed" });
      }
  
      const { id } = decoded as { id: string };
      userId = id;
      console.log("User ID:", userId);
  
    });

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
    console.log(result)
    res.status(200).json(result);


    const newUserRepo = new UserRepo({
      userId,
      repoName,
      hookUrl,
    });

    await newUserRepo.save();
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

const getUserRepos = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Authorization token is required" });
    }

    jwt.verify(token, config.jwtSecret, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      const { id: userId } = decoded as { id: string };

      // Fetch repositories for the user
      const userRepos = await UserRepo.find({ userId });

      res.status(200).json(userRepos);
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err });
  }
};



const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { signature, amount } = req.body;

    // Fetch transaction details
    const transaction = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 1,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Verify the transaction amount
    const postBalance = transaction.meta?.postBalances[1] ?? 0;
    const preBalance = transaction.meta?.preBalances[1] ?? 0;
    const transactionAmount = (postBalance - preBalance) / 1000000000; // Convert lamports to SOL

    if (transactionAmount !== amount) {
      return res.status(411).json({ message: "Transaction amount mismatch" });
    }

    // Verify the sender and receiver addresses
    const senderAddress = transaction.transaction.message.getAccountKeys().get(0)?.toString();
    const receiverAddress = transaction.transaction.message.getAccountKeys().get(1)?.toString();

    if (receiverAddress !== PARENT_WALLET_ADDRESS) {
      return res.status(411).json({ message: "Transaction sent to wrong address" });
    }

    // Verify JWT token and get user ID
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    const decoded = jwt.verify(token as string, config.jwtSecret ?? "") as { id: string };
    const userId = decoded.id;

    console.log("userid", userId)

    if (senderAddress) {
      // Update the user's balance
      await User.updateOne(
        { _id: userId },
        { $inc: { balance: amount } } // Increment balance by the amount
      );

      res.json({ message: "Payment verified and user balance updated" });

    } else {
      return res.status(411).json({ message: "Invalid sender address" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};



export {getRepo, sendRepo, verifySignature, updateRole, getUserRepos, verifyPayment}