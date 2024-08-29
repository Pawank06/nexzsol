'use client'

import React, { useEffect } from 'react'
import Logo from '../icons/Logo'
import Link from 'next/link'
import { Button } from '../ui/button'
import { FaWallet } from 'react-icons/fa'
import { ModeToggle } from '../ModeToggle'
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { useGitIdStore, useTokenStore, useVerifyTokenStore } from '@/store'
import { WalletMinimal } from 'lucide-react'

const Navbar = () => {
    const { publicKey, signMessage } = useWallet()
    const gitId = useGitIdStore((state) => state.gitId)
    const token = useTokenStore((state) => state.token)
    const SetVerifytoken = useVerifyTokenStore((state) => state.setVerifyToken)
    const verifytoken = useVerifyTokenStore((state) => state.verifytoken)

    async function signAndSend() {
        if (!publicKey) return

        try {
            const message = new TextEncoder().encode("Sign into nexzsol")
            const signature = await signMessage?.(message)

            if (!signature) {
                console.error("Signature failed")
                return
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
            })

            const data = await response.json()
            console.log("data: ",data)

            if (response.ok) {
                const { verifyToken } = data;
                SetVerifytoken(verifyToken);
                console.log("Verify token:",verifyToken);
                console.log("Signature verified, address saved, and token received");
            } else {
                console.error("Verification failed:", data.message)
            }
        } catch (error) {
            console.error("Error during signing or sending data:", error)
        }
    }

    useEffect(() => {
        if (publicKey && verifytoken === "") {
            signAndSend()
        }
    }, [publicKey])

    return (
        <header className="py-4 border-b md:border-none fixed top-0 left-0 right-0 z-10">
            <div className="container mx-auto px-4 ">
                <div className="flex justify-between items-center md:border md:p-2.5 rounded-xl max-w-2xl lg:max-w-4xl mx-auto backdrop-blur-0blur-sm">
                    <div>
                        <div className="dark:border h-10 w-10 rounded-lg inline-flex justify-center items-center shadow-inner bg-black shadow-white/70">
                            <Logo className="h-8 w-8 " />
                        </div>
                    </div>
                    <div className="hidden md:block ">
                        <nav className="flex gap-8 text-sm">
                            <Link
                                className="hover:underline"
                                href="#"
                            >
                                Products
                            </Link>
                            <Link
                                className="hover:underline"
                                href="#"
                            >
                                FAQ
                            </Link>
                            <Link
                                className="hover:underline"
                                href="#"
                            >
                                Company
                            </Link>
                            <Link
                                className="hover:underline"
                                href="#"
                            >
                                Blogs
                            </Link>
                        </nav>
                    </div>
                    <div className="flex gap-4 items-center">
                    {
                            publicKey ? (

                                <WalletDisconnectButton style={{backgroundColor: "white", color: "black", fontWeight: "bold"}}>
                                    
                                </WalletDisconnectButton>
                            ) : (
                                <div className='bg-white rounded-md flex items-center justify-center shadow-inner shadow-black/70'>
                                    
                                <WalletMultiButton style={{backgroundColor: "transparent", color: "black", display: "flex", gap: "8px", paddingLeft: "8px",}}>
                                    <div className='bg-black px-3 py-2 rounded-md text-white shadow-inner shadow-white/70'>
                                    <WalletMinimal className='w-4'/>
                                    </div>
                                    <span className='font-medium'>Select Wallet</span>
                                </WalletMultiButton>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar
