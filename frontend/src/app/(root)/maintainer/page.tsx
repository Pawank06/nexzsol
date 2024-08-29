'use client'

import React, { useEffect } from 'react'
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button'
import { useRoleStore, useGitIdStore, useTokenStore, useVerifyTokenStore } from "@/store";
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui'
import Link from 'next/link';

const Dashboard = () => {
  const router = useRouter();
  const role = useRoleStore((state) => state.role);
  const { publicKey, signMessage } = useWallet();
  const gitId = useGitIdStore((state) => state.gitId);
  const token = useTokenStore((state) => state.token);
  const SetVerifytoken = useVerifyTokenStore((state) => state.setVerifyToken);
  const verifytoken = useVerifyTokenStore((state) => state.verifytoken);

  async function signAndSend() {
    if (!publicKey) return;

    try {
      const message = new TextEncoder().encode("Sign into nexzsol");
      const signature = await signMessage?.(message);

      if (!signature) {
        console.error("Signature failed");
        return;
      }

      // Send the public key and signature to the backend for verification
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/verify-signature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          publicKey: publicKey.toString(),
          signature,
          gitId,
        }),
      });

      const data = await response.json();
      console.log("data: ", data);

      if (response.ok) {
        const { verifyToken } = data;
        SetVerifytoken(verifyToken);
        console.log("Verify token:", verifyToken);
        console.log("Signature verified, address saved, and token received");
      } else {
        console.error("Verification failed:", data.message);
      }
    } catch (error) {
      console.error("Error during signing or sending data:", error);
    }
  }

  useEffect(() => {
    if (publicKey && verifytoken === "") {
      signAndSend();
    }
  }, [publicKey]);

  useEffect(() => {
    if (role !== 'maintainer') {
      router.push(`/${role || ''}`);
    }
  }, [role, router]);

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h3 className="text-2xl font-bold tracking-tight">
        {publicKey ? `Wallet Connected` : "Connect Your Wallet"}
      </h3>
      <p className="text-sm text-muted-foreground">
        {publicKey ? "You are ready to create bounties!" : "Please connect your wallet to start."}
      </p>
      {publicKey ? (
        <Link href='/maintainer/repos'>
          <Button className="mt-4">Create bounties</Button>
        </Link>
      ) : (

        <WalletMultiButton className="mt-4" />
      )}
    </div>
  );
};

export default Dashboard;