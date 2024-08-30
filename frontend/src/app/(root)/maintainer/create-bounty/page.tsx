"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  clusterApiUrl,
} from "@solana/web3.js";
import { useBalanceStore, useTokenStore } from "@/store";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

require("@solana/wallet-adapter-react-ui/styles.css"); // Default styles for wallet adapter UI

const CreateBounty = () => {
  const [repos, setRepos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const token = useTokenStore((state) => state.token);
  const setBalance = useBalanceStore((state) => state.setBalance);
  const balance = useBalanceStore((state) => state.balance);
  const wallet = useWallet();

  // Fetch added repositories
  useEffect(() => {
    const getAddedRepositories = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/user/repos`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRepos(response.data);
      } catch (error) {
        setError("Failed to fetch repositories");
        console.error(error);
      }
    };

    if (token) {
      getAddedRepositories();
    }
  }, [token]);

  const fetchBalance = async () => {
    try {
      if (!token) {
        throw new Error("No token found in store");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get-balance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      setError("Error fetching balance: " + (error as Error).message);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [balance]);

  const sendSOL = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      setError("Wallet not connected");
      return;
    }

    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const recipientPublicKey = new PublicKey(
        process.env.NEXT_PUBLIC_PARENT_PUBLIC_KEY as string
      );
      const lamports = 1000000000; // 1 SOL in lamports

      // Create and sign the transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: recipientPublicKey,
          lamports,
        })
      );

      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      // Send the transaction signature and amount to the backend for verification
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/verify-payment`,
        {
          signature,
          amount: 1, // Amount in SOL
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT here
          }
        }
      );

      if (response.data.message === "Payment verified and user balance updated") {
        alert("Transaction successful and verified!");
      } else {
        setError("Transaction verification failed.");
      }
    } catch (error) {
      setError("Transaction failed: " + error);
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-lg p-6 rounded-lg shadow-md border">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Add Solana Bounty</h2>

        {error && (
          <div className="mb-4 p-3 text-red-500 rounded-md flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            {error}
          </div>
        )}

        <h1 className="text-lg font-bold text-gray-300 text-center mb-6">
          Balance: {balance} SOL
        </h1>

        {/* {repos.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {repos.map((repo) => (
              <div
                key={repo._id}
                className="border border-gray-300 p-4 rounded-md bg-gray-50"
              >
                <p className="text-center text-gray-700">{repo.repoName}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center mb-6">
            No repositories added yet.
          </p>
        )} */}

        <Button
          className="w-full transition duration-200"
          onClick={sendSOL}
          disabled={!wallet.connected}
        >
          Send 1 SOL for Bounty
        </Button>

        {!wallet.connected && (
          <p className="mt-4 text-sm text-gray-600 text-center">
            Please connect your wallet to send SOL.
          </p>
        )}
      </div>
      <div className="mt-10">
        <h1 className="text-center">Use This command to send sol to <br /> contributor Directly from Github repo PR</h1>
      </div>
      <div className="mt-5 border rounded-full bg-zinc-900">
          <p className="px-3 py-2 text-center">/sol-amount @username</p>
      </div>
    </div>
  );
};

export default CreateBounty;
