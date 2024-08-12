import { Button } from '@/components/ui/button'
import React from 'react'

const Dashboard = () => {
    return (
        <div>
            <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                    You have no bounties
                </h3>
                <p className="text-sm text-muted-foreground">
                    You can start selling as soon as you add a product.
                </p>
                <Button className="mt-4">Create Bounty</Button>
            </div>
        </div>
    )
}

export default Dashboard