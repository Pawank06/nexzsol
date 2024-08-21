'use client'

import React, { useEffect } from 'react'
import Logo from '../icons/Logo'
import Link from 'next/link'
import { Button } from '../ui/button'
import {FaWallet} from 'react-icons/fa'
import { ModeToggle } from '../ModeToggle'
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'

const Navbar = () => {
    const {publicKey, signMessage} = useWallet()

    async function signAndSend(){

        if(!publicKey) return
        
        const message = new TextEncoder().encode("sign into nexzsol")
        const signature = await signMessage?.(message)
    }

    useEffect(() => {
        signAndSend()
    }, [publicKey])
    return (
        <header className="py-4 border-b md:border-none fixed top-0 left-0 right-0 z-10">
            <div className="container mx-auto px-4 ">
                <div className="flex justify-between items-center md:border md:p-2.5 rounded-xl max-w-2xl lg:max-w-4xl mx-auto backdrop-blur-0blur-sm">
                    <div>
                        <div className="dark:border h-10 w-10 rounded-lg inline-flex justify-center items-center shadow-inner bg-black shadow-white/70">
                            <Logo className="h-8 w-8 "/>
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

                                    <WalletDisconnectButton />
                                ) : (
                                    
                                    <WalletMultiButton />
                                )
                            }
                        </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar