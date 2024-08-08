import React from 'react'
import Logo from '../icons/Logo'
import Link from 'next/link'
import { Button } from '../ui/button'
import {FaGithub, FaWallet} from 'react-icons/fa'

const Navbar = () => {
    return (
        <header className="py-4 border-b md:border-none fixed top-0 left-0 right-0 z-10 bg-white md:bg-white/0">
            <div className="container mx-auto px-4 ">
                <div className="flex justify-between items-center md:border md:p-2.5 rounded-xl max-w-2xl lg:max-w-4xl mx-auto md:bg-white/90 md:backdrop:blur-sm">
                    <div>
                        <div className="border h-10 w-10 rounded-lg inline-flex justify-center items-center shadow-inner">
                            <Logo className="h-8 w-8" />
                        </div>
                    </div>
                        <div className="hidden md:block">
                            <nav className="flex gap-8 text-sm">
                                <Link
                                    className="text-black/70 hover:text-black transition"
                                    href="#"
                                >
                                    Products
                                </Link>
                                <Link
                                    className="text-black/70 hover:text-black transition"
                                    href="#"
                                >
                                    FAQ
                                </Link>
                                <Link
                                    className="text-black/70 hover:text-black transition"
                                    href="#"
                                >
                                    Company
                                </Link>
                                <Link
                                    className="hidden lg:block text-black/70 hover:text-black transition"
                                    href="#"
                                >
                                    Blogs
                                </Link>
                            </nav>
                        </div>
                        <div className="flex gap-4 items-center">
                            <Button className='flex gap-2 shadow-inner shadow-white/70'>
                            <FaWallet /> Connect your wallet
                            </Button>
                        </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar