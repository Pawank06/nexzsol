"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { useRoleStore, useGitIdStore, useTokenStore, useVerifyTokenStore } from "@/store";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';
import Link from 'next/link';

type StepIndicatorProps = {
  currentStep: number;
};

type ProgressBarProps = {
  currentStep: number;
};

type StepContentProps = {
  currentStep: number;
  publicKey: string | null;
};

type NavigationButtonsProps = {
  currentStep: number;
  handlePrev: () => void;
  handleNext: () => void;
  publicKey: string | null;
};

const steps = [
  { label: 'Connect Your Wallet' },
  { label: 'Sign the Message' },
  { label: 'Create Bounties' },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => (
  <div className="flex justify-between">
    {steps.map((step, index) => (
      <div key={step.label} className="flex flex-col items-center">
        <motion.div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            index <= currentStep ? 'bg-red-500/15 text-red-500' : 'bg-secondary'
          }`}
          initial={false}
          animate={{ scale: index === currentStep ? 1.2 : 1 }}
        >
          {index <= currentStep ? (
            <CheckCircle size={20} />
          ) : (
            <Circle size={20} />
          )}
        </motion.div>
        <div className="mt-2 text-sm">{step.label}</div>
      </div>
    ))}
  </div>
);

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => (
  <motion.div
    className="mt-4 h-2 rounded-full bg-red-500"
    initial={{ width: '0%' }}
    animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
  />
);

const StepContent: React.FC<StepContentProps> = ({ currentStep, publicKey }) => {
  const content = [
    publicKey ? (
      <p key="connected" className="text-sm text-gray-500">Wallet Connected!</p>
    ) : (
      <div key="connect" className='bg-white mt-2 rounded-md flex items-center justify-center shadow-inner shadow-black/70'>
        <WalletMultiButton style={{ backgroundColor: "transparent", color: "black", display: "flex", gap: "8px" }}>
          <span className='font-medium'>Select Wallet</span>
        </WalletMultiButton>
      </div>
    ),
    <p key="verifying" className="text-sm text-gray-500">Waiting for signature verification...</p>,
    <Link key="create" href='/maintainer/repos'>
      <Button className="mt-4">Create Bounties</Button>
    </Link>,
  ];

  return (
    <div className="my-4 flex min-h-[30vh] w-full items-center justify-center rounded-lg border bg-gray-100 text-center dark:border-gray-600 dark:bg-gray-800">
      {content[currentStep]}
    </div>
  );
};

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ currentStep, handlePrev, handleNext, publicKey }) => (
  <div className="flex justify-end gap-3">
    {currentStep > 0 && (
      <button onClick={handlePrev} className="rounded-2xl bg-red-500 px-2 py-1 text-sm font-medium text-white">
        Previous
      </button>
    )}
    {currentStep < steps.length - 1 && publicKey && (
      <button onClick={handleNext} className="rounded-2xl bg-red-500 px-2 py-1 text-sm font-medium text-white">
        Next
      </button>
    )}
  </div>
);

const Dashboard: React.FC = () => {
  const router = useRouter();
  const role = useRoleStore((state) => state.role);
  const { publicKey, signMessage } = useWallet();
  const gitId = useGitIdStore((state) => state.gitId);
  const token = useTokenStore((state) => state.token);
  const setVerifyToken = useVerifyTokenStore((state) => state.setVerifyToken);
  const verifyToken = useVerifyTokenStore((state) => state.verifytoken);
  const [currentStep, setCurrentStep] = useState(0);

  async function signAndSend() {
    if (!publicKey) return;

    try {
      const message = new TextEncoder().encode("Sign into nexzsol");
      const signature = await signMessage?.(message);

      if (!signature) {
        console.error("Signature failed");
        return;
      }

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

      if (response.ok) {
        const { verifyToken } = data;
        setVerifyToken(verifyToken);
        setCurrentStep(2); // Move to step 3 (Create Bounties) once the signature is verified
      } else {
        console.error("Verification failed:", data.message);
      }
    } catch (error) {
      console.error("Error during signing or sending data:", error);
    }
  }

  useEffect(() => {
    if (publicKey && verifyToken === "") {
      signAndSend();
    }
  }, [publicKey, verifyToken]);

  useEffect(() => {
    if (role !== 'maintainer') {
      router.push(`/${role || ''}`);
    }
  }, [role, router]);

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <StepIndicator currentStep={currentStep} />
      <ProgressBar currentStep={currentStep} />
      <StepContent currentStep={currentStep} publicKey={publicKey ? publicKey.toString() : null} />
      <NavigationButtons
        currentStep={currentStep}
        handlePrev={handlePrev}
        handleNext={handleNext}
        publicKey={publicKey ? publicKey.toString() : null}
      />
    </div>
  );
};

export default Dashboard;
