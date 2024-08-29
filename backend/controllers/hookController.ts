import { NextFunction, Request, Response } from "express";
import { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import User from "../models/userModel";
import logsModel from "../models/logsModel";
import bs58 from "bs58";

// Set up Solana connection to devnet
const connection = new Connection("https://api.devnet.solana.com");

// Load the parent wallet (maintainer) from the environment or a secure source
const parentWallet = Keypair.fromSecretKey(bs58.decode(process.env.PARENT_WALLET_PRIVATE_KEY!));

const manageComment = async (req: Request, res: Response) => {
  try {
    const event = req.headers["x-github-event"];
    
    if (event === "issue_comment") {
      const comment = req.body.comment;
      const commentBody = comment.body;

      // Check if the comment is from the repository owner
      if (comment.author_association === "OWNER") {
        // Check if the comment contains a bounty command
        if (commentBody.includes("/sol-")) {
          const contributorUsername = commentBody.split("@")[1].split(" ")[0];
          const amount = parseFloat(commentBody.split("/sol-")[1].split(" ")[0]);

          // Fetch the contributor from the database
          const contributor = await User.findOne({ name: contributorUsername, role: "contributor" });
          if (!contributor) {
            return res.status(404).json({ error: "Contributor not found" });
          }

          // Ensure contributor has a Solana address
          if (!contributor.solanaAddress) {
            return res.status(400).json({ error: "Contributor does not have a Solana address" });
          }

          // Fetch the maintainer (owner of the comment)
          const maintainer = await User.findOne({ gitId: comment.user.id, role: "maintainer" });
          if (!maintainer) {
            return res.status(404).json({ error: "Maintainer not found" });
          }

          // Check if the maintainer has sufficient balance
          if (maintainer.balance < amount) {
            return res.status(400).json({ error: "Insufficient balance" });
          }

          // Convert SOL amount to lamports (1 SOL = 1 billion lamports)
          const lamports = amount * LAMPORTS_PER_SOL;

          // Create the transaction
          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: parentWallet.publicKey,
              toPubkey: new PublicKey(contributor.solanaAddress),
              lamports,
            })
          );

          // Sign and send the transaction
          const signature = await connection.sendTransaction(transaction, [parentWallet]);
          await connection.confirmTransaction(signature);

          // Deduct from maintainer's balance in the database
          maintainer.balance -= amount;
          await maintainer.save();

          // Log the transaction
          const log = await logsModel.create({
            gitId: comment.id,
            action: "bounty_transfer",
            timestamp: Date.now(),
            log: {
              maintainer: maintainer.name,
              contributor: contributor.name,
              amount,
              solanaTransactionSignature: signature,
            },
          });
          await log.save();

          // Respond with success
          return res.status(200).json({ message: "Bounty transferred successfully", signature });
        }
      }
    } else {
      return res.status(200).json({ message: req.headers["x-github-event"] });
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err });
  }
};

export { manageComment };
