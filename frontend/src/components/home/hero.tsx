import React from 'react'
import { FaGithub } from 'react-icons/fa'
import { Button } from '../ui/button'

const Hero = () => {
    return (
        <section className="flex items-center justify-center h-screen">
            <div className="container mx-auto px-4">
                <div className="flex justify-center mb-5">
                    <div className="text-sm inline-flex border border-[#222]/10 dark:border-[#fff]/10 px-3 py-1 rounded-lg tracking-tight shadow-inner dark:shadow-white/70">
                        Version 1 is here
                    </div>
                </div>
                <div className="max-w-[600px] lg:max-w-[900px] mx-auto">

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter bg-gradient-to-b from-black to-black/70 dark:bg-gradient-to-b dark:from-white dark:to-white/70  text-transparent bg-clip-text text-center">
                        Turn your github contributions into solana rewards.
                    </h1>

                    <p className="md:text-lg tracking-tighter text-black/70 dark:text-white/70 text-center mt-5 font-medium">
                        Contribute your expertise and earn Solana by solving real-world problems.
                    </p>
                </div>
                <div className="flex items-center justify-center mt-5">
                    <Button className="pl-2 py-6 text-sm md:text-base shadow-inner shadow-white/70" variant="outline">
                        <span className="flex items-center gap-2">
                            <div className="px-3 py-2 rounded-md shadow-inner shadow-white/70 dark:shadow-black bg-black dark:bg-white dark:text-black text-white font-medium">
                                <FaGithub />
                            </div>
                            Get started with github
                        </span>
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default Hero