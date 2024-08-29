'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Connection, PublicKey, Transaction, SystemProgram, clusterApiUrl } from '@solana/web3.js';
import { useTokenStore } from '@/store';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';

require('@solana/wallet-adapter-react-ui/styles.css'); // Default styles for wallet adapter UI

const CreateBounty = () => {
  const [repos, setRepos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const token = useTokenStore((state) => state.token);
  const wallet = useWallet();

  // Fetch added repositories
  useEffect(() => {
    const getAddedRepositories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/user/repos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRepos(response.data);
      } catch (error) {
        setError('Failed to fetch repositories');
        console.error(error);
      }
    };

    if (token) {
      getAddedRepositories();
    }
  }, [token]);

  const sendSOL = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      setError('Wallet not connected');
      return;
    }
  
    try {
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const recipientPublicKey = new PublicKey(process.env.NEXT_PUBLIC_PARENT_PUBLIC_KEY as string);
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
      await connection.confirmTransaction(signature, 'confirmed');
  
      // Send the transaction signature and amount to the backend for verification
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/verify-payment`, {
        signature,
        amount: 1, // Amount in SOL
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Include JWT here
        }
      });
  
      if (response.data.message === 'Payment verified and user balance updated') {
        alert('Transaction successful and verified!');
      } else {
        setError('Transaction verification failed.');
      }
    } catch (error) {
      setError('Transaction failed: ' + error);
      console.error(error);
    }
  };
  

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2>Added Repositories</h2>
      {repos.length > 0 ? (
        <ul>
          {repos.map((repo) => (
            <li key={repo._id}>{repo.repoName}</li>
          ))}
        </ul>
      ) : (
        <p>No repositories added yet.</p>
      )}
      <Button onClick={sendSOL} disabled={!wallet.connected}>
        Send 1 SOL to Parent Account
      </Button>
      {/* If needed, add wallet connection UI here */}
    </div>
  );
};

export default CreateBounty;
