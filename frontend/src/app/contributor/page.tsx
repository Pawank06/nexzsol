import { Button } from '@/components/ui/button'
import React from 'react'

const Dashboard = () => {
    return (
        <div>
            <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                    You didn&apos;t won any bounties yet.
                </h3>
                <p className="text-sm text-muted-foreground">
                    You can start win your first bounty now.
                </p>
                <Button className="mt-4">Explore bounties</Button>
            </div>
        </div>
    )
}

export default Dashboard